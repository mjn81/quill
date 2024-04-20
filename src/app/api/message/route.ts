import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { fileTypeFromBuffer } from 'file-type';
import { ALLOWED_FILE_MIMES } from '@/constants';
import { db } from '@/db';
import { fileUploadStatus, files, messages } from '@/db/schema';
import { createBucketIfNotExists, saveFileInBucket } from '@/storage/api';
import { bodyMessageValidator } from '@/lib/validation/message';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';

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

    const dbMessage = await db.insert(messages).values({
      userId: session.user.id,
      fileId: file.id,
      content: message,
    }).returning();


  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid payload' , { status: 400 });
    }
  }
}
