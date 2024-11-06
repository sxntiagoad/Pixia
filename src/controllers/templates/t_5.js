import Template from './Template.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js';

export default class Template5 extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/templates/template5.png';
    static templateKey = "templates/template5.png";  // Key de la plantilla en S3 
    static DEFAULT_STYLE = {
        presetFont: 'bold 30px Arial, sans-serif',
        titleFont: 'bold 80px Arial, sans-serif',
        subtitleFont: 'bold 28px Arial, sans-serif',
        requirementsFont: '24px Arial, sans-serif',
        applyNowFont: 'bold 35px Arial, sans-serif',
        titleColor: '#000000',
        subtitleColor: '#FFFFFF',
        shadow: {
            blur: 4,
            offset: 2
        },
        logoUrl: 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/logo.png'
    };
    static customStyle = {
        imageType: "full",
        backgroundColor: "#000000",
        offsetX: 200,
        offsetY: 0
    }

    async draw(texts, bucketName) {
        const { title, requirements, description } = texts;
        
        // 1. Primero dibujar la imagen base con offset
        await this.drawBaseImage(Template5.customStyle);

        // 2. Cargar y dibujar la plantilla desde S3
        try {
            const templateBuffer = await loadImageFromS3(bucketName, Template5.templateKey);
            const templateImage = await loadImage(templateBuffer);
            this.ctx.drawImage(templateImage, 0, 0, this.width, this.height);
        } catch (error) {
            console.error('Error al cargar la plantilla:', error);
        }

        // 3. Finalmente dibujar textos y otros elementos
        this.setupShadow(Template5.DEFAULT_STYLE.shadow);
        await this.drawBottomBar(0.07);
        this.drawPresetText();
        this.drawApplyNowText();
        this.drawTitle(title);
        this.drawRequirements(requirements);
        this.drawDescription(description);
    }

    drawPresetText() {
        this.ctx.font = Template5.DEFAULT_STYLE.presetFont;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText("Buscamos talento", 160, 430 );
        // this.ctx.fillText("talento", 55, 290);
    }

    drawApplyNowText() {
        this.ctx.font = Template5.DEFAULT_STYLE.applyNowFont;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText("¡Aplica ahora!", 120, 850);
    }

    drawTitle(text) {
        this.ctx.font = Template5.DEFAULT_STYLE.titleFont;
        this.ctx.fillStyle = '#FFFFFF';
        this.drawTextSection(text, 20, 180, this.width/2, Template5.DEFAULT_STYLE.titleFont);
    }

    drawRequirements(text) {
        this.ctx.font = Template5.DEFAULT_STYLE.subtitleFont;
        this.ctx.fillStyle = Template5.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(text, 20, 590, this.width*0.50, Template5.DEFAULT_STYLE.presetFont);
    }

    drawDescription(text) {
        this.ctx.font = Template5.DEFAULT_STYLE.requirementsFont;
        this.ctx.fillStyle = Template5.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(text, 20, 900, this.width/2, Template5.DEFAULT_STYLE.presetFont);
    }
}
