import Template from './Template.js';
import TEXT_CONTAINERS from '../../styles/textContainers.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js'; // Asegúrate de que la ruta sea correcta

export default class Template1 extends Template {
    async draw(texts, bucketName) {
        const imageKey = "templates/plantilla1.png";
        const { title, requirements, description } = texts;
        
        const style = {
            titleFont: 'bold 50px Arial, sans-serif',
            titleColor: '#FFFFFF',
            subtitleFont: 'bold 20px Arial, sans-serif',
            subtitleColor: '#FFFFFF',
            shadow: {
                blur: 4,
                offset: 2
            }
        };

        this.setupShadow(style.shadow);

        // Cargar y dibujar la imagen desde S3
        await this.drawImageFromS3(bucketName, imageKey);

        this.drawBottomBar();

        this.drawTitle(title, style);
        this.drawRequirements(requirements, style);
        this.drawDescription(description, style);
    }

    async drawImageFromS3(bucketName, imageKey) {
        try {
            const imageBuffer = await loadImageFromS3(bucketName, imageKey);
            const image = await loadImage(imageBuffer);
            // Dibuja la imagen sobre el canvas
            this.ctx.drawImage(image, 0, 0, this.width, this.height);
        } catch (error) {
            console.error('Error al cargar la imagen desde S3:', error);
        }
    }

    drawTitle(text, style) {
        this.ctx.font = style.titleFont;
        this.ctx.fillStyle = style.titleColor;
        this.drawTextSection(text, 60, 50, this.width / 2);
    }

    drawRequirements(text, style) {
        this.ctx.font = style.subtitleFont;
        this.ctx.fillStyle = style.subtitleColor;
        this.drawTextSection(text, 40, 250, this.width / 2);
    }

    drawDescription(text, style) {
        this.ctx.font = style.subtitleFont;
        this.ctx.fillStyle = style.subtitleColor;
        this.drawTextSection(text, 40, 450, this.width / 2);
    }
}
