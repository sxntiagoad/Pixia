import Template from './Template.js';
import TEXT_CONTAINERS from '../../styles/textContainers.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js';

export default class Template1 extends Template {
    async draw(texts, bucketName) {
        const imageKey = "templates/plantilla1.png";
        const { title, requirements, description } = texts;
        
        const style = {
            presetFont: 'bold 80px Arial, sans-serif',     // Fuente para texto predeterminado
            titleFont: 'bold 30px Arial, sans-serif',      // Título reducido
            subtitleFont: 'bold 40px Arial, sans-serif',   // Ajustado para requisitos
            requirementsFont: '24px Arial, sans-serif',    // Para el texto descriptivo
            applyNowFont: 'bold 35px Arial, sans-serif',   // Fuente para "Aplica ahora"
            titleColor: '#000000',                         // Color negro para el título
            subtitleColor: '#FFFFFF',
            shadow: {
                blur: 4,
                offset: 2
            }
        };

        this.setupShadow(style.shadow);

        const containerKeys = Object.keys(TEXT_CONTAINERS);
        const randomKey = containerKeys[Math.floor(Math.random() * containerKeys.length)];
        const randomContainer = TEXT_CONTAINERS[randomKey];
        randomContainer(this.ctx, this.width, this.height);

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
            const templateImage = await loadImage(imageBuffer);
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.drawImage(templateImage, 0, 0, this.width, this.height);


            // Texto predeterminado "Buscamos talento"
            this.drawPresetText(style);
            // Texto predeterminado "Aplica ahora"
            this.drawApplyNowText(style);
            // Ajuste de posiciones según la imagen
            this.drawTitle(title, style);
            this.drawRequirements(requirements, style);
            this.drawDescription(description, style);

            this.ctx.restore();
        } catch (error) {
            console.error('Error en Template1:', error);
            this.drawPresetText(style);
            this.drawApplyNowText(style);
            this.drawTitle(title, style);
            this.drawRequirements(requirements, style);
            this.drawDescription(description, style);
        }
    }

    drawBottomBar(heightPercentage = 0.1) {
        const barHeight = this.height * heightPercentage;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(0, this.height - barHeight, this.width, barHeight);
    }

    drawPresetText(style) {
        this.ctx.font = style.presetFont;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText("Buscamos", 55, 200);
        this.ctx.fillText("talento", 55, 290);
    }

    drawApplyNowText(style) {
        this.ctx.font = style.applyNowFont;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText("¡Aplica ahora!", 120, 850);
    }

    drawTitle(text, style) {
        this.ctx.font = style.titleFont;
        this.ctx.fillStyle = style.titleColor;
        // Título movido más abajo
        this.drawTextSection(text, 125, 430, this.width);
    }

    drawRequirements(text, style) {
        this.ctx.font = style.subtitleFont;
        this.ctx.fillStyle = style.subtitleColor;
        this.drawTextSection(text, 55, 600, this.width);
    }

    drawDescription(text, style) {
        this.ctx.font = style.requirementsFont;
        this.ctx.fillStyle = style.subtitleColor;
        this.drawTextSection(text, 70, 960, this.width);
    }

    drawTextSection(text, startX, startY, maxWidth) {
        const words = text.split(' ');
        let line = '';
        const lineHeight = parseInt(this.ctx.font) * 1.2;
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, startX, startY);
                line = words[n] + ' ';
                startY += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, startX, startY);
    }
}