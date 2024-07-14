import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME, AWS_REGION_NAME, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } from "./config.js";
import fs from "fs";

const client = new S3Client({
  region: AWS_REGION_NAME,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFile(file) {
  console.log("FILEPATH", file.tempFilePath);
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const result = await client.send(command);

    console.log("File uploaded successfully:", result);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
