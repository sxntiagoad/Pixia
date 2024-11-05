import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageForm from '../components/ImageForm';
import ImagePreview from '../components/ImagePreview';
import ImageList from '../components/ImageList';
import { getVacanciesApi, generateVacancyTextsApi, generateVacancyPromptApi } from '../api/vacancy';
import { generateImageApi, fetchImagesApi, processImageApi, uploadSelectedImageApi } from '../api/imageApi';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaEdit, FaMagic, FaCheck, FaFileAlt } from 'react-icons/fa';
import StepIndicator from '../components/StepIndicator';
import { getTemplatesApi, processWithTemplateApi } from '../api/templateApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  const [autoMode, setAutoMode] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  useEffect(() => {
    fetchImages();
    fetchTemplates();
    fetchVacancies();
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

  const fetchVacancies = async () => {
    try {
      const data = await getVacanciesApi();
      setVacancies(data);
    } catch (error) {
      console.error('Error al obtener vacantes:', error);
      setError('Error al cargar las vacantes');
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await getTemplatesApi();
      console.log('Templates recibidos:', response.data);
      if (response.data && response.data.templates) {
        setTemplates(response.data.templates);
        // Si no hay template seleccionado, seleccionar el primero de la lista
        if (!selectedTemplate && response.data.templates.length > 0) {
          setSelectedTemplate(response.data.templates[0].id);
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

  const handleAutomaticProcess = async () => {
    if (!selectedTemplate) {
      setError('Por favor seleccione una plantilla');
      return;
    }

    if (!selectedVacancy) {
      setError('Por favor seleccione una vacante');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      
      //Generar la imagen con el prompt
      const { prompt: generatedPrompt } = await generateVacancyPromptApi(generatedTexts);

      //Generar el prompt y los textos automáticamente
      const { generatedTexts } = await generateVacancyTextsApi(selectedVacancy);

      //Generar la imagen
      const imageResponse = await generateImageApi(generatedPrompt);
      const generatedImageUrl = imageResponse.data.imageUrl;

      //Procesar la imagen con el template
      const processResponse = await processImageApi(
        generatedImageUrl,
        JSON.stringify({
          title: generatedTexts.title,
          description: generatedTexts.text1,
          requirements: generatedTexts.text2
        }),
        generatedPrompt,
        selectedTemplate
      );

      // Actualizar el estado con todos los datos generados
      setPrompt(generatedPrompt);
      setOverlayTitle(generatedTexts.title);
      setOverlayDescription(generatedTexts.text1);
      setOverlayRequirements(generatedTexts.text2);
      setImageUrl(generatedImageUrl);
      setVariations(processResponse.data.variations);

      // Saltar al paso 4
      setStep(4);

    } catch (error) {
      console.error('Error en el proceso automático:', error);
      setError('Error en el proceso automático. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">Paso 1: Elegir Plantilla</h2>
            <div className="flex items-center justify-end mb-4">
              <label className="flex items-center cursor-pointer">
                <span className="mr-3 text-sm font-medium text-gray-300">Modo Automático</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={autoMode}
                    onChange={() => {
                      setAutoMode(!autoMode);
                      setSelectedVacancy(null); // Resetear la selección al cambiar de modo
                    }}
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${
                    autoMode ? 'bg-green-500' : 'bg-gray-600'
                  }`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                    autoMode ? 'transform translate-x-6' : ''
                  }`}></div>
                </div>
              </label>
            </div>

            {/* Selector de vacantes en modo automático */}
            {autoMode && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seleccionar Vacante
                </label>
                <select
                  value={selectedVacancy?._id || ''}
                  onChange={(e) => {
                    const vacancy = vacancies.find(v => v._id === e.target.value);
                    setSelectedVacancy(vacancy);
                  }}
                  className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Seleccione una vacante</option>
                  {vacancies.map((vacancy) => (
                    <option key={vacancy._id} value={vacancy._id}>
                      {vacancy.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="format" className="block text-sm font-medium text-gray-300 mb-2">Formato</label>
              <select
                id="format"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="NORMAL_POST">Normal Post</option>
                <option value="STORIES_POST">Story Post</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Selecciona una Plantilla</label>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={6}
                navigation
                pagination={{ clickable: true }}
                className="template-swiper"
                breakpoints={{
                  // cuando el ancho de ventana es >= 320px
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                  },
                  // cuando el ancho de ventana es >= 480px
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 15
                  },
                  // cuando el ancho de ventana es >= 640px
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 20
                  }
                }}
              >
                {templates.map(template => (
                  <SwiperSlide key={template.id}>
                    <div
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                        selectedTemplate === template.id 
                          ? 'ring-4 ring-indigo-500 transform scale-105' 
                          : 'hover:ring-2 hover:ring-indigo-400 hover:scale-102'
                      }`}
                    >
                      <div className="relative w-64 mx-auto"> {/* Ancho fijo más pequeño */}
                        <img 
                          src={template.previewUrl} 
                          alt={`Template ${template.id}`}
                          className="w-full h-40 object-cover" /* Altura más pequeña */
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                          <p className="text-white text-center text-sm font-medium">
                            {template.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <button
              onClick={autoMode ? handleAutomaticProcess : () => setStep(2)}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              {isLoading ? 'Procesando...' : (autoMode ? 'Generar Automáticamente' : 'Siguiente')}
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
