import { getUserFileById } from "@/helpers/query";
import { authOptions } from "@/lib/auth";
import { getFileFromBucket } from "@/storage/api";
import { getServerSession } from "next-auth";

type Params = {
  fileId: string;
}
type Query = {
  params: Params;
}

export async function GET(_: Request, { params: {fileId} }: Query) { 
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userFile = await getUserFileById(fileId, session.user.id);
  if (!userFile) {
    return new Response('Not Found', { status: 404 });
  }
  
  const file = await getFileFromBucket({
    bucketName: session.user.id,
    fileName: userFile.id,
  });

  return new Response(file);
}