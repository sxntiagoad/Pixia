import { createCanvas, loadImage } from "canvas";
import axios from "axios";
import templateRegistry from "../core/templateRegistry/TemplateRegistry.js";
import {uploadToS3} from "../s3config.js"
import Image from "../models/image.model.js";
//def formatos de post
const SQUARE_FORMAT = { width: 1080, height: 1080 };
const BUCKET_NAME = 'sxntiago-pixia-aws';

export const processImage = async (req, res) => {
    try {
        const { imageUrl, overlayText, prompt, templateName = 't_default' } = req.body;
        const { title, requirements, description } = JSON.parse(overlayText);

        let variations;

        if (templateName === 't_default') {
            // Generar múltiples variaciones
            variations = await Promise.all([
                generateVariation(1, imageUrl, { title, requirements, description }, templateName),
                generateVariation(2, imageUrl, { title, requirements, description }, templateName),
                generateVariation(3, imageUrl, { title, requirements, description }, templateName),
                generateVariation(4, imageUrl, { title, requirements, description }, templateName)
            ]);
        } else {
            // Generar solo una variación
            const singleVariation = await generateVariation(1, imageUrl, { title, requirements, description }, templateName);
            variations = [singleVariation];
        }

        const base64Variations = variations.map((buffer, index) => ({
            id: index + 1,
            data: buffer.toString('base64')
        }));

        res.json({ variations: base64Variations });
    } catch (error) {
        console.error('Error procesando imágenes:', error);
        res.status(500).json({ error: 'Error al procesar imágenes' });
    }
}

// Nueva función para manejar la selección y subida de la imagen
export const uploadSelectedImage = async (req, res) => {
    try {
        const { selectedImageId, imageData, prompt, originalImageUrl, overlayText } = req.body;

        // Convertir base64 a buffer
        const buffer = Buffer.from(imageData, 'base64');

        // Subir la imagen seleccionada a S3
        const fileName = `processed_${Date.now()}_selected_${selectedImageId}.png`;
        const processedImageUrl = await uploadToS3(buffer, fileName, 'image/png');

        console.log('Guardando en la base de datos');
        const newImage = new Image({
            prompt,
            imageUrl: originalImageUrl,
            processedImageUrl,
            overlayText,
        });
        await newImage.save();

        console.log("URL procesada", processedImageUrl);
        console.log('Imagen procesada y guardada exitosamente');
        res.json({ processedImageUrl, imageId: newImage._id });
    } catch (error) {
        console.error('Error al subir la imagen seleccionada:', error);
        res.status(500).json({ error: 'Error al subir la imagen seleccionada' });
    }
};

async function generateVariation(variationNumber, imageUrl, texts, templateName) {
    const { width, height } = SQUARE_FORMAT;
    const bucketName = BUCKET_NAME;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Cargar y ajustar imagen base
    const image = await loadImage(imageUrl);
    await fitImageToCanvas(ctx, image, width, height);

    try {
        // Obtener y aplicar la plantilla
        const TemplateClass = templateRegistry.get(templateName);
        const template = new TemplateClass(ctx, width, height);
        console.log(TemplateClass);
        console.log(templateName);
        await template.draw(texts, bucketName);
    } catch (error) {
        console.error(`Error con plantilla ${templateName}, usando default:`, error);
        const DefaultTemplate = templateRegistry.get('t_default');
        const template = new DefaultTemplate(ctx, width, height);
        await template.draw(texts, bucketName);
    }

    return canvas.toBuffer('image/png');
}

function fitImageToCanvas(ctx, image, canvasWidth, canvasHeight) {
    // Limpiar el canvas primero
    ctx.fillStyle = '#FFFFFF'; // Color de fondo blanco
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const imageAspectRatio = image.width / image.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    let drawWidth, drawHeight, drawX, drawY;

    // Si la imagen es más ancha que alta comparada con el canvas
    if (imageAspectRatio > canvasAspectRatio) {
        // Ajustar al ancho del canvas
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imageAspectRatio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
    } else {
        // Ajustar al alto del canvas
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imageAspectRatio;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
    }
    // Asegurarse de que las dimensiones no sean negativas
    drawWidth = Math.max(0, drawWidth);
    drawHeight = Math.max(0, drawHeight);

    // Dibujar un fondo blanco primero
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Dibujar la imagen manteniendo su proporción
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}
