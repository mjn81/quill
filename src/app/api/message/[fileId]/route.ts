import { db } from '@/db';
import { files } from '@/db/schema';
import { getHistoryMessages, getUserFiles } from '@/helpers/query';
import { authOptions } from '@/lib/auth';
import { deleteFileBodyValidator } from '@/lib/validation/file';
import { getMessageValidator } from '@/lib/validation/message';
import { deleteFileFromBucket } from '@/storage/api';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

type Query = {
  params: {
    fileId: string;
  }
};

export async function GET(req: Request, { params: { fileId: invalidFileId } }: Query) {
	const session = await getServerSession(authOptions);
	if (!session) return new Response('Unauthorized', { status: 401 });
  // get cursor and limit from query params
  const url = new URL(req.url);
  const cursorParam = url.searchParams.get('cursor');
  const limitParam = url.searchParams.get('limit');
  const invalidCursor = cursorParam ? Number(cursorParam) : undefined;
  const invalidLimit = limitParam ? Number(limitParam) : undefined;
  try {
    const { fileId, cursor, limit } = getMessageValidator.parse({
			fileId: invalidFileId,
			cursor: invalidCursor,
			limit: invalidLimit,
    });
    const messages = await getHistoryMessages(fileId, limit, cursor);
  
    return Response.json(messages, { status: 200 });
    
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response('Invalid request payload', { status: 400 });
    }

    return new Response('Something went wrong. Try again later.', { status: 500 });
  }
}
