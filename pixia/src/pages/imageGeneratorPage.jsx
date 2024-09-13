import React, { useState, useEffect } from 'react';
import { generateImageApi, fetchImagesApi } from '../api/imageApi';
import ImageForm from '../components/imageForm';
import ImagePreview from '../components/imagePreview';
import ImageList from '../components/imageList';

const ImageGeneratorPage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setError('');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Generador de Imágenes</h1>
      
      <ImageForm
        prompt={prompt}
        onPromptChange={handlePromptChange}
        onGenerateImage={generateImage}
        isLoading={isLoading}
        error={error}
      />

      <ImagePreview imageUrl={imageUrl} />

      <ImageList images={images} isLoading={isLoading} />
    </div>
  );
};

export default ImageGeneratorPage;
