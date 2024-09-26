import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageForm from '../components/ImageForm';
import ImagePreview from '../components/ImagePreview';
import ImageList from '../components/ImageList';
import { generateImageApi, fetchImagesApi, processImageApi } from '../api/imageApi';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ImageGeneratorPage = () => {
  const { logout, user, setUser } = useAuth();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [overlayText, setOverlayText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        fetchImages();
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

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/api/profile', { withCredentials: true });
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error.response || error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchUserProfile();
  }, []);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setError('');
  };

  const handleOverlayTextChange = (e) => {
    setOverlayText(e.target.value);
    setError('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6 flex-grow">
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
    </div>
  );
};

export default ImageGeneratorPage;
