import React from 'react';

const ImageForm = ({ 
  prompt, 
  onPromptChange, 
  overlayText, 
  onOverlayTextChange,
  onGenerateImage, 
  onProcessImage,
  isLoading, 
  error 
}) => (
  <div className="mb-4">
    <input
      type="text"
      value={prompt}
      onChange={onPromptChange}
      placeholder="Ingrese un prompt"
      className="border p-2 mr-2 w-2/3 mb-2"
    />
    <button 
      onClick={onGenerateImage}
      disabled={isLoading}
      className={`${isLoading ? 'bg-gray-500' : 'bg-blue-500'} text-white px-4 py-2 rounded mb-2`}
    >
      {isLoading ? 'Generando...' : 'Generar Imagen'}
    </button>
    <input
      type="text"
      value={overlayText}
      onChange={onOverlayTextChange}
      placeholder="Texto para superponer"
      className="border p-2 mr-2 w-2/3 mb-2"
    />
    <button 
      onClick={onProcessImage}
      disabled={isLoading}
      className={`${isLoading ? 'bg-gray-500' : 'bg-green-500'} text-white px-4 py-2 rounded`}
    >
      {isLoading ? 'Procesando...' : 'Procesar Imagen'}
    </button>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
);

export default ImageForm;
