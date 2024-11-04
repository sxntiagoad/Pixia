import React, { useState, useEffect } from 'react';
import { getProcessedImageUrlsByUserId } from '../api/imageApi';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const PostHistoryPage = () => {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (!user) {
          console.log('Usuario no autenticado');
          setError('Debes iniciar sesión para ver tu historial');
          setIsLoading(false);
          return;
        }

        console.log('Usuario autenticado:', user);
        
        if (!user.id) {
          console.log('ID de usuario no disponible');
          setError('No se pudo obtener el ID del usuario');
          setIsLoading(false);
          return;
        }

        const imageUrls = await getProcessedImageUrlsByUserId(user.id);
        console.log('URLs obtenidas:', imageUrls);
        setImages(imageUrls);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener las imágenes:', error);
        setError('Error al cargar las imágenes: ' + error.message);
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [user]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando imágenes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-200">Historial de Posts creados</h1>
        {error ? (
          <div className="text-red-500 text-xl">{error}</div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {images.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="w-full aspect-square relative group">
                  <div 
                    className={`absolute inset-0 bg-gray-700 animate-pulse transition-opacity duration-300 ${
                      loadedImages[index] ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <img 
                    src={imageUrl} 
                    alt={`Imagen procesada ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                      loadedImages[index] ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        {!isLoading && images.length === 0 && !error && (
          <p className="text-xl text-gray-400">No hay imágenes procesadas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default PostHistoryPage;
