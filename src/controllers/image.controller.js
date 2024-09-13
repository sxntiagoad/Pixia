import * as fal from "@fal-ai/serverless-client";
import { API_KEY } from '../config.js';
import Image from '../models/image.model.js';

// Configura la API Key
fal.config({
  credentials: API_KEY,
});

export const generateImage = async (req, res) => {
    const { prompt } = req.body;
  
    try {
      console.log('Iniciando generación de imagen con prompt:', prompt);
      
      const result = await fal.subscribe("fal-ai/flux/dev", {
        input: { prompt },
        logs: true,
        onQueueUpdate: (update) => {
          console.log('Estado de la cola:', update.status);
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
  
      console.log('Respuesta completa de fal.ai:', JSON.stringify(result, null, 2));
  
      let imageUrl;
      if (result.images && Array.isArray(result.images) && result.images.length > 0) {
        imageUrl = result.images[0].url;
      } else if (result.image) {
        imageUrl = result.image;
      } else if (result.data && result.data.images && Array.isArray(result.data.images) && result.data.images.length > 0) {
        imageUrl = result.data.images[0].url;
      } else {
        console.error('Estructura de respuesta inesperada:', result);
        throw new Error('No se pudo encontrar la URL de la imagen en la respuesta');
      }
  
      console.log('URL de la imagen generada:', imageUrl);
  
      const newImage = new Image({ prompt, imageUrl });
      await newImage.save();
  
      console.log('Imagen guardada en la base de datos:', newImage);
  
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('Error detallado al generar la imagen:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        mensaje: 'Error al generar la imagen', 
        error: error.message,
        detalles: error.stack
      });
    }
};

export const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    res.status(500).json({ mensaje: 'Error al obtener las imágenes', error: error.message });
  }
};
