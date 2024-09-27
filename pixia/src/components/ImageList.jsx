import React from 'react';

const ImageList = ({ images, isLoading }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold mb-4 text-gray-200">Imágenes Generadas Anteriormente</h2>
    {isLoading ? (
      <p className="text-gray-400">Cargando imágenes...</p>
    ) : images.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full h-0 pb-[100%] relative">
              <img 
                src={image.imageUrl} 
                alt={`Generada del prompt: ${image.prompt}`} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <p className="p-2 text-sm text-gray-300 truncate">{image.prompt}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400">No hay imágenes generadas anteriormente.</p>
    )}
  </div>
);

export default ImageList;
