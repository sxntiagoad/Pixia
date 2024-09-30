import axios from 'axios';
import { API_KEY } from '../config.js';
import Image from '../models/image.model.js';

const url = "https://api.segmind.com/v1/flux-realism-lora";

export const generateImage = async (req, res) => {
    const { prompt } = req.body;
  
    try {
      console.log('Iniciando generación de imagen con prompt:', prompt);
      
      const data = {
        prompt,
        steps: 15,
        seed: Math.floor(Math.random() * 1000000),
        scheduler: "simple",
        sampler_name: "euler",
        aspect_ratio: "3:2",
        width: 800,
        height: 533,
        upscale_value: 1.5,
        lora_strength: 0.7,
        samples: 1,
        upscale: false
      };

      const response = await axios.post(url, data, { 
        headers: { 'x-api-key': API_KEY },
        responseType: 'arraybuffer'
      });
  
      console.log('Respuesta recibida de Segmind');
  
      if (response.headers['content-type'].startsWith('image/')) {
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const imageUrl = `data:${response.headers['content-type']};base64,${base64Image}`;
  
        console.log('URL de la imagen generada (base64)');
  
        const newImage = new Image({ prompt, imageUrl });
        await newImage.save();
  
        console.log('Imagen guardada en la base de datos:', newImage);
  
        res.status(200).json({ imageUrl });
      } else {
        console.error('La respuesta no es una imagen:', response.data.toString());
        throw new Error('La respuesta del servidor no es una imagen');
      }
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
