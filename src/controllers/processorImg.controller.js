import { createCanvas, loadImage } from "canvas";
import { uploadToS3, AWS_BUCKET_NAME } from "../s3config.js";
import templateRegistry from "../core/templateRegistry/TemplateRegistry.js";
import Image from "../models/image.model.js";

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

async function generateVariation(variationNumber, imageUrl, texts, templateName, format) {
    const dimensions = IMAGE_FORMATS[format] || IMAGE_FORMATS.NORMAL_POST;
    const { width, height } = dimensions;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    try {
        // Cargar la imagen base (la generada por IA)
        const baseImage = await loadImage(imageUrl);
        
        // Crear instancia de Template pasando la imagen base
        const Template = templateRegistry.get(templateName);
        if (!Template) {
            throw new Error(`Template ${templateName} no encontrado`);
        }
        
        // Pasar la imagen base al constructor del template
        const template = new Template(ctx, width, height, baseImage);
        
        // Aplicar el template
        await template.draw(texts, AWS_BUCKET_NAME, format);
        
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
        const { imageUrl, overlayText, prompt, templateName, format } = req.body;
        const texts = JSON.parse(overlayText);
        let variations = [];

        try {
            if (templateName === 't_default') {
                variations = await Promise.all([
                    generateVariation(1, imageUrl, texts, templateName, format),
                    generateVariation(2, imageUrl, texts, templateName, format),
                    generateVariation(3, imageUrl, texts, templateName, format),
                    generateVariation(4, imageUrl, texts, templateName, format)
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
