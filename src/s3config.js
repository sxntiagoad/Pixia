import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } from './config.js';

const s3Client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  }
});

const uploadToS3 = async (buffer, fileName, contentType) => {
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

const loadImageFromS3 = async (bucketName, key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const data = await s3Client.send(command);
    const streamToBuffer = async (stream) => {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    };

    return await streamToBuffer(data.Body);
  } catch (error) {
    console.error("Error al cargar la imagen desde S3:", error);
    throw error;
  }
};

export { s3Client, AWS_BUCKET_NAME, uploadToS3, loadImageFromS3, AWS_BUCKET_REGION };