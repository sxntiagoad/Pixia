import React from 'react';

const ImagePreview = ({ imageUrl }) => (
  imageUrl ? (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Imagen Generada</h2>
      <img src={imageUrl} alt="Generada" className="border p-2 max-w-full" />
    </div>
  ) : null
);

export default ImagePreview;
