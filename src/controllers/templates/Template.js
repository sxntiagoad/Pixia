import { Image } from 'canvas';

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

    drawBottomBar(heightPercentage = 0.07) {
        const barHeight = this.height * heightPercentage;
        
        // Dibujar el fondo del bottom bar
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(0, this.height - barHeight, this.width, barHeight);
        
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                // Calcular dimensiones para centrar la imagen
                const imageHeight = barHeight * 0.8;
                const imageWidth = imageHeight * 3.4;
                
                const x = (this.width - imageWidth) / 2;
                const y = this.height - barHeight + (barHeight - imageHeight) / 2;
                
                this.ctx.drawImage(image, x, y, imageWidth, imageHeight);
                resolve();
            };
            
            image.onerror = reject;
            image.src = 'https://sxntiago-pixia-aws.s3.us-east-2.amazonaws.com/logo.png';
        });
    }

    
    drawTextSection(text, textX, textY, maxWidth, style) {
        if (!style) {
            console.error('No se proporcionó un estilo de fuente');
            return;
        }
        const words = text.toString().split(' ');
        let line = '';
        const getFontSize = (fontString) => {
            return parseInt(fontString.split('px')[0].split(' ').pop());
        }
        
        try {
            const fontSize = getFontSize(style);
            
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
        } catch (error) {
            console.error('Error al procesar el texto:', error);
        }
    }
}



export default Template; 