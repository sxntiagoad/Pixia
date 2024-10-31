class Template {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    setupShadow(shadow) {
        this.ctx.shadowBlur = shadow.blur;
        this.ctx.shadowOffsetX = shadow.offset;
        this.ctx.shadowOffsetY = shadow.offset;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    }

    drawBottomBar() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Blanco semitransparente
        const barHeight = this.height * 0.1; // 10% de la altura total
        this.ctx.fillRect(0, this.height - barHeight, this.width, barHeight);
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

export default Template; 