import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (file: File, folderName?: string) => {
  const fileName = `${folderName ? `${folderName}/` : ''}${Math.random()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  let command: PutObjectCommand;

  if (process.env.AWS_BUCKET_NAME)
    command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });
  else throw new Error('Bucket name is not defined');

  await s3Client.send(command);

  return `${process.env.AWS_CLOUDFRONT_URL}/${fileName}`;
};

export const deleteFromS3 = async (objectUrl: string) => {
  const fileName = objectUrl.replace(`${process.env.AWS_CLOUDFRONT_URL}/`, '');
  let command: DeleteObjectCommand;

  if (process.env.AWS_BUCKET_NAME)
    command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    });
  else throw new Error('Bucket name is not defined');

  await s3Client.send(command);
};
