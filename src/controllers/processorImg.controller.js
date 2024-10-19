import { createCanvas, loadImage } from "canvas";
import axios from "axios";
//def formatos de post
const IMAGE_FORMATS = {
    LINKEDIN_POST: { width:1200, height: 627 },
    INSTAGRAM_POST: { width:1080, height: 1080},
    INSTAGRAM_STORY: { width: 1080, height: 1920 },
    FACEBOOK_POST: { width: 1200, height: 630 }
};
//Estilos de decoracion para el contenedor del texto

const TEXT_CONTAINERS = {
    gradientLeft: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    },
    
    gradientBottom: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height * 0.5, width, height * 0.5);
    },
    
    geometricShape: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width * 0.5, 0);
      ctx.lineTo(width * 0.4, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
    },
    
    circularOverlay: (ctx, width, height) => {
      const gradient = ctx.createRadialGradient(
        width * 0.3, height * 0.5, 0,
        width * 0.3, height * 0.5, width * 0.5
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  };
  
  // Estilos de texto
  const TEXT_STYLES = {
    modern: {
      titleFont: 'bold 48px Helvetica',
      titleColor: '#ffffff',
      subtitleFont: '36px Helvetica',
      subtitleColor: '#e0e0e0',
      shadow: { blur: 5, offset: 2 }
    },
    elegant: {
      titleFont: 'bold 52px Georgia',
      titleColor: '#ffd700',
      subtitleFont: '32px Georgia',
      subtitleColor: '#ffffff',
      shadow: { blur: 3, offset: 1 }
    },
    minimal: {
      titleFont: '46px Arial',
      titleColor: '#ffffff',
      subtitleFont: '30px Arial',
      subtitleColor: '#cccccc',
      shadow: { blur: 0, offset: 0 }
    },
    bold: {
      titleFont: 'bold 54px Impact',
      titleColor: '#ffffff',
      subtitleFont: 'bold 38px Arial',
      subtitleColor: '#ffd700',
      shadow: { blur: 8, offset: 3 }
    }
  };

export const processImage = async (req, res) => {
    try {
        const { imageUrl, overlayText, prompt, format } = req.body;
        const { title, requirements, description } = JSON.parse(overlayText);
        //genera 4 variaciones del post distintas
        const variations = await Promise.all([
            generateVariation(1, imageUrl, { title, requirements, description }, format),
            generateVariation(2, imageUrl, { title, requirements, description }, format),
            generateVariation(3, imageUrl, { title, requirements, description }, format),
            generateVariation(4, imageUrl, { title, requirements, description }, format)
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
async function generateVariation(variationNumber, imageUrl, texts, format) {
  // Obtener dimensiones del formato seleccionado
  const dimensions = IMAGE_FORMATS[format] || IMAGE_FORMATS.LINKEDIN_POST;
  const { width, height } = dimensions;

  // Crear canvas y contexto
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Descargar y dibujar imagen base
  const image = await loadImage(imageUrl);
  await fitImageToCanvas(ctx, image, width, height);

  // Seleccionar estilos aleatorios para esta variación
  const containerStyle = getRandomStyle(TEXT_CONTAINERS);
  console.log('Estilo de contenedor seleccionado:', containerStyle.name);

  const textStyle = getRandomStyle(TEXT_STYLES);
  console.log('Estilo de texto seleccionado:', textStyle);

  // Aplicar contenedor de texto aleatorio
  containerStyle(ctx, width, height);

  // Aplicar estilos de texto aleatorios y dibujar
  await drawText(ctx, texts, textStyle, width, height);

  return canvas.toBuffer('image/png');
}

// Función para seleccionar un estilo aleatorio
function getRandomStyle(styles) {
  const keys = Object.keys(styles);
  return styles[keys[Math.floor(Math.random() * keys.length)]];
}

function fitImageToCanvas(ctx, image, canvasWidth, canvasHeight){
    const imageAspectRadio = image.width / image.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;
    let drawWidth, drawHeight, drawX, drawY;

    if(imageAspectRatio > canvasAspectRatio){
        drawHeight = canvasHeight;
        drawWidth = drawHeight * imageAspectRadio;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
    } else {
        drawWidth = canvasWidth;
        drawHeight = drawWidth / imageAspectRadio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
    }
}
// funcion para dibujar texto con estilos
function drawText(ctx, texts, style, width, height){
    const {title, requirements, description} = texts;
    const {titleFont, titleColor, subtitleFont, subtitleColor, shadow} = style;

    //configurar sombra
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offset;
    ctx.shadowOffsetY = shadow.offset;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';

    //dibujar titulo
    ctx.font = titleFont;
    ctx.fillStyle = titleColor;
    drawWrappedText(ctx, title, width * 0.1, height * 0.2, width * 0.8);

    //dibujar requisitos
    ctx.font = subtitleFont;
    ctx.fillStyle = subtitleColor;
    drawWrappedText(ctx, requirements, width * 0.1, height * 0.4, width * 0.8);

    //dibujar descripcion
    drawWrappedText(ctx, description, width * 0.1, height * 0.6, width * 0.8);
}

//funcion auxiliar para envolver texto
function drawWrappedText(ctx, text, x, y, maxWidth) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';
    const lineHeight = parseInt(ctx.font) * 1.2;
  
    for (let n = 0; n < words.length; n++) {
      testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
