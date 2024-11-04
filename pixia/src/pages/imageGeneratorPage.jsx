import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageForm from '../components/ImageForm';
import ImagePreview from '../components/ImagePreview';
import ImageList from '../components/ImageList';
import { generateImageApi, fetchImagesApi, processImageApi, uploadSelectedImageApi } from '../api/imageApi';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaEdit, FaMagic, FaCheck, FaFileAlt } from 'react-icons/fa';
import StepIndicator from '../components/StepIndicator';
import { getTemplatesApi, processWithTemplateApi } from '../api/templateApi';

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
  const [selectedFormat, setSelectedFormat] = useState('LINKEDIN_POST');
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('t_default');

  useEffect(() => {
    fetchImages();
    fetchTemplates();
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
        throw new Error('No se recibió una imagen válida');
      }
    } catch (error) {
      setError('Error al generar la imagen. Por favor, intente de nuevo.');
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
      console.log('Template seleccionado:', selectedTemplate);
      
      const overlayText = JSON.stringify({
        title: overlayTitle,
        requirements: overlayRequirements,
        description: overlayDescription
      });
      
      const response = await processImageApi(
        imageUrl,
        overlayText,
        prompt,
        selectedTemplate
      );

      console.log('Respuesta del procesamiento:', response.data);

      if (response.data && response.data.variations) {
        setVariations(response.data.variations);
        setStep(4);
      } else {
        throw new Error('La respuesta no contiene variaciones válidas');
      }
    } catch (error) {
      console.error('Error detallado al procesar la imagen:', error);
      setError('Hubo un error al procesar la imagen. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadSelectedVariation = async () => {
    console.log("Intentando subir la variación seleccionada...");

    if (!selectedVariation) {
        setError('Por favor, seleccione una variación antes de continuar.');
        return;
    }

    setError('');
    setIsLoading(true);

    try {
        console.log("Datos de la variación seleccionada:", {
            id: selectedVariation.id,
            dataLength: selectedVariation.data.length
        });

        const response = await uploadSelectedImageApi(
            selectedVariation.id,
            selectedVariation.data,
            prompt,
            imageUrl,
            JSON.stringify({
                title: overlayTitle,
                requirements: overlayRequirements,
                description: overlayDescription
            }),
            user.id
        );

        console.log("Respuesta del servidor:", response);

        if (response.data && response.data.processedImageUrl) {
            setProcessedImageUrl(response.data.processedImageUrl);
            await fetchImages();
            setStep(5); // Avanzar al paso de resultado final

            // Limpiar todos los datos
            setPrompt('');
            setOverlayTitle('');
            setOverlayRequirements('');
            setOverlayDescription('');
            setImageUrl('');
            setProcessedImageUrl('');
            setVariations([]);
            setSelectedVariation(null);
        } else {
            throw new Error('La respuesta no contiene una URL de imagen procesada válida');
        }
    } catch (error) {
        console.error('Error detallado al subir la variación:', error);
        setError(`Error al subir la imagen: ${error.message}`);
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

  

  const fetchTemplates = async () => {
    try {
      const response = await getTemplatesApi();
      console.log('Templates recibidos:', response.data);
      if (response.data && response.data.templates) {
        setTemplates(response.data.templates);
        // Si no hay template seleccionado, seleccionar el default
        if (!selectedTemplate && response.data.templates.includes('t_default')) {
          setSelectedTemplate('t_default');
        }
      }
    } catch (error) {
      console.error('Error al cargar los templates:', error);
      setError('Error al cargar los templates');
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
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">Paso 1: Elegir Plantilla</h2>
            <div className="mb-4">
              <label htmlFor="format" className="block text-sm font-medium text-gray-300 mb-2">Formato</label>
              <select
                id="format"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LINKEDIN_POST">LinkedIn Post</option>
                <option value="INSTAGRAM_POST">Instagram Post</option>
                <option value="INSTAGRAM_STORY">Instagram Story</option>
                <option value="FACEBOOK_POST">Facebook Post</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="template" className="block text-sm font-medium text-gray-300 mb-2">Template</label>
              <select
                id="template"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {templates.map(template => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Siguiente
            </button>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">Paso 2: Generar Imagen</h2>
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
              <div className="mt-4">
                <img 
                  src={imageUrl} 
                  alt="Imagen generada" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
                >
                  Siguiente
                </button>
              </div>
            )}
            <button
              onClick={() => setStep(1)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
            >
              Anterior
            </button>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">Paso 3: Personalizar</h2>
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
              <textarea
                id="overlayRequirements"
                value={overlayRequirements}
                onChange={handleOverlayRequirementsChange}
                className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Requisitos"
                rows="3"
              ></textarea>
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
            <button
              onClick={() => setStep(2)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
            >
              Anterior
            </button>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">Paso 4: Seleccionar Variación</h2>
            <div className="grid grid-cols-2 gap-4">
              {variations.map((variation) => (
                <div
                  key={variation.id}
                  className={`cursor-pointer border-4 ${selectedVariation?.id === variation.id ? 'border-indigo-500' : 'border-transparent'}`}
                  onClick={() => setSelectedVariation(variation)}
                >
                  <img src={`data:image/png;base64,${variation.data}`} alt={`Variación ${variation.id}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
            <button
              onClick={uploadSelectedVariation}
              disabled={isLoading || !selectedVariation}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
            >
              {isLoading ? 'Subiendo...' : 'Subir Variación Seleccionada'}
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
            >
              Anterior
            </button>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">Resultado Final</h2>
            <ImagePreview imageUrl={processedImageUrl} />
            <button
              onClick={() => setStep(1)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
            >
              Crear Nueva Imagen
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <StepIndicator 
        steps={[
          { icon: <FaFileAlt />, label: "Elegir Plantilla" },
          { icon: <FaImage />, label: "Generar Imagen" },
          { icon: <FaEdit />, label: "Personalizar" },
          { icon: <FaMagic />, label: "Variaciones" },
          { icon: <FaCheck />, label: "Finalizar" }
        ]}
        currentStep={step}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {renderStepIndicator()}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg shadow-xl p-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-300"
          >
            {error}
          </motion.div>
        )}

        <ImageList images={images} />
      </div>
    </div>
  );
};

export default ImageGeneratorPage;
