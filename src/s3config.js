import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
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
    console.log('S3: Intentando cargar imagen:', key, 'desde bucket:', bucketName);
    
    const publicUrl = `https://${bucketName}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${key}`;
    console.log('S3: Intentando con URL pública:', publicUrl);
    
    const response = await fetch(publicUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log('S3: Imagen obtenida exitosamente vía URL pública');
    return Buffer.from(arrayBuffer);
    
  } catch (error) {
    console.error("S3: Error al cargar la imagen:", error);
    throw new Error(`Error al cargar la imagen desde S3: ${error.message}`);
  }
};
export const listImagesInFolder = async () => {
    const params = {
        Bucket: 'sxntiago-pixia-aws',
        Prefix: 'png_templates/',
    };

    try {
        const command = new ListObjectsV2Command(params);
        const data = await s3Client.send(command);
        
        // Filtrar y mapear directamente a un array de URLs
        const imageUrls = data.Contents
            .filter(item => item.Key.endsWith('.jpg') || item.Key.endsWith('.png') || item.Key.endsWith('.jpeg'))
            .map(item => `https://${params.Bucket}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${item.Key}`);

        console.log('URLs de imágenes encontradas:', imageUrls);
        return imageUrls;
    } catch (error) {
        console.error('Error al listar imágenes en S3:', error);
        throw new Error(`Error al listar imágenes: ${error.message}`);
    }
};
export const listObjectsFromS3 = async() => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Prefix: 'processed/'
  };
  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    return data.Contents;
  } catch (error) {
    console.log('Error listing objects from S3:', error);
  }
}

export { s3Client, AWS_BUCKET_NAME, uploadToS3, loadImageFromS3, AWS_BUCKET_REGION };