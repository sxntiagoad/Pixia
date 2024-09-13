import React from 'react';

const ImageForm = ({ prompt, onPromptChange, onGenerateImage, isLoading, error }) => (
  <div className="mb-4">
    <input
      type="text"
      value={prompt}
      onChange={onPromptChange}
      placeholder="Ingrese un prompt"
      className="border p-2 mr-2 w-2/3"
    />
    <button 
      onClick={onGenerateImage}
      disabled={isLoading}
      className={`${isLoading ? 'bg-gray-500' : 'bg-blue-500'} text-white px-4 py-2 rounded`}
    >
      {isLoading ? 'Generando...' : 'Generar Imagen'}
    </button>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
);

export default ImageForm;
