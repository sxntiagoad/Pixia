import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import { uploadToS3 } from '../s3config.js';
import Image from '../models/image.model.js';

export const processImage = async (req, res) => {
  console.log('Iniciando procesamiento de imagen');
  try {
    const { imageUrl, overlayText, prompt } = req.body;
    const { title, requirements, description } = JSON.parse(overlayText);

    console.log('Descargando imagen:', imageUrl);
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 20000,
    });

    console.log('Imagen descargada exitosamente');
    const image = await loadImage(Buffer.from(response.data));

    console.log('Creando canvas');
    const canvasWidth = 1200;
    const canvasHeight = 675; // Mantenemos el aspect ratio 16:9
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Rellenar el canvas con fondo negro
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calcular dimensiones para la imagen principal
    const imageAspectRatio = image.width / image.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    let drawWidth, drawHeight, drawX, drawY;

    if (imageAspectRatio > canvasAspectRatio) {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imageAspectRatio;
      drawY = 0;
      drawX = canvasWidth - drawWidth;
    } else {
      drawWidth = canvasWidth * 0.7; // La imagen ocupa el 70% del ancho del canvas
      drawHeight = drawWidth / imageAspectRatio;
      drawX = canvasWidth - drawWidth;
      drawY = (canvasHeight - drawHeight) / 2;
    }

    // Dibujar la imagen principal
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    // Crear gradiente para difuminar el fondo negro con la imagen
    const gradient = ctx.createLinearGradient(0, 0, drawX + drawWidth * 0.3, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, drawX + drawWidth * 0.3, canvasHeight);

    if (overlayText) {
      console.log('Añadiendo texto a la imagen');
      ctx.textAlign = 'left';
      const textX = canvasWidth * 0.05;
      let textY = canvasHeight * 0.1;
      const maxWidth = canvasWidth * 0.4;

      // Función para dibujar texto con saltos de línea
      const drawText = (text, fontSize, lineHeight) => {
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, textX, textY);
            line = words[n] + ' ';
            textY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, textX, textY);
        textY += lineHeight;
      };

      // Configuración de sombra para todo el texto
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Dibujar título
      ctx.fillStyle = 'white';
      drawText(title, 48, 60);

      // Espacio entre título y requisitos
      textY += 20;

      // Dibujar requisitos
      ctx.fillStyle = '#FFD700'; // Color dorado para los requisitos
      drawText(requirements, 36, 45);

      // Espacio entre requisitos y descripción
      textY += 20;

      // Dibujar descripción
      ctx.fillStyle = '#E0E0E0'; // Color gris claro para la descripción
      drawText(description, 24, 30);
    }

    console.log('Convirtiendo canvas a buffer');
    const buffer = canvas.toBuffer('image/png');
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
    console.log("url procesada", processedImageUrl);
    console.log('Imagen procesada y guardada exitosamente');
    res.json({ processedImageUrl, imageId: newImage._id });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
};