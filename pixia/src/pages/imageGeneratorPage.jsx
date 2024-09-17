import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageForm from '../components/ImageForm';
import ImagePreview from '../components/ImagePreview';
import ImageList from '../components/ImageList';
import { generateImageApi, fetchImagesApi } from '../api/imageApi'; // Asegúrate de tener estas funciones en tu API

const ImageGeneratorPage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor, ingrese un prompt válido.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await generateImageApi(prompt);
      if (response.data && response.data.imageUrl) {
        setImageUrl(response.data.imageUrl);
        fetchImages(); // Actualiza la lista de imágenes después de generar una nueva
      } else {
        throw new Error('La respuesta no contiene una URL de imagen válida');
      }
    } catch (error) {
      setError('Hubo un error al generar la imagen. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetchImagesApi();
      setImages(response.data);
    } catch (error) {
      setError('No se pudieron cargar las imágenes anteriores.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra de navegación */}
      <nav className="bg-zinc-800 p-4 flex justify-between items-center">
        <h1 className="text-white text-lg">Pixia</h1>
        <div className="flex items-center gap-4">
          <span className="text-white">Bienvenido, {user?.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="flex-grow p-8">
        <h2 className="text-2xl font-bold mb-4">Generador de Imágenes</h2>
        <ImageForm
          prompt={prompt}
          onPromptChange={(e) => setPrompt(e.target.value)}
          onGenerateImage={generateImage}
          isLoading={isLoading}
          error={error}
        />
        <ImagePreview imageUrl={imageUrl} />
        <ImageList images={images} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ImageGeneratorPage;
