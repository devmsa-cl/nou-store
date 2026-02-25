import { S3Client } from "bun";

export const client = new S3Client({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  bucket: "nou-store",
});

export const uploadS3File = async (
  path: string,
  filename: string,
  buff: Buffer
) => {
  return await client.write(`${path}/${filename}`, buff);
};
