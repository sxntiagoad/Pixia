import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import { uploadToS3 } from '../s3config.js';
import Image from '../models/image.model.js';

export const processImage = async (req, res) => {
  console.log('Iniciando procesamiento de imagen');
  try {
    const { imageUrl, overlayText, prompt } = req.body;

    console.log('Descargando imagen:', imageUrl);
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    console.log('Imagen descargada exitosamente');
    const image = await loadImage(Buffer.from(response.data));

    console.log('Creando canvas');
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    console.log('Dibujando imagen en el canvas');
    ctx.drawImage(image, 0, 0);

    if (overlayText) {
      console.log('Añadiendo texto a la imagen');
      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(overlayText, canvas.width / 2, canvas.height - 50);
    }

    console.log('Convirtiendo canvas a buffer');
    const buffer = canvas.toBuffer('image/png');
    console.log('buffer:', buffer);
    const fileName = `processed_${Date.now()}.png`;
    console.log('Subiendo imagen a S3');
    const processedImageUrl = await uploadToS3(buffer, fileName, 'image/png');

    console.log('Guardando en la base de datos');
    const newImage = new Image({
      prompt,
      imageUrl,
      processedImageUrl,
      overlayText,
    });
    await newImage.save();

    console.log('Imagen procesada y guardada exitosamente');
    res.json({ processedImageUrl, imageId: newImage._id });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
};