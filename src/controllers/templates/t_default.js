import Template from './Template.js';
import TEXT_CONTAINERS from '../../styles/textContainers.js';

export default class DefaultTemplate extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/processed/66e3a5bad35c9d9afdc03338_1730779345908.png';
    async draw(texts, bucketName) {
        const { title, requirements, description } = texts;
        
        const style = {
            titleFont: 'bold 110px Montserrat, sans-serif',
            titleColor: '#FFFFFF',
            subtitleFont: 'bold 40px Arial, sans-serif',
            subtitleColor: '#FFFFFF',
            shadow: {
                blur: 5,
                offset: 2
            }
        };

        this.setupShadow(style.shadow);

        const containerKeys = Object.keys(TEXT_CONTAINERS);
        const randomKey = containerKeys[Math.floor(Math.random() * containerKeys.length)];
        const randomContainer = TEXT_CONTAINERS[randomKey];
        randomContainer(this.ctx, this.width, this.height);

        await this.drawBottomBar(0.07);

        this.drawTitle(title, style);
        this.drawRequirements(requirements, style);
        this.drawDescription(description, style);
    }

    drawTitle(text, style) {
        this.ctx.font = style.titleFont;
        this.ctx.fillStyle = style.titleColor;
        this.drawTextSection(text, 60, 110, this.width / 2);
    }

    drawRequirements(text, style) {
        this.ctx.font = style.subtitleFont;
        this.ctx.fillStyle = style.subtitleColor;
        this.drawTextSection(text, 40, 380, this.width / 2);
    }

    drawDescription(text, style) {
        this.ctx.font = style.subtitleFont;
        this.ctx.fillStyle = style.subtitleColor;
        this.drawTextSection(text, 40, 700, this.width / 2);
    }

    drawTextSection(text, fontSize, textY, maxWidth) {
        const words = text.split(' ');
        let line = '';
        const textX = 10;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, textX, textY);
                line = words[n] + ' ';
                textY += fontSize + 20;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, textX, textY);
    }
}
