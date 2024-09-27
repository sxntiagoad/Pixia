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
  const [overlayTitle, setOverlayTitle] = useState('');
  const [overlayRequirements, setOverlayRequirements] = useState('');
  const [overlayDescription, setOverlayDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchImages();
    fetchUserProfile();
  }, []);

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
    if (!imageUrl || !overlayTitle.trim() || !overlayRequirements.trim() || !overlayDescription.trim()) {
      setError('Por favor, genere una imagen y proporcione todos los textos para superponer.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const overlayText = JSON.stringify({
        title: overlayTitle,
        requirements: overlayRequirements,
        description: overlayDescription
      });
      const response = await processImageApi(imageUrl, overlayText, prompt);
      if (response.data && response.data.processedImageUrl) {
        setProcessedImageUrl(response.data.processedImageUrl);
        await fetchImages();
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

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setError('');
  };

  const handleOverlayTitleChange = (e) => {
    setOverlayTitle(e.target.value);
    setError('');
  };

  const handleOverlayRequirementsChange = (e) => {
    setOverlayRequirements(e.target.value);
    setError('');
  };

  const handleOverlayDescriptionChange = (e) => {
    setOverlayDescription(e.target.value);
    setError('');
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    return (
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-md">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-200">Paso 1: Generar Imagen</h2>
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
                <input
                  type="text"
                  id="prompt"
                  value={prompt}
                  onChange={handlePromptChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe la imagen que quieres generar"
                />
              </div>
              <button
                onClick={generateImage}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                {isLoading ? 'Generando...' : 'Generar Imagen'}
              </button>
              {imageUrl && (
                <button
                  onClick={nextStep}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
                >
                  Siguiente
                </button>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-200">Paso 2: Procesar Imagen</h2>
              <div className="mb-4">
                <label htmlFor="overlayTitle" className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                <input
                  type="text"
                  id="overlayTitle"
                  value={overlayTitle}
                  onChange={handleOverlayTitleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Título"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="overlayRequirements" className="block text-sm font-medium text-gray-300 mb-2">Requisitos</label>
                <input
                  type="text"
                  id="overlayRequirements"
                  value={overlayRequirements}
                  onChange={handleOverlayRequirementsChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Requisitos"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="overlayDescription" className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                <textarea
                  id="overlayDescription"
                  value={overlayDescription}
                  onChange={handleOverlayDescriptionChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Descripción"
                  rows="3"
                ></textarea>
              </div>
              <button
                onClick={processImage}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                {isLoading ? 'Procesando...' : 'Procesar Imagen'}
              </button>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={prevStep}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Anterior
                </button>
                <button
                  onClick={nextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Finalizar
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-200">Resultado Final</h2>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
              >
                Crear Nueva Imagen
              </button>
            </>
          )}
        </div>
        <div className="w-full md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Vista Previa</h2>
          <ImagePreview imageUrl={processedImageUrl || imageUrl} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-200">Generador de Vacantes</h1>
        {renderStep()}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Imágenes Generadas</h2>
          <ImageList images={images} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ImageGeneratorPage;
