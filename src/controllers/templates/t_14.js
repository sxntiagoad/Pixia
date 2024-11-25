import Template from './Template.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js';

export default class Template14 extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/processed/66e3a5bad35c9d9afdc03338_1732500438131.png';
    static templateKey = "templates/template14.png";
    static DEFAULT_STYLE = {
        titleFont: 'bold 55px "Tahoma", Arial, sans-serif',
        subtitleFont: 'bold 24px "Oswald", sans-serif',
        requirementsFont: '20px Arial, sans-serif',
        emailFont: 'bold 18px Arial, sans-serif',
        titleColor: '#000000',
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
            width: 800,
            height: 800,
            x: 350,
            y: -50
        }
    }

    async draw(texts, bucketName) {
        try {
            if (!texts || !bucketName) {
                throw new Error('Parámetros inválidos');
            }
            const { title, requirements, description } = texts;

            // 1. Dibujar imagen base
            const baseImageResult = await this.drawBaseImage(Template14.customStyle);
            if (!baseImageResult) {
                throw new Error('Error al dibujar imagen base');
            }

            // 2. Cargar y dibujar plantilla
            try {
                const templateBuffer = await loadImageFromS3(bucketName, Template14.templateKey);
                const templateImage = await loadImage(templateBuffer);
                this.ctx.drawImage(templateImage, 0, 0, this.width, this.height);
            } catch (error) {
                console.error('Error al cargar plantilla:', error);
                throw error;
            }

            // 3. Dibujar textos y elementos
            this.setupShadow(Template14.DEFAULT_STYLE.shadow);
            await this.drawBottomBar(0.07);
            await this.drawTitle(title);
            await this.drawText2(requirements);
            await this.drawText3(description);
            this.drawEmail();

        } catch (error) {
            console.error('Error en Template14:', error);
            throw error;
        }
    }

    drawEmail() {
        try {
            const text= 'hojasdevida@magnetoglobal.com'
            this.ctx.font = Template14.DEFAULT_STYLE.emailFont;
            this.ctx.fillStyle = Template14.DEFAULT_STYLE.titleColor;
            this.drawTextSection(text, 244, 922, this.width, Template14.DEFAULT_STYLE.titleFont, 'center');
        } catch (error) {
            throw error;
        }
    }

    drawTitle(text) {
        try {
            this.ctx.font = Template14.DEFAULT_STYLE.titleFont;
            this.ctx.fillStyle = Template14.DEFAULT_STYLE.titleColor;
            this.drawTextSection(text, 44, 380, this.width*0.4, Template14.DEFAULT_STYLE.titleFont, 'center');
        } catch (error) {
            throw error;
        }
    }

    drawText2(text) {
        try {
            this.ctx.font = Template14.DEFAULT_STYLE.subtitleFont;
            this.ctx.fillStyle = Template14.DEFAULT_STYLE.subtitleColor;
            this.drawTextSection(text, 130, 700, this.width *0.3, Template14.DEFAULT_STYLE.subtitleFont);
        } catch (error) {
            throw error;
        }
    }

    drawApplyNowText() {
        this.ctx.font = Template14.DEFAULT_STYLE.subtitleFont;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText("hojasdevida@magnetoglobal.com", 200, 810);
    }

    drawText3(text) {
        try {
            this.ctx.font = Template14.DEFAULT_STYLE.subtitleFont;
            this.ctx.fillStyle = Template14.DEFAULT_STYLE.subtitleColor;
            this.drawTextSection(text, 20, 560 , this.width*0.4, Template14.DEFAULT_STYLE.subtitleFont);
        } catch (error) {
            throw error;
        }
    }
}




