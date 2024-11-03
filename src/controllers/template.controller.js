import { loadImageFromS3, uploadToS3, AWS_BUCKET_NAME } from '../s3config.js';
import templateRegistry from '../core/templateRegistry/TemplateRegistry.js';
import { createCanvas, loadImage } from 'canvas';

export const getTemplates = async (req, res) => {
    try {
        console.log('Obteniendo templates...');
        const templates = Array.from(templateRegistry.templates.keys());
        console.log('Templates disponibles:', templates);
        res.json({ templates });
    } catch (error) {
        console.error('Error al obtener templates:', error);
        res.status(500).json({ message: 'Error al obtener templates' });
    }
};

export const processWithTemplate = async (req, res) => {
    try {
        console.log('Procesando imagen con template...');
        const { imageUrl, templateName, texts } = req.body;

        console.log('Datos recibidos:', {
            templateName,
            texts
        });

        if (!AWS_BUCKET_NAME) {
            throw new Error('AWS_BUCKET_NAME no está configurado en el servidor');
        }

        // Obtener el template del registro
        const Template = templateRegistry.get(templateName);
        if (!Template) {
            console.error(`Template '${templateName}' no encontrado`);
            return res.status(404).json({ message: 'Template no encontrado' });
        }

        // Cargar la imagen original
        const image = await loadImage(imageUrl);

        // Crear canvas y contexto
        const canvas = createCanvas(1080, 1080);
        const ctx = canvas.getContext('2d');

        // Dibujar la imagen original
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Crear instancia del template
        const template = new Template(ctx, canvas.width, canvas.height);

        // Procesar la imagen con el template
        await template.draw(texts, AWS_BUCKET_NAME);

        // Convertir canvas a buffer
        const buffer = canvas.toBuffer('image/png');

        // Generar nombre único para el archivo
        const fileName = `processed/${Date.now()}-${templateName}.png`;

        // Subir a S3
        const processedImageUrl = await uploadToS3(buffer, fileName, 'image/png');

        console.log('Imagen procesada exitosamente:', processedImageUrl);
        res.json({ processedImageUrl });
    } catch (error) {
        console.error('Error al procesar imagen con template:', error);
        res.status(500).json({ message: 'Error al procesar imagen con template', error: error.message });
    }
};
