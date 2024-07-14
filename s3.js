import { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
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
    return await client.send(command);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export async function getFiles() {
  const command = new ListObjectsCommand({
    Bucket: AWS_BUCKET_NAME,
  });

  const result = await client.send(command);
  return result;
}

export async function getFile(fileName) {
  try {
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
    });
    if (!command) {
      return "No such file";
    }

    return await client.send(command);
  } catch (error) {
    console.error("Error getting file:", error);
  }
}
export async function downloadFile(fileName) {
  try {
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
    });

    if (!command) {
      return "No such file";
    }

    const result = await client.send(command);
    result.Body.pipe(fs.createWriteStream(`./downloads/${fileName}`));
  } catch (error) {
    console.error("Error getting file:", error);
  }
}
