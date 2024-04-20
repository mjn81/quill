import * as Minio from 'minio';

const getS3Config = () => {
  const endPoint = process.env.S3_ENDPOINT;
  const useSSL = process.env.S3_USE_SSL === 'true';
  const accessKey = process.env.S3_ACCESS_KEY;
  const secretKey = process.env.S3_SECRET_KEY;
  const port = Number(process.env.S3_PORT);
  if (!endPoint || !accessKey || !secretKey || !port ) {
    throw new Error(
			`Missing S3 configuration. ${endPoint} ${useSSL} ${accessKey} ${secretKey} ${port}`
		);
  }
  return { endPoint, useSSL, accessKey, secretKey, port };
}

export const s3Client = new Minio.Client({
	endPoint: getS3Config().endPoint,
  useSSL: getS3Config().useSSL,
  port: getS3Config().port,
	accessKey: getS3Config().accessKey,
	secretKey: getS3Config().secretKey,
});
 

