import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } from './config.js';

console.log('AWS_BUCKET_NAME en s3config:', AWS_BUCKET_NAME); // Añade este log para depuración
console.log('AWS_BUCKET_REGION en s3config:', AWS_BUCKET_REGION);

const s3Client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  }
});

const uploadToS3 = async (buffer, fileName, contentType) => {
  console.log('Iniciando uploadToS3');
  console.log('Bucket:', AWS_BUCKET_NAME);
  console.log('Region:', AWS_BUCKET_REGION);
  console.log('FileName:', fileName);
  
  if (!AWS_BUCKET_NAME) {
    throw new Error('AWS_BUCKET_NAME is not defined');
  }

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    },
  });

  try {
    const result = await upload.done();
    return result.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

export { s3Client, AWS_BUCKET_NAME, uploadToS3, AWS_BUCKET_REGION };