import React from 'react';

const ImageList = ({ images, isLoading }) => (
  <div className="mt-6">
    <h2 className="text-xl mb-2">Imágenes Generadas Anteriormente</h2>
    {isLoading ? (
      <p>Cargando imágenes...</p>
    ) : images.length > 0 ? (
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="border p-2">
            <p>{image.prompt}</p>
            <img src={image.imageUrl} alt={`Generada del prompt: ${image.prompt}`} className="max-w-full" />
          </div>
        ))}
      </div>
    ) : (
      <p>No hay imágenes generadas anteriormente.</p>
    )}
  </div>
);

export default ImageList;
