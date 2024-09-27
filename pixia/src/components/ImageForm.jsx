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
    {prompt !== undefined && (
      <>
        <input
          type="text"
          value={prompt}
          onChange={onPromptChange}
          placeholder="Ingrese un prompt para la imagen"
          className="bg-gray-700 text-white border border-gray-600 p-2 mr-2 w-2/3 mb-2 rounded"
        />
        <button 
          onClick={onGenerateImage}
          disabled={isLoading}
          className={`${isLoading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded mb-2 transition duration-300`}
        >
          {isLoading ? 'Generando...' : 'Generar Imagen'}
        </button>
      </>
    )}
    {overlayText !== undefined && (
      <>
        <input
          type="text"
          value={overlayText}
          onChange={onOverlayTextChange}
          placeholder="Texto para superponer en la imagen"
          className="bg-gray-700 text-white border border-gray-600 p-2 mr-2 w-2/3 mb-2 rounded"
        />
        <button 
          onClick={onProcessImage}
          disabled={isLoading}
          className={`${isLoading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded transition duration-300`}
        >
          {isLoading ? 'Procesando...' : 'Procesar Imagen'}
        </button>
      </>
    )}
    {error && <p className="text-red-400 mt-2">{error}</p>}
  </div>
);

export default ImageForm;
