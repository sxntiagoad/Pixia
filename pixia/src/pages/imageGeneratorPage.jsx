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
import { getTemplatesApi, getTemplateByIdApi } from '../api/template';

const getAssetPath = (path) => {
  if (!path) return '/placeholder.png';
  
  // Definir las rutas base
  const PREVIEWS_PATH = '/src/assets/previews';
  const TEMPLATES_PATH = '/src/assets/templates';
  
  // Extraer el nombre del archivo
  const fileName = path.split('\\').pop().split('/').pop();
  
  // Determinar qué ruta base usar basado en el tipo de archivo
  if (path.includes('previews')) {
    return `${PREVIEWS_PATH}/${fileName}`;
  } else if (path.includes('templates')) {
    return `${TEMPLATES_PATH}/${fileName}`;
  }
  
  // Por defecto, usar previews
  return `${PREVIEWS_PATH}/${fileName}`;
};

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
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});

  useEffect(() => {
    fetchImages();
    fetchUserProfile();
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
      const response = await processImageApi(imageUrl, overlayText, prompt, selectedFormat);
      if (response.data && response.data.variations) {
        setVariations(response.data.variations);
        setStep(4); // Avanzar al paso de selección de variación
      } else {
        throw new Error('La respuesta no contiene variaciones válidas');
      }
    } catch (error) {
      setError('Hubo un error al procesar la imagen. Por favor, intente de nuevo.');
      console.error('Error al procesar la imagen:', error);
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
            })
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

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await getTemplatesApi();
      
      if (response.data && response.data.templates) {
        const validTemplates = response.data.templates.filter(t => 
          t.previewImagePath && 
          t.baseImagePath && 
          t.name
        );
        
        const templatesWithFullUrls = validTemplates.map(template => ({
          ...template,
          previewImagePath: getAssetPath(template.previewImagePath),
          baseImagePath: getAssetPath(template.baseImagePath)
        }));

        setTemplates(templatesWithFullUrls);
      }
    } catch (error) {
      setError('Error al cargar las plantillas: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
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
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-gray-300 mt-4">Cargando plantillas...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-300">No hay plantillas disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <motion.div
                    key={template._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative rounded-lg overflow-hidden cursor-pointer border-2 max-w-[300px] mx-auto ${
                      selectedTemplate?._id === template._id
                        ? 'border-green-500'
                        : 'border-transparent hover:border-green-400'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="relative w-full h-[450px]">
                      {template.previewImagePath && (
                        <img
                          src={template.previewImagePath}
                          alt={template.name}
                          className="w-full h-full object-contain bg-gray-900"
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-30" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-semibold">{template.name}</h3>
                        <span className="text-gray-300 text-sm">
                          {template.category}
                        </span>
                      </div>

                      {selectedTemplate?._id === template._id && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                          <FaCheck className="text-white" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {selectedTemplate && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Plantilla seleccionada: {selectedTemplate.name}
                  </h3>
                  {selectedTemplate.aiImageConfig && (
                    <>
                      <p className="text-gray-300">
                        Dimensiones: {selectedTemplate.aiImageConfig.dimensions?.width} x{" "}
                        {selectedTemplate.aiImageConfig.dimensions?.height}
                      </p>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={handleNextStep}
                disabled={!selectedTemplate}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedTemplate
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selectedTemplate ? 'Continuar con esta plantilla' : 'Selecciona una plantilla'}
              </button>
            </div>
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
              <button
                onClick={() => setStep(3)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300"
              >
                Siguiente
              </button>
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
                  className={`relative cursor-pointer border-4 rounded-lg overflow-hidden ${
                    selectedVariation?.id === variation.id ? 'border-indigo-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedVariation(variation)}
                >
                  <div className="relative w-full pt-[100%]">
                    <img 
                      src={`data:image/png;base64,${variation.data}`} 
                      alt={`Variación ${variation.id}`} 
                      className="absolute top-0 left-0 w-full h-full object-contain"
                      style={{ imageRendering: 'crisp-edges' }}
                    />
                  </div>
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

  const handleTemplateSelect = async (template) => {
    try {
      console.log('Template seleccionada:', template); // Para debugging
      setSelectedTemplate(template); // Usar directamente la plantilla sin hacer otra llamada
      setSelectedFormat(template.category);
      
      // Pre-configurar otros estados según la plantilla
      if (template.aiImageConfig) {
        setPrompt(template.aiImageConfig.promptGuide || '');
      }
    } catch (error) {
      console.error('Error al seleccionar la plantilla:', error);
      setError('Error al seleccionar la plantilla');
    }
  };

  const handleNextStep = () => {
    if (selectedTemplate) {
      try {
        // Configurar estados necesarios basados en la plantilla
        if (selectedTemplate.aiImageConfig?.promptGuide) {
          setPrompt(selectedTemplate.aiImageConfig.promptGuide);
        }
        setStep(2);
      } catch (error) {
        console.error('Error al avanzar al siguiente paso:', error);
        setError('Error al avanzar al siguiente paso');
      }
    }
  };

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
