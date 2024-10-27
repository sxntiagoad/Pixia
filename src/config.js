import dotenv from 'dotenv';
dotenv.config();

export const TOKEN_SECRET = "some secret key";
export const API_KEY = "SG_f7428b2868e07350";

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;

