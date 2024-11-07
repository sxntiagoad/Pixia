import { Image, loadImage } from 'canvas';

class Template {
    constructor(ctx, width, height, baseImage) {
        if (!ctx) throw new Error('Contexto no proporcionado');
        if (!width || !height) throw new Error('Dimensiones no válidas');
        if (!baseImage) throw new Error('Imagen base no proporcionada');

        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.baseImage = baseImage;
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

    
    drawTextSection(text, textX, textY, maxWidth, style, alignment = 'left') {
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
                    // Ajustar la posición X según la alineación
                    let xPosition = textX;
                    if (alignment === 'center') {
                        xPosition = textX + (maxWidth - this.ctx.measureText(line).width) / 2;
                    } else if (alignment === 'right') {
                        xPosition = textX + (maxWidth - this.ctx.measureText(line).width);
                    }
                    
                    this.ctx.fillText(line, xPosition, textY);
                    line = words[n] + ' ';
                    textY += fontSize + 10;
                } else {
                    line = testLine;
                }
            }
            
            // Dibujar la última línea con la alineación correcta
            let xPosition = textX;
            if (alignment === 'center') {
                xPosition = textX + (maxWidth - this.ctx.measureText(line).width) / 2;
            } else if (alignment === 'right') {
                xPosition = textX + (maxWidth - this.ctx.measureText(line).width);
            }
            
            this.ctx.fillText(line, xPosition, textY);
        } catch (error) {
            console.error('Error al procesar el texto:', error);
        }
    }

    async drawBaseImageWithOffset(offsetX, offsetY, backgroundColor) {
        try {
            // Limpiar el canvas
            this.ctx.clearRect(0, 0, this.width, this.height);
            
            // Dibujar el fondo
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // Calcular dimensiones para mantener la proporción
            const scale = Math.max(this.width / this.baseImage.width, this.height / this.baseImage.height);
            const newWidth = this.baseImage.width * scale;
            const newHeight = this.baseImage.height * scale;
            const x = (this.width - newWidth) / 2 + offsetX;
            const y = (this.height - newHeight) / 2 + offsetY;
            
            // Dibujar la imagen base con offset
            this.ctx.drawImage(this.baseImage, x, y, newWidth, newHeight);
            
            return true;
        } catch (error) {
            console.error('Error al dibujar imagen base con offset:', error);
            return false;
        }
    }

    async drawOverlayImage(imageUrl) {
        try {
            const overlayImage = await loadImage(imageUrl);
            this.ctx.drawImage(overlayImage, 0, 0, this.width, this.height);
            return true;
        } catch (error) {
            console.error('Error al dibujar imagen de overlay:', error);
            return false;
        }
    }

    async drawBaseImageWithCustomSize(x, y, targetWidth, targetHeight, backgroundColor) {
        try {
            // Limpiar el canvas
            this.ctx.clearRect(0, 0, this.width, this.height);
            
            // Dibujar el fondo
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // Calcular dimensiones manteniendo la proporción
            const aspectRatio = this.baseImage.width / this.baseImage.height;
            let newWidth = targetWidth;
            let newHeight = targetHeight;
            
            // Ajustar dimensiones para mantener proporción
            if (targetWidth / targetHeight > aspectRatio) {
                newWidth = targetHeight * aspectRatio;
            } else {
                newHeight = targetWidth / aspectRatio;
            }
            
            // Dibujar la imagen base en la posición especificada
            this.ctx.drawImage(this.baseImage, x, y, newWidth, newHeight);
            
            return true;
        } catch (error) {
            console.error('Error al dibujar imagen base personalizada:', error);
            return false;
        }
    }

    async drawBaseImage(style) {
        console.log('Iniciando drawBaseImage con estilo:', JSON.stringify(style, null, 2));
        try {
            // Validar el estilo
            if (!style) {
                throw new Error('No se proporcionó estilo para drawBaseImage');
            }
            if (!style.imageType) {
                throw new Error('No se especificó imageType en el estilo');
            }

            if (style.imageType === 'full') {
                console.log('Procesando imagen tipo "full"');
                // Validar parámetros necesarios
                if (typeof style.backgroundColor === 'undefined') {
                    console.warn('No se especificó backgroundColor, usando valor por defecto');
                }
                
                const result = await this.drawBaseImageWithOffset(
                    style.offsetX || 0,
                    style.offsetY || 0,
                    style.backgroundColor || '#000000'
                );
                
                if (!result) {
                    throw new Error('Falló el dibujado de imagen con offset');
                }
                return true;
            } else {
                console.log('Procesando imagen tipo "custom"');
                // Validar baseImage
                if (!style.baseImage) {
                    throw new Error('No se proporcionó configuración baseImage para tipo custom');
                }
                
                const { x, y, width, height } = style.baseImage;
                console.log('Dimensiones recibidas:', { x, y, width, height });
                
                if (!width || !height) {
                    throw new Error('Dimensiones inválidas en baseImage');
                }

                // Limpiar y preparar canvas
                this.ctx.clearRect(0, 0, this.width, this.height);
                this.ctx.fillStyle = style.backgroundColor || '#000000';
                this.ctx.fillRect(0, 0, this.width, this.height);

                // Calcular nuevas dimensiones
                const aspectRatio = this.baseImage.width / this.baseImage.height;
                console.log('Ratio de aspecto original:', aspectRatio);
                
                let newWidth = width;
                let newHeight = height;
                
                if (width / height > aspectRatio) {
                    newWidth = height * aspectRatio;
                    console.log('Ajustando width para mantener proporción:', newWidth);
                } else {
                    newHeight = width / aspectRatio;
                    console.log('Ajustando height para mantener proporción:', newHeight);
                }
                
                try {
                    console.log('Intentando dibujar imagen con dimensiones:', {
                        x, y, newWidth, newHeight
                    });
                    this.ctx.drawImage(this.baseImage, x, y, newWidth, newHeight);
                    console.log('Imagen dibujada exitosamente');
                    return true;
                } catch (drawError) {
                    console.error('Error al dibujar en canvas:', drawError);
                    throw drawError;
                }
            }
        } catch (error) {
            console.error('Error en drawBaseImage:', error);
            console.error('Stack trace:', error.stack);
            return false;
        }
    }
}



export default Template; 