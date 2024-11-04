import { createCanvas, loadImage } from "canvas";
import { uploadToS3, AWS_BUCKET_NAME } from "../s3config.js";
import {getProcessedImageUrlsByUserId} from "./image.controller.js";
import templateRegistry from "../core/templateRegistry/TemplateRegistry.js";
import Image from "../models/image.model.js";

const SQUARE_FORMAT = { width: 1080, height: 1080 };

async function generateVariation(variationNumber, imageUrl, texts, templateName) {
    const { width, height } = SQUARE_FORMAT;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    try {
        // Dibujar fondo blanco primero
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // 1. Cargar y dibujar la imagen base (la generada por IA)
        const baseImage = await loadImage(imageUrl);
        
        // Calcular dimensiones para mantener la proporción
        const scale = Math.max(width / baseImage.width, height / baseImage.height);
        const newWidth = baseImage.width * scale;
        const newHeight = baseImage.height * scale;
        const x = (width - newWidth) / 2;
        const y = (height - newHeight) / 2;

        // Dibujar la imagen base
        ctx.drawImage(baseImage, x, y, newWidth, newHeight);

        // 2. Obtener y aplicar la plantilla
        const Template = templateRegistry.get(templateName);
        if (!Template) {
            throw new Error(`Template ${templateName} no encontrado`);
        }
        
        // Guardar el estado actual del canvas
        ctx.save();
        
        // 3. Crear instancia del template y aplicarlo sobre la imagen base
        const template = new Template(ctx, width, height);
        await template.draw(texts, AWS_BUCKET_NAME);
        
        // Restaurar el estado del canvas
        ctx.restore();

        return canvas.toBuffer('image/png');
    } catch (error) {
        throw error;
    }
}

function fitImageToCanvas(ctx, image, canvasWidth, canvasHeight) {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Dibujar fondo blanco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height);
    const newWidth = image.width * scale;
    const newHeight = image.height * scale;
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;

    // Dibujar la imagen manteniendo la proporción
    ctx.drawImage(image, x, y, newWidth, newHeight);
}

export const processImage = async (req, res) => {
    try {
        const { imageUrl, overlayText, prompt, templateName = 't_default' } = req.body;
        const texts = JSON.parse(overlayText);
        let variations = [];

        try {
            if (templateName === 't_default') {
                variations = await Promise.all([
                    generateVariation(1, imageUrl, texts, templateName),
                    generateVariation(2, imageUrl, texts, templateName),
                    generateVariation(3, imageUrl, texts, templateName),
                    generateVariation(4, imageUrl, texts, templateName)
                ]);
            } else {
                const variation = await generateVariation(1, imageUrl, texts, templateName);
                variations = [variation];
            }
        } catch (error) {
            const variation = await generateVariation(1, imageUrl, texts, 't_default');
            variations = [variation];
        }

        const base64Variations = variations.map((buffer, index) => ({
            id: index + 1,
            data: buffer.toString('base64')
        }));

        res.json({ variations: base64Variations });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error al procesar imágenes',
            details: error.message 
        });
    }
};

export const uploadSelectedImage = async (req, res) => {
    try {
        const { selectedImageId, imageData, prompt, originalImageUrl, overlayText, userId } = req.body;
        console.log('userid', userId);
        const buffer = Buffer.from(imageData, 'base64');
        const fileName = `processed/${userId}_${Date.now()}.png`;
        const processedImageUrl = await uploadToS3(buffer, fileName, 'image/png');
        const urlsGenerated = await getProcessedImageUrlsByUserId(userId);
        const updatedImage = await Image.findOneAndUpdate(
            { imageUrl: originalImageUrl }, // Criterio de búsqueda basado en imageUrl
            {
                prompt,
                processedImageUrl,
                overlayText,
            },
            { new: true } // Retorna el documento actualizado
        );

        if (!updatedImage) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }

        res.json({ 
            processedImageUrl, 
            imageId: updatedImage._id
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error al subir la imagen seleccionada',
            details: error.message 
        });
    }
};
