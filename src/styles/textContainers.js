const TEXT_CONTAINERS = {
    gradientLeftDark: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    gradientLeftBlue: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(0, 0, 255, 0.7)');
      gradient.addColorStop(1, 'rgba(0, 0, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    gradientLeftOrange: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(255, 165, 0, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    gradientLeftPurple: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(128, 0, 128, 0.7)');
      gradient.addColorStop(1, 'rgba(128, 0, 128, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    gradientLeftDarkBlue: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(0, 0, 128, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 128, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    gradientLeftTurquoise: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(64, 224, 208, 0.7)');
      gradient.addColorStop(1, 'rgba(64, 224, 208, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    gradientLeftGold: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.7)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    solidLeftDarkBlue: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(0, 0, 128, 0.6)';
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    solidLeftGray: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(105, 105, 105, 0.7)';
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    solidLeftLightBlue: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(173, 216, 230, 0.6)';
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    solidLeftOrange: (ctx, width, height) => {
      ctx.fillStyle = 'rgba(255, 140, 0, 0.7)';
      ctx.fillRect(0, 0, width * 0.6, height);
    },
  
    gradientLeftDarkToLightBlue: (ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, width * 0.6, 0);
      gradient.addColorStop(0, 'rgba(0, 0, 139, 0.8)');
      gradient.addColorStop(1, 'rgba(135, 206, 235, 0.6)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width * 0.6, height);
    }
  };
export default TEXT_CONTAINERS;