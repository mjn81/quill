import { db } from '@/db';
import { files } from '@/db/schema';
import { getUserFiles } from '@/helpers/query';
import { authOptions } from '@/lib/auth';
import { deleteFileBodyValidator } from '@/lib/validation/file';
import { deleteFileFromBucket } from '@/storage/api';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { ZodError } from 'zod';

export async function GET(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}
	try {
		const userFiles = await getUserFiles(session.user.id);

		return Response.json(userFiles, { status: 200 });

	} catch (e) {
		if (e instanceof Error) {
			return new Response(e.message, { status: 500 });
		}

		return new Response('Internal Server Error', { status: 500 });
	}
}


export async function DELETE(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}
	const body = await req.json();
	try {
		const {id} = deleteFileBodyValidator.parse(body);
		
		const file = await db.query.files.findFirst({
			where: (file) => eq(file.id, id) ,
		});

		if (!file || file.userId !== session.user.id) {
			return new Response('File Not Found', { status: 404 });
		}	

		await db.delete(files).where(eq(files.id, id));
		await deleteFileFromBucket({
			bucketName: session.user.id,
			fileName: id,
		});
		return new Response('OK', { status: 200 });
	} catch (error) {
		if (error instanceof ZodError)
			return new Response('Invalid request payload', { status: 400 });
		if (error instanceof Error)
			return new Response(error.message, { status: 500 });

		return new Response('Internal Server Error', { status: 500 });
	}
}