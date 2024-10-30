import React from 'react';
import { motion } from 'framer-motion';

const ImageVariations = ({ variations, selectedVariation, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {variations.map((variation) => (
        <motion.div
          key={variation.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 ${
            selectedVariation?.id === variation.id
              ? 'ring-4 ring-green-500'
              : 'hover:shadow-xl'
          }`}
          onClick={() => onSelect(variation)}
        >
          <img
            src={`data:image/png;base64,${variation.data}`}
            alt={`Variación ${variation.id}`}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="text-white text-sm font-medium">
                Variación {variation.id}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ImageVariations;

