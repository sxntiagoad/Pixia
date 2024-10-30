import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaDice } from 'react-icons/fa';

const ImageForm = ({ prompt, onPromptChange, onGenerateImage, isLoading }) => {
  const promptSuggestions = [
    "Oficina moderna con vista panorámica",
    "Equipo diverso trabajando en colaboración",
    "Espacio de trabajo creativo y dinámico",
    // ... más sugerencias
  ];

  const getRandomSuggestion = () => {
    const randomIndex = Math.floor(Math.random() * promptSuggestions.length);
    onPromptChange({ target: { value: promptSuggestions[randomIndex] } });
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaLightbulb className="text-gray-400" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={onPromptChange}
          className="w-full pl-10 pr-16 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
          placeholder="Describe la imagen que deseas generar..."
        />
        <button
          onClick={getRandomSuggestion}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors duration-300"
        >
          <FaDice className="w-5 h-5" />
        </button>
      </div>

      <motion.button
        onClick={onGenerateImage}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2" />
            Generando...
          </div>
        ) : (
          'Generar Imagen'
        )}
      </motion.button>
    </div>
  );
};

export default ImageForm;
