import Template from './Template.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js';

export default class Template7 extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/processed/66e3a5bad35c9d9afdc03338_1731092837052.png';
    static templateKey = "templates/template7.png";
    static DEFAULT_STYLE = {
        presetFont: 'bold 30px Arial, sans-serif',
        titleFont: 'bold 80px Tahoma, sans-serif',
        subtitleFont: 'bold 40px Arial, sans-serif',
        titleColor: '#D3D3D3',
        subtitleColor: '#000000',
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
            width: 1900,
            height: 1900,
            x: 0,
            y: -400
        }
    }

    async draw(texts, bucketName) {
        try {
            if (!texts || !bucketName) {
                throw new Error('Parámetros inválidos');
            }
            const { title, requirements, description } = texts;

            // 1. Dibujar imagen base
            const baseImageResult = await this.drawBaseImage(Template7.customStyle);
            if (!baseImageResult) {
                throw new Error('Error al dibujar imagen base');
            }

            // 2. Cargar y dibujar plantilla
            try {
                const templateBuffer = await loadImageFromS3(bucketName, Template7.templateKey);
                const templateImage = await loadImage(templateBuffer);
                this.ctx.drawImage(templateImage, 0, 0, this.width, this.height);
            } catch (error) {
                console.error('Error al cargar plantilla:', error);
                throw error;
            }

            // 3. Dibujar textos y elementos
            this.setupShadow(Template7.DEFAULT_STYLE.shadow);
            await this.drawBottomBar(0.07);
            await this.drawTitle(title);
            await this.drawText2(requirements);
            await this.drawText3(description);

        } catch (error) {
            console.error('Error en Template7:', error);
            throw error;
        }
    }

    drawTitle(text) {
        try {
            this.ctx.font = Template7.DEFAULT_STYLE.titleFont;
            this.ctx.fillStyle = Template7.DEFAULT_STYLE.titleColor;
            this.drawTextSection(text, 40, 800, this.width, Template7.DEFAULT_STYLE.titleFont);
        } catch (error) {
            throw error;
        }
    }

    drawText2(text) {
        try {
            this.ctx.font = Template7.DEFAULT_STYLE.subtitleFont;
            this.ctx.fillStyle = Template7.DEFAULT_STYLE.subtitleColor;
            this.drawTextSection(text, 95, 1000, this.width * 0.80 , Template7.DEFAULT_STYLE.subtitleFont);
        } catch (error) {
            throw error;
        }
    }

    drawText3(text) {
        try {
            this.ctx.font = Template7.DEFAULT_STYLE.subtitleFont;
            this.ctx.fillStyle = Template7.DEFAULT_STYLE.subtitleColor;
            this.drawTextSection(text, 100, 1400, this.width*0.80, Template7.DEFAULT_STYLE.subtitleFont);
        } catch (error) {
            throw error;
        }
    }
}

