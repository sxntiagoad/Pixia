import React, { useState, useEffect } from 'react';
import { getProcessedImageUrlsByUserId } from '../api/imageApi';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-200">Historial de Posts creados</h1>
        <div className="mt-8">
          {isLoading ? (
            <p className="text-xl text-gray-400">Cargando imágenes...</p>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
              {images.map((imageUrl, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <div className="w-full aspect-square relative">
                    <img 
                      src={imageUrl} 
                      alt={`Imagen procesada ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
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

export default PostHistoryPage;
