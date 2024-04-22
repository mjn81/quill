import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

import { db } from '@/db';
import { messages } from '@/db/schema';
import { bodyMessageValidator } from '@/lib/validation/message';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import { OpenAIEmbeddings } from '@langchain/openai';
import { getOpenAIConfig, openai } from '@/lib/openai';
import { pinecone } from '@/lib/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}
	const body = await req.json();

  try {
    const {message, fileId} = bodyMessageValidator.parse(body);
    const file = await db.query.files.findFirst({
			where: (file) =>
				and(eq(file.id, fileId), eq(file.userId, session.user.id)),
    });

    if (!file) 
      return new Response('File not found', { status: 404 });

    await db.insert(messages).values({
      userId: session.user.id,
      fileId: file.id,
      content: message,
    });
    // Vectorized message

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: getOpenAIConfig().openAIApiKey,
    });
    const pineconeIndex = pinecone.index('quill');

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      namespace: file.id,
      pineconeIndex,
    });


    // change params based on user plan
    const results = await vectorStore.similaritySearch(message, 4);

    const prevMessages = await db
			.select()
			.from(messages)
			.where(eq(messages.fileId, file.id))
			.orderBy(desc(messages.createdAt)).limit(6);

    const formattedMessages = prevMessages.map((m) => ({
      role: m.isUserMessage ? 'user' as const : 'assistant' as const,
      content: m.content,
    }));

    
    const LLMResponse = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			temperature: 0,
			stream: true,
			messages: [
				{
					role: 'system',
					content:
						'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
				},
				{
					role: 'user',
					content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedMessages.map((message) => {
		if (message.role === 'user') return `User: ${message.content}\n`;
		return `Assistant: ${message.content}\n`;
	})}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join('\n\n')}
  
  USER INPUT: ${message}`,
				},
			],
		});
    
    const stream = OpenAIStream(LLMResponse, {
      async onCompletion(completed) {
        await db.insert(messages).values({
          userId: session.user.id,
          fileId: file.id,
          content: completed,
          isUserMessage: false,
        });
      }
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid payload' , { status: 400 });
    }
  }
}
