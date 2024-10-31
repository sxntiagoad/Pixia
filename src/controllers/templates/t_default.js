export default class DefaultTemplate {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    // Método principal para dibujar la plantilla
    async draw(texts) {
        const { title, requirements, description } = texts;
        
        // Configurar estilos por defecto
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

        // Configurar sombra
        this.setupShadow(style.shadow);

        // Dibujar textos
        this.drawTitle(title, style);
        this.drawRequirements(requirements, style);
        this.drawDescription(description, style);
    }

    setupShadow(shadow) {
        this.ctx.shadowBlur = shadow.blur;
        this.ctx.shadowOffsetX = shadow.offset;
        this.ctx.shadowOffsetY = shadow.offset;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    }

    drawTitle(text, style) {
        this.ctx.font = style.titleFont;
        this.ctx.fillStyle = style.titleColor;
        this.drawTextSection(text, 50, 40, this.width / 2);
    }

    drawRequirements(text, style) {
        this.ctx.font = style.subtitleFont;
        this.ctx.fillStyle = style.subtitleColor;
        this.drawTextSection(text, 20, 200, this.width / 4);
    }

    drawDescription(text, style) {
        this.ctx.font = style.subtitleFont;
        this.ctx.fillStyle = style.subtitleColor;
        this.drawTextSection(text, 20, 300, this.width / 4);
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
