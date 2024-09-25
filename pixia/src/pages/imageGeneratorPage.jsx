import React, { useState, useEffect } from 'react';
import { generateImageApi, fetchImagesApi, processImageApi } from '../api/imageApi';
import ImageForm from '../components/ImageForm';
import ImagePreview from '../components/imagePreview';
import ImageList from '../components/imageList';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ImageGeneratorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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
      } else {
        throw new Error('La respuesta no contiene una URL de imagen válida');
      }
    } catch (error) {
      setError('Hubo un error al generar la imagen. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const processImage = async () => {
    if (!imageUrl || !overlayText.trim()) {
      setError('Por favor, genere una imagen y proporcione un texto para superponer.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await processImageApi(imageUrl, overlayText, prompt);
      if (response.data && response.data.processedImageUrl) {
        setProcessedImageUrl(response.data.processedImageUrl);
        fetchImages(); // Actualiza la lista de imágenes después de procesar
      } else {
        throw new Error('La respuesta no contiene una URL de imagen procesada válida');
      }
    } catch (error) {
      setError('Hubo un error al procesar la imagen. Por favor, intente de nuevo.');
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

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setError('');
  };

  const handleOverlayTextChange = (e) => {
    setOverlayText(e.target.value);
    setError('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Generador de Imágenes</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar sesión
        </button>
      </div>
      
      <ImageForm
        prompt={prompt}
        onPromptChange={handlePromptChange}
        overlayText={overlayText}
        onOverlayTextChange={handleOverlayTextChange}
        onGenerateImage={generateImage}
        onProcessImage={processImage}
        isLoading={isLoading}
        error={error}
      />

      <ImagePreview imageUrl={processedImageUrl || imageUrl} />

      <ImageList images={images} isLoading={isLoading} />
    </div>
  );
};

export default ImageGeneratorPage;
