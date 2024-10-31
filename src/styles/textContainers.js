const TEXT_CONTAINERS = {
  gradientLeftDark: (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(0, 0, width * 0.5, 0); // Extiende el gradiente hasta el 80% del ancho
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)'); // Color sólido al inicio
    gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)'); // Transición suave
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Totalmente transparente
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height); // Rellena toda el área para una transición uniforme
  },
  gradientLeftOrange: (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(0, 0, width * 0.5, 0);
    gradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)'); // Naranja sólido
    gradient.addColorStop(0.7, 'rgba(255, 165, 0, 0.2)'); // Transición suave
    gradient.addColorStop(1, 'rgba(255, 165, 0, 0)'); // Totalmente transparente
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  },

  gradientLeftPurple: (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(0, 0, width * 0.5, 0);
    gradient.addColorStop(0, 'rgba(128, 0, 128, 0.8)'); // Morado sólido
    gradient.addColorStop(0.7, 'rgba(128, 0, 128, 0.2)'); // Transición suave
    gradient.addColorStop(1, 'rgba(128, 0, 128, 0)'); // Totalmente transparente
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  },

  gradientLeftGreen: (ctx, width, height) => {
    const gradient = ctx.createLinearGradient(0, 0, width * 0.5, 0);
    gradient.addColorStop(0, 'rgba(0, 128, 0, 0.8)'); // Verde sólido
    gradient.addColorStop(0.7, 'rgba(0, 128, 0, 0.2)'); // Transición suave
    gradient.addColorStop(1, 'rgba(0, 128, 0, 0)'); // Totalmente transparente
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
};

export default TEXT_CONTAINERS;