import axios from 'axios';
import { API_KEY } from '../config.js';
import { listObjectsFromS3 } from '../s3config.js'
import Image from '../models/image.model.js';
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } from "../config.js";
import { improvePrompt } from './prompt.controller.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client} from '../s3config.js';
import { loadImageFromS3 } from '../s3config.js';

const url = "https://api.segmind.com/v1/flux-realism-lora";

// Definir las dimensiones según el formato
const IMAGE_FORMATS = {
    NORMAL_POST: {
        width: 1080,
        height: 1080,
        aspectRatio: "1:1"
    },
    STORIES_POST: {
        width: 1080,
        height: 1920,
        aspectRatio: "9:16"
    }
};

export const generateImage = async (req, res) => {
    const { prompt, format = 'NORMAL_POST' } = req.body;
    
    try {
        const improvedPrompt = await improvePrompt(prompt);
        console.log('Prompt mejorado:', improvedPrompt);

        // Obtener dimensiones según el formato
        const dimensions = IMAGE_FORMATS[format] || IMAGE_FORMATS.NORMAL_POST;

        const data = {
            prompt: improvedPrompt,
            steps: 15,
            seed: Math.floor(Math.random() * 1000000),
            scheduler: "dpm++2m",
            sampler_name: "euler_a",
            width: dimensions.width,
            height: dimensions.height,
            aspect_ratio: dimensions.aspectRatio,
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
                imageUrl,
                status: 'generated',
                metadata: {
                    width: dimensions.width,
                    height: dimensions.height,
                    format: format,
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
                id: newImage._id,
                format: format,
                dimensions: dimensions
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


export const getProcessedImageUrlsByUserId = async (req, res) => {
    try {
        console.log(`userId recibido: ${req.params.userId}`);
        const { userId } = req.params;
        console.log('userId recibido:', userId);

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const images = await Image.find({
            processedImageUrl: { $regex: `processed/${userId}_` }
        }).select('processedImageUrl');

        if (images.length === 0) {
            return res.status(404).json({ message: "No images found for the specified user ID" });
        }

        const imageUrls = images.map(image => image.processedImageUrl);
        return res.status(200).json(imageUrls);
    } catch (error) {
        console.error('Error while fetching images:', error);
        return res.status(500).json({ message: error.message });
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

export const downloadImage = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const key = `processed/${fileName}`;
    
    try {
      // Usar la función existente loadImageFromS3
      const imageBuffer = await loadImageFromS3(AWS_BUCKET_NAME, key);
      
      // Configurar los headers de la respuesta
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      
      // Enviar el buffer
      res.send(imageBuffer);

    } catch (s3Error) {
      console.error('Error específico de S3:', s3Error);
      if (s3Error.message.includes('404')) {
        return res.status(404).json({ message: 'Imagen no encontrada' });
      }
      throw s3Error;
    }

  } catch (error) {
    console.error('Error al descargar la imagen:', error);
    res.status(500).json({ 
      message: 'Error al descargar la imagen',
      error: error.message 
    });
  }
};