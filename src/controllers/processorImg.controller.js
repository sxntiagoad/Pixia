import { createCanvas, loadImage } from "canvas";
import axios from "axios";
import {uploadToS3} from "../s3config.js"
import TEXT_CONTAINERS from "../styles/textContainers.js";
import TEXT_STYLES from "../styles/textStyles.js";
import Image from "../models/image.model.js";
//def formatos de post
const SQUARE_FORMAT = { width: 1080, height: 1080 };

export const processImage = async (req, res) => {
    try {
        const { imageUrl, overlayText, prompt } = req.body;
        const { title, requirements, description } = JSON.parse(overlayText);
        //genera 4 variaciones del post distintas
        const variations = await Promise.all([
            generateVariation(1, imageUrl, { title, requirements, description }),
            generateVariation(2, imageUrl, { title, requirements, description }),
            generateVariation(3, imageUrl, { title, requirements, description }),
            generateVariation(4, imageUrl, { title, requirements, description })
        ]);

        const base64Variations = variations.map((buffer, index)=> {
            return {
                id: index + 1,
                data: buffer.toString('base64')
            };
        });
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

// Función para generar una variación específica
async function generateVariation(variationNumber, imageUrl, texts) {

    const usedStyles = new Set();

    // Obtener dimensiones del formato seleccionado
    const { width, height } = SQUARE_FORMAT;

    // Crear canvas y contexto
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Descargar y dibujar imagen base
    const image = await loadImage(imageUrl);
    await fitImageToCanvas(ctx, image, width, height);

    // Seleccionar estilos aleatorios para esta variación
    const containerStyle = getRandomStyle(TEXT_CONTAINERS, usedStyles);
    if (!containerStyle) {
        throw new Error('No se pudo seleccionar un estilo de contenedor');
    }
    console.log('Estilo de contenedor seleccionado:', containerStyle.name);

    // Aplicar contenedor de texto aleatorio y obtener dimensiones
    const container = containerStyle(ctx, width, height);

    // Seleccionar estilos de texto aleatorios
    const textStyle = getRandomStyle(TEXT_STYLES, usedStyles);
    if (!textStyle) {
        throw new Error('No se pudo seleccionar un estilo de texto');
    }
    console.log('Estilo de texto seleccionado:', textStyle);

    // Aplicar estilos de texto aleatorios y dibujar
    await drawText(ctx, texts, textStyle, width, height, container);

    return canvas.toBuffer('image/png');
}

// Función para seleccionar un estilo aleatorio sin repeticiones en la misma iteración
function getRandomStyle(styles, usedStyles) {
    const keys = Object.keys(styles);

    // Si todos los estilos han sido utilizados, no se puede seleccionar más
    if (usedStyles.size === keys.length) {
        return null; // O puedes lanzar un error si prefieres
    }

    let randomKey;
    do {
        randomKey = keys[Math.floor(Math.random() * keys.length)];
    } while (usedStyles.has(randomKey)); // Asegurarse de que no se repita

    // Agregar el estilo seleccionado al conjunto de utilizados
    usedStyles.add(randomKey);

    return styles[randomKey];
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
// funcion para dibujar texto con estilos
function drawText(ctx, texts, style, width, height, container){
    const { title, requirements, description } = texts;
    const { titleFont, titleColor, subtitleFont, subtitleColor, shadow } = style;

    // Configurar sombra
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offset;
    ctx.shadowOffsetY = shadow.offset;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';

    // Dibujar título
    ctx.font = titleFont;
    ctx.fillStyle = titleColor;
    drawTextSection(ctx, title, 50, 40, width / 2); // Usar la mitad del ancho

    // Dibujar requisitos
    ctx.font = subtitleFont;
    ctx.fillStyle = subtitleColor;
    drawTextSection(ctx, requirements, 20, 200, width / 4); // Usar la mitad del ancho

    // Dibujar descripción
    ctx.font = subtitleFont;
    ctx.fillStyle = subtitleColor;
    drawTextSection(ctx, description, 20, 300, width / 4); // Usar la mitad del ancho
}

// Nueva función para dibujar secciones de texto
function drawTextSection(ctx, text, fontSize, textY, maxWidth) {
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    const words = text.split(' ');
    let line = '';
    const textX = 10; // Ajusta la posición horizontal según sea necesario
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, textX, textY); // Dibuja la línea
            line = words[n] + ' ';
            textY += fontSize + 10; // Espacio entre líneas
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, textX, textY); // Dibuja la última línea
}

