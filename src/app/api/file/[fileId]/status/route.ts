import { fileUploadStatus } from '@/db/schema';
import { getUserFileById } from '@/helpers/query';
import { authOptions } from '@/lib/auth';
import { getFileFromBucket } from '@/storage/api';
import { getServerSession } from 'next-auth';

type Params = {
	fileId: string;
};
type Query = {
	params: Params;
};

export async function GET(_: Request, { params: { fileId } }: Query) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const userFile = await getUserFileById(fileId, session.user.id);
	if (!userFile) {
    return Response.json({
			status: fileUploadStatus.enumValues[1],
		});
	}


  return Response.json({
		status: userFile.uploadStatus,
	});
}
