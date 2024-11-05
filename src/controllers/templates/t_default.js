import Template from './Template.js';
import TEXT_CONTAINERS from '../../styles/textContainers.js';

export default class DefaultTemplate extends Template {
    async draw(texts, bucketName) {
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

        const containerKeys = Object.keys(TEXT_CONTAINERS);
        const randomKey = containerKeys[Math.floor(Math.random() * containerKeys.length)];
        const randomContainer = TEXT_CONTAINERS[randomKey];
        randomContainer(this.ctx, this.width, this.height);

        this.drawBottomBar();

        this.drawTitle(title, style);
        this.drawRequirements(requirements, style);
        this.drawDescription(description, style);
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
    
    drawTextSection(text, fontSize, textY, maxWidth) {
        this.ctx.font = `bold ${fontSize}px Arial, sans-serif`;
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
                textY += fontSize + 10;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, textX, textY);
    }
}
