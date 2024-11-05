import Template from './Template.js';
import TEXT_CONTAINERS from '../../styles/textContainers.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js';

export default class Template1 extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/processed/66e3a5bad35c9d9afdc03338_1730777645507.png';

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

    async draw(texts, bucketName) {
        const imageKey = "templates/plantilla1.png";
        const { title, requirements, description } = texts;
        
        this.setupShadow(Template1.DEFAULT_STYLE.shadow);
        await this.drawImageFromS3(bucketName, imageKey, texts);
    }

    async drawImageFromS3(bucketName, imageKey, texts) {
        try {
            const imageBuffer = await loadImageFromS3(bucketName, imageKey);
            const templateImage = await loadImage(imageBuffer);
            
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.drawImage(templateImage, 0, 0, this.width, this.height);

            const { title, requirements, description } = texts;

            await this.drawBottomBar(0.07, Template1.DEFAULT_STYLE.logoUrl);
            this.drawPresetText();
            this.drawApplyNowText();
            this.drawTitle(title);
            this.drawRequirements(requirements);
            this.drawDescription(description);

            this.ctx.restore();
        } catch (error) {
            console.error('Error en Template1:', error);
            this.drawPresetText();
            this.drawApplyNowText();
            this.drawTitle(title);
            this.drawRequirements(requirements);
            this.drawDescription(description);
        }
    }


    drawPresetText() {
        this.ctx.font = Template1.DEFAULT_STYLE.presetFont;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText("Buscamos talento", 160, 430 );
        // this.ctx.fillText("talento", 55, 290);
    }

    drawApplyNowText() {
        this.ctx.font = Template1.DEFAULT_STYLE.applyNowFont;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText("¡Aplica ahora!", 120, 850);
    }

    drawTitle(text) {
        this.ctx.font = Template1.DEFAULT_STYLE.titleFont;
        this.ctx.fillStyle = '#FFFFFF';
        this.drawTextSection(text, 20, 180, this.width/2, Template1.DEFAULT_STYLE.titleFont);
    }

    drawRequirements(text) {
        this.ctx.font = Template1.DEFAULT_STYLE.subtitleFont;
        this.ctx.fillStyle = Template1.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(text, 20, 590, this.width*0.50, Template1.DEFAULT_STYLE.presetFont);
    }

    drawDescription(text) {
        this.ctx.font = Template1.DEFAULT_STYLE.requirementsFont;
        this.ctx.fillStyle = Template1.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(text, 20, 900, this.width/2, Template1.DEFAULT_STYLE.presetFont);
    }
}
