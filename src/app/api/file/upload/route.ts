import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { fileTypeFromBuffer } from 'file-type';
import { ALLOWED_FILE_MIMES } from "@/constants";
import { db } from "@/db";
import { fileUploadStatus, files } from "@/db/schema";
import { createBucketIfNotExists, saveFileInBucket } from "@/storage/api";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  const fd = await req.formData();

  const fileData = fd.get('file') as File;

  if (!fileData) {
    return new Response('No file found', { status: 400 });
  }
  
  const fileBuffer = Buffer.from(await fileData.arrayBuffer());
  // check file type to be PDF
  const ft = await fileTypeFromBuffer(fileBuffer);
	if (!ALLOWED_FILE_MIMES.includes(ft?.mime ?? '')) {
    return new Response('Uploaded format is not allowed', {
			status: 400,
		});
	}
  try {
    const trResponse = await db.transaction(async tx => {
      const dbFileResponse = await tx
				.insert(files)
				.values({
					name: fileData.name,
					userId: session.user.id,
          mimetype: fileData.type,
          size: fileData.size,
					uploadStatus: fileUploadStatus.enumValues[1],
				})
				.returning();
      const dbFile = dbFileResponse[0];
      // save file to storage
      await saveFileInBucket({
        bucketName: session.user.id,
        file: fileBuffer,
        fileName: dbFile.id
      });

      return dbFile;
    })

    return Response.json(trResponse, {
      status: 201
    });
  
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
			return new Response(e.message, { status: 400 });
    }
    
    return new Response('something went wrong', {
			status: 500,
		});
  }
}