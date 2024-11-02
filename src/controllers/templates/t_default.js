import Template from './Template.js';
import TEXT_CONTAINERS from '../../styles/textContainers.js';

export default class DefaultTemplate extends Template {
    async draw(texts) {
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
}
