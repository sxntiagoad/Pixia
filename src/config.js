import dotenv from 'dotenv';
dotenv.config();

export const TOKEN_SECRET = "some secret key";
export const API_KEY = "7cd6153d-f3a0-413a-8211-a94b8387f19e:e9944f0417b0115a1e8c8c6099ae7b9d";

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;

