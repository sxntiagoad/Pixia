import Template from './Template.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js';

export default class Template9 extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/templates/template9.png';
    static templateKey = "templates/template9.png";
    static DEFAULT_STYLE = {
        titleFont: 'bold 80px "Bodoni Moda", serif',
        subtitleFont: 'bold 40px "Poppins", sans-serif',
        requirementsFont: '24px Arial, sans-serif',
        titleColor: '#FFFFFF',
        subtitleColor: '#FFFFFF',
        shadow: {
            blur: 4,
            offset: 2
        },
        logoUrl: 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/logo.png'
    };
    static customStyle = {
        imageType: 'custom',
        backgroundColor: '#000000',
        baseImage: {
            width: 1200,
            height: 1200,
            x: 420,
            y: -200
        }
    }

    async draw(texts, bucketName) {
        try {
            if (!texts || !bucketName) {
                throw new Error('Parámetros inválidos');
            }
            const { title, requirements, description } = texts;

            // 1. Dibujar imagen base
            const baseImageResult = await this.drawBaseImage(Template9.customStyle);
            if (!baseImageResult) {
                throw new Error('Error al dibujar imagen base');
            }

            // 2. Cargar y dibujar plantilla
            try {
                const templateBuffer = await loadImageFromS3(bucketName, Template9.templateKey);
                const templateImage = await loadImage(templateBuffer);
                this.ctx.drawImage(templateImage, 0, 0, this.width, this.height);
            } catch (error) {
                console.error('Error al cargar plantilla:', error);
                throw error;
            }

            // 3. Dibujar textos y elementos
            this.setupShadow(Template9.DEFAULT_STYLE.shadow);
            await this.drawBottomBar(0.07);
            await this.drawTitle(title);
            await this.drawText2(requirements);
            await this.drawText3(description);

        } catch (error) {
            console.error('Error en Template9:', error);
            throw error;
        }
    }

    drawTitle(text) {
        try {
            this.ctx.font = Template9.DEFAULT_STYLE.titleFont;
            this.ctx.fillStyle = Template9.DEFAULT_STYLE.titleColor;
            this.drawTextSection(text, 60, 300, this.width / 2, Template9.DEFAULT_STYLE.titleFont);
        } catch (error) {
            throw error;
        }
    }

    drawText2(text) {
        try {
            this.ctx.font = Template9.DEFAULT_STYLE.subtitleFont;
            this.ctx.fillStyle = Template9.DEFAULT_STYLE.subtitleColor;
            this.drawTextSection(text, 190, 560, this.width / 2, Template9.DEFAULT_STYLE.subtitleFont);
        } catch (error) {
            throw error;
        }
    }

    drawText3(text) {
        try {
            this.ctx.font = Template9.DEFAULT_STYLE.subtitleFont;
            this.ctx.fillStyle = Template9.DEFAULT_STYLE.subtitleColor;
            this.drawTextSection(text, 190, 700, this.width / 2, Template9.DEFAULT_STYLE.subtitleFont);
        } catch (error) {
            throw error;
        }
    }
}