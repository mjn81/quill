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

const s3Config =
  process.env.NODE_ENV === 'development'
    ? {
      endPoint: getS3Config().endPoint,
      useSSL: getS3Config().useSSL,
      port: getS3Config().port,
      accessKey: getS3Config().accessKey,
      secretKey: getS3Config().secretKey,
    }
    : {
        endPoint: getS3Config().endPoint,
        useSSL: getS3Config().useSSL,
        accessKey: getS3Config().accessKey,
        secretKey: getS3Config().secretKey,
      };

export const s3Client = new Minio.Client(s3Config);
 

