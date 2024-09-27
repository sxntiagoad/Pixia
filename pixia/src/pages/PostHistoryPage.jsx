import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const VacancyHistoryPage = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/images');
        setImages(response.data.filter(image => image.processedImageUrl));
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-200">Historial de Posts creados</h1>
        <div className="mt-8">
          {isLoading ? (
            <p className="text-xl text-gray-400">Cargando imágenes...</p>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <div className="w-full h-0 pb-[56.25%] relative">
                    <img 
                      src={image.processedImageUrl} 
                      alt={`Imagen procesada: ${image.prompt}`}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  <p className="p-4 text-base text-gray-300">{image.prompt || 'Sin prompt'}</p>
                  <p className="px-4 pb-4 text-sm text-gray-400">
                    {image.createdAt ? new Date(image.createdAt).toLocaleDateString() : 'Fecha desconocida'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xl text-gray-400">No hay imágenes procesadas disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacancyHistoryPage;
