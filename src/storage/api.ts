import type internal from "stream";
import { s3Client } from ".";

export async function checkFileExistsInBucket({
	bucketName,
	fileName,
}: {
	bucketName: string;
	fileName: string;
}) {
	try {
		await s3Client.statObject(bucketName, fileName);
	} catch (error) {
		return false;
	}
	return true;
}
/**
 * 
 * @param bucketName 
 * @description if true returned means bucket created if false returned means bucket exist 
 * @returns boolean
 */
export async function createBucketIfNotExists(bucketName: string) {
	const bucketExists = await s3Client.bucketExists(bucketName);
	if (!bucketExists) {
    await s3Client.makeBucket(bucketName);
  }
  return !bucketExists;
}

/**
 * Delete a bucket
 * @param bucketName name of the bucket to delete
 */
export async function deleteBucket(bucketName: string) {
  await s3Client.removeBucket(bucketName);
}


/**
 * Save file in S3 bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @param file file to save
 */
export async function saveFileInBucket({
  bucketName,
  fileName,
  file,
}: {
  bucketName: string
  fileName: string
  file: Buffer | internal.Readable
}) {
  // Create bucket if it doesn't exist
  console.log('here bucket name', bucketName);
  await createBucketIfNotExists(bucketName)
  console.log('bucket created');
  // check if file exists - optional.
  // Without this check, the file will be overwritten if it exists
  const fileExists = await checkFileExistsInBucket({
    bucketName,
    fileName,
  })
 
  if (fileExists) {
    throw new Error('File already exists')
  }
 
  // Upload image to S3 bucket
  await s3Client.putObject(bucketName, fileName, file)
}

/**
 * Retrieve a file from a bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file to retrieve
 * @returns Buffer containing the file content
 */
export async function getFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}): Promise<Buffer> {
  const dataStream = await s3Client.getObject(bucketName, fileName);
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    dataStream.on("data", (chunk) => chunks.push(chunk));
    dataStream.on("end", () => resolve(Buffer.concat(chunks)));
    dataStream.on("error", (error) => reject(error));
  });
}

/**
 * Delete a file from a bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file to delete
 */
export async function deleteFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  await s3Client.removeObject(bucketName, fileName);
}
