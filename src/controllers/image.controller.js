import axios from 'axios';
import { API_KEY } from '../config.js';
import Image from '../models/image.model.js';

const url = "https://api.segmind.com/v1/flux-realism-lora";

export const generateImage = async (req, res) => {
    const { prompt, improvedPrompt } = req.body;
    
    try {
      console.log('Iniciando generación con prompt:', improvedPrompt || prompt);

      const data = {
        prompt: improvedPrompt || prompt,
        steps: 15,
        seed: Math.floor(Math.random() * 1000000),
        scheduler: "dpm++2m",
        sampler_name: "euler_a",
        aspect_ratio: "1:1",
        width: 1080,
        height: 1080,
        upscale_value: 1.0,
        lora_strength: 0.6,
        samples: 1,
        upscale: false
      };

      console.log('Enviando datos a Segmind:', data);

      const response = await axios.post(url, data, { 
        headers: { 
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      });
  
      console.log('Respuesta recibida de Segmind');
  
      if (response.headers['content-type'].startsWith('image/')) {
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const imageUrl = `data:${response.headers['content-type']};base64,${base64Image}`;
  
        // Crear y guardar la imagen DESPUÉS de tener la URL
        const newImage = new Image({ 
          prompt,
          improvedPrompt,
          imageUrl, // Ahora sí tenemos la URL
          status: 'generated',
          metadata: {
            width: 512,
            height: 512,
            generationParams: {
              steps: 15,
              scheduler: "dpm++2m",
              sampler_name: "euler_a",
              lora_strength: 0.6
            }
          }
        });

        await newImage.save();
  
        res.status(200).json({ 
          imageUrl,
          improvedPrompt,
          id: newImage._id
        });
      } else {
        throw new Error('La respuesta del servidor no es una imagen');
      }
    } catch (error) {
      console.error('Error detallado al generar la imagen:', error);
      
      let errorMessage = 'Error al generar la imagen';
      let errorDetails = '';

      if (error.response) {
        const responseData = error.response.data instanceof Buffer 
          ? error.response.data.toString()
          : error.response.data;

        console.error('Respuesta de error completa:', responseData);
        
        if (error.response.status === 400) {
          errorMessage = 'Error en los parámetros de la solicitud. Por favor, verifica el prompt e intenta de nuevo.';
          errorDetails = responseData;
        } else if (error.response.status === 403) {
          errorMessage = 'Error de autenticación. Verifica tu API key.';
        } else {
          errorMessage = `Error del servidor: ${error.response.status}`;
        }
      }
      
      res.status(500).json({ 
        mensaje: errorMessage, 
        error: error.message,
        detalles: errorDetails
      });
    }
};

export const getImages = async (req, res) => {
  try {
    const images = await Image.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(images);
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener las imágenes', 
      error: error.message 
    });
  }
};
