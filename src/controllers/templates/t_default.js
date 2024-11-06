import Template from './Template.js';
import TEXT_CONTAINERS from '../../styles/textContainers.js';

export default class DefaultTemplate extends Template {
    static previewUrl = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/processed/66e3a5bad35c9d9afdc03338_1730779345908.png';
    static DEFAULT_STYLE = {
        titleFont: 'bold 110px Montserrat, sans-serif',
        titleColor: '#FFFFFF',
        subtitleFont: 'bold 40px Arial, sans-serif',
        subtitleColor: '#FFFFFF',
        shadow: {
            blur: 5,
            offset: 2
        }
    };

    async draw(texts, format) {
        const { title, requirements, description } = texts;
        
        // 1. Primero dibujar la imagen base con offset
        await this.drawBaseImageWithOffset(
            0,  // offset X
            0,   // offset Y
            '#FFFFFF'  // color de fondo
        );

        // 2. Configurar sombras y contenedor de texto
        this.setupShadow(DefaultTemplate.DEFAULT_STYLE.shadow);

        // 3. Dibujar contenedor aleatorio
        const containerKeys = Object.keys(TEXT_CONTAINERS);
        const randomKey = containerKeys[Math.floor(Math.random() * containerKeys.length)];
        const randomContainer = TEXT_CONTAINERS[randomKey];
        randomContainer(this.ctx, this.width, this.height);

        // 4. Dibujar barra inferior
        await this.drawBottomBar(0.07);

        // 5. Dibujar textos
        this.drawTitle(title);
        this.drawRequirements(requirements);
        this.drawDescription(description);
    }

    drawTitle(text) {
        this.ctx.font = DefaultTemplate.DEFAULT_STYLE.titleFont;
        this.ctx.fillStyle = DefaultTemplate.DEFAULT_STYLE.titleColor;
        this.drawTextSection(text, 60, 110, this.width / 2);
    }

    drawRequirements(text) {
        this.ctx.font = DefaultTemplate.DEFAULT_STYLE.subtitleFont;
        this.ctx.fillStyle = DefaultTemplate.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(text, 40, 380, this.width / 2);
    }

    drawDescription(text) {
        this.ctx.font = DefaultTemplate.DEFAULT_STYLE.subtitleFont;
        this.ctx.fillStyle = DefaultTemplate.DEFAULT_STYLE.subtitleColor;
        this.drawTextSection(text, 40, 700, this.width / 2);
    }

    drawTextSection(text, fontSize, textY, maxWidth) {
        const words = text.toString().split(' ');
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
