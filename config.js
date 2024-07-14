import { config } from "dotenv";

config();

export const AWS_BUCKET_NAME = process.env.BUCKET_NAME;
export const AWS_REGION_NAME = process.env.AWS_REGION_NAME;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
