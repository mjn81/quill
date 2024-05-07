import { authOptions } from "@/lib/auth";
import { User, getServerSession } from "next-auth";
import { fileTypeFromBuffer } from 'file-type';
import { ALLOWED_FILE_MIMES } from "@/constants";
import { db } from "@/db";
import { fileUploadStatus, files } from "@/db/schema";
import { saveFileInBucket } from "@/storage/api";
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import {OpenAIEmbeddings} from '@langchain/openai';
import {PineconeStore} from '@langchain/pinecone';
import { pinecone } from "@/lib/pinecone";
import { eq } from "drizzle-orm";
import { getOpenAIConfig } from "@/lib/openai";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { FREE_UPLOAD_FILE_SIZE, PAYED_UPLOAD_FILE_SIZE, PLANS } from "@/constants/stripe";




const processFile = async ({
	subscription,
	fileId,
	fileBlob,
}: {
	subscription: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
	fileId: string;
	fileBlob: Blob;
}) => {
	try {
		const pdfLoader = new PDFLoader(fileBlob);

		const pageLevelDocs = await pdfLoader.load();

		// limit page based on plans
		const pageAmount = pageLevelDocs.length;

    const plan = PLANS.find((plan) => plan.name === subscription.name);
    const isPlannedExceeded = !!plan && pageAmount > plan.pagesPerPdf; 
		const isFreeExceeded =
			pageAmount > PLANS.find((plan) => plan.name === 'Free')!.pagesPerPdf;

		if (
			(subscription.isSubscribed && isPlannedExceeded) ||
			(!subscription.isSubscribed && isFreeExceeded)
		) {
			await db
				.update(files)
				.set({
					uploadStatus: 'FAILED',
				})
				.where(eq(files.id, fileId));
			return;
		}

    // vectorized and index the pdf
		const pineconeIndex = pinecone.index('quill');

		const embeddings = new OpenAIEmbeddings({
			openAIApiKey: getOpenAIConfig().openAIApiKey,
		});

		await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
			pineconeIndex,
			namespace: fileId,
		});

		await db
			.update(files)
			.set({
				uploadStatus: fileUploadStatus.enumValues[2],
				updatedAt: new Date(),
			})
			.where(eq(files.id, fileId));
	} catch (e) {
		console.log(e);
		await db
			.update(files)
			.set({
				uploadStatus: fileUploadStatus.enumValues[3],
				updatedAt: new Date(),
			})
			.where(eq(files.id, fileId));
	}
};

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
    return new Response('Uploaded format is not accepted', {
			status: 400,
		});
	}
  try {
    const subscription = await getUserSubscriptionPlan();
    // make sure cannot upload more than what plan he has
		if (
			(subscription.isSubscribed && fileData.size > PAYED_UPLOAD_FILE_SIZE) ||
			(!subscription.isSubscribed && fileData.size > FREE_UPLOAD_FILE_SIZE)
		) {
      return new Response(
				'File size exceeded your plan. please update your plan to upload larger files.',
				{
					status: 400,
				}
			);
		}

		const fileCount = (await db.select().from(files).where(eq(files.userId, session.user.id))).length;
		
		const quota = subscription.quota;
		if (fileCount >= quota) {
			return new Response('You have reached your file upload limit', {
				status: 400,
			});
		}

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
    });

    
    // process file

    const fileBlob = new Blob([fileBuffer]);

    processFile({
      subscription,
      fileId: trResponse.id,
      fileBlob,
    });

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