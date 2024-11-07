import Template from './Template.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js';

export default class Template3 extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/processed/66e3a5bad35c9d9afdc03338_1730926321147.png';
    static templateKey = "templates/template3.png";  // Key de la plantilla en S3 
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
        logoUrl: 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/logo.png',
        alignment: {
            title: 'right',      // Título alineado a la derecha
            requirements: 'right', // Requisitos alineados a la derecha
            description: 'right',  // Descripción alineada a la derecha
            preset: 'left',       // Texto preset normal a la izquierda
            applyNow: 'left'      // Texto "Aplica ahora" normal a la izquierda
        }
    };
    static customStyle = {
        imageType: "full",
        backgroundColor: "#000000",
        offsetX: -150,
        offsetY: 0
    }

    async draw(texts, bucketName) {
        const { title, requirements, description } = texts;
        
        // 1. Primero dibujar la imagen base con offset
        await this.drawBaseImage(Template3.customStyle);

        // 2. Cargar y dibujar la plantilla desde S3
        try {
            const templateBuffer = await loadImageFromS3(bucketName, Template3.templateKey);
            const templateImage = await loadImage(templateBuffer);
            this.ctx.drawImage(templateImage, 0, 0, this.width, this.height);
        } catch (error) {
            console.error('Error al cargar la plantilla:', error);
        }

        // 3. Finalmente dibujar textos y otros elementos
        this.setupShadow(Template3.DEFAULT_STYLE.shadow);
        await this.drawBottomBar(0.07);
        this.drawApplyNowText();
        this.drawTitle(title);
        this.drawRequirements(requirements);
        this.drawDescription(description);
    }



    drawApplyNowText() {
        this.ctx.font = Template3.DEFAULT_STYLE.subtitleFont;
        this.ctx.fillStyle = Template3.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(
            "¡Aplica ahora!", 
            715, 
            825,
            this.width/2,
            Template3.DEFAULT_STYLE.applyNowFont,
            Template3.DEFAULT_STYLE.alignment.applyNow
        );
    }

    drawTitle(text) {
        this.ctx.font = Template3.DEFAULT_STYLE.titleFont;
        this.ctx.fillStyle = '#FFFFFF';
        this.drawTextSection(
            text, 
            530, 
            230, 
            this.width/2, 
            Template3.DEFAULT_STYLE.titleFont,
            Template3.DEFAULT_STYLE.alignment.title
        );
    }

    drawRequirements(text) {
        this.ctx.font = Template3.DEFAULT_STYLE.subtitleFont;
        this.ctx.fillStyle = Template3.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(
            text, 
            530, 
            580, 
            this.width*0.50, 
            Template3.DEFAULT_STYLE.presetFont,
            Template3.DEFAULT_STYLE.alignment.requirements
        );
    }

    drawDescription(text) {
        this.ctx.font = Template3.DEFAULT_STYLE.requirementsFont;
        this.ctx.fillStyle = Template3.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(
            text, 
            530, 
            920, 
            this.width/2, 
            Template3.DEFAULT_STYLE.presetFont,
            Template3.DEFAULT_STYLE.alignment.description
        );
    }
}
