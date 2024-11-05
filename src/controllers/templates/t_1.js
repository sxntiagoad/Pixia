import Template from './Template.js';
import TEXT_CONTAINERS from '../../styles/textContainers.js';
import { loadImage } from 'canvas';
import { loadImageFromS3 } from '../../s3config.js';

export default class Template1 extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.amazonaws.com/templates/plantilla1.png';

    static DEFAULT_STYLE = {
        presetFont: 'bold 80px Arial, sans-serif',
        titleFont: 'bold 30px Arial, sans-serif',
        subtitleFont: 'bold 40px Arial, sans-serif',
        requirementsFont: '24px Arial, sans-serif',
        applyNowFont: 'bold 35px Arial, sans-serif',
        titleColor: '#000000',
        subtitleColor: '#FFFFFF',
        shadow: {
            blur: 4,
            offset: 2
        }
    };

    async draw(texts, bucketName) {
        const imageKey = "templates/plantilla1.png";
        const { title, requirements, description } = texts;
        
        this.setupShadow(Template1.DEFAULT_STYLE.shadow);

        const containerKeys = Object.keys(TEXT_CONTAINERS);
        const randomKey = containerKeys[Math.floor(Math.random() * containerKeys.length)];
        const randomContainer = TEXT_CONTAINERS[randomKey];
        randomContainer(this.ctx, this.width, this.height);

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

            this.drawBottomBar();
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
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText("Buscamos", 55, 200);
        this.ctx.fillText("talento", 55, 290);
    }

    drawApplyNowText() {
        this.ctx.font = Template1.DEFAULT_STYLE.applyNowFont;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText("¡Aplica ahora!", 120, 850);
    }

    drawTitle(text) {
        this.ctx.font = Template1.DEFAULT_STYLE.titleFont;
        this.ctx.fillStyle = Template1.DEFAULT_STYLE.titleColor;
        this.drawTextSection(text, 125, 430, this.width);
    }

    drawRequirements(text) {
        this.ctx.font = Template1.DEFAULT_STYLE.subtitleFont;
        this.ctx.fillStyle = Template1.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(text, 55, 600, this.width);
    }

    drawDescription(text) {
        this.ctx.font = Template1.DEFAULT_STYLE.requirementsFont;
        this.ctx.fillStyle = Template1.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(text, 70, 960, this.width);
    }

}