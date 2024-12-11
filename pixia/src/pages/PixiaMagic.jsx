import React, { useEffect, useState } from 'react';
import { getVacanciesApi, generateVacancyTextsApi, generateVacancyPromptApi } from '../api/vacancy';
import { generateImageApi, fetchImagesApi, processImageApi, uploadSelectedImageApi, removeBackground } from '../api/imageApi';
import { getCleanTemplatesApi } from '../api/templateApi';
import { FaCheckCircle, FaCaretDown } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageEdit from '../components/ImageEdit';
import 'swiper/swiper-bundle.css';

const PixiaMagic = () => {
    const [vacancies, setVacancies] = useState([]);
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [generatedTexts, setGeneratedTexts] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vacanciesData = await getVacanciesApi();
                setVacancies(vacanciesData);

                const templatesResponse = await getCleanTemplatesApi();
                setTemplates(templatesResponse.data);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleVacancySelect = (vacancy) => {
        console.log('Vacante seleccionada en handleVacancySelect:', vacancy);
        setSelectedVacancy(vacancy);
        setIsDropdownOpen(false);
        setGeneratedTexts(null);
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setGeneratedTexts(null); // Resetear textos generados
    };

    const handleGeneratePost = async () => {
        if (!selectedVacancy || !selectedTemplate || isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            setProgress(0);

            const format = 'NORMAL_POST';
            const format_img='STORIES_POST';
            
            setProgress(10);
            const { generatedTexts } = await generateVacancyTextsApi(selectedVacancy, format);
            setProgress(25);
            
            setProgress(37);

            // 2. Generar prompt (50%)
            const { prompt: generatedPrompt } = await generateVacancyPromptApi(generatedTexts);
            setProgress(50);

            setProgress(65);

            
            // 3. Generar imagen (75%)
            const imageResponse = await generateImageApi({
                prompt: generatedPrompt,
                format: format_img
            });
            setProgress(75);

            // 4. Remover fondo (100%)
            const generatedImageUrl = imageResponse.data.imageUrl;
            const removedBgImage = await removeBackground(generatedImageUrl);
            setProgress(100);

            setGeneratedTexts({
                ...generatedTexts,
                processedImage: removedBgImage
            });
            
            setIsEditing(true);

        } catch (error) {
            console.error('Error al generar el post:', error);
        } finally {
            setIsLoading(false);
            setProgress(0);
        }
    };

    const handleSaveEdit = (editedData) => {
        // Aquí puedes manejar el guardado de la edición
        console.log('Datos editados:', editedData);
    };

    if (isEditing && generatedTexts?.processedImage) {
        return (
            <div className="min-h-screen bg-gray-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-4">Imagen Procesada</h2>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <div className="relative aspect-square w-full max-w-xl mx-auto">
                            <img 
                                src={generatedTexts.processedImage}
                                alt="Imagen procesada sin fondo"
                                className="w-full h-full object-contain rounded-lg"
                            />
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg mr-4"
                            >
                                Volver
                            </button>
                            <button
                                onClick={() => {/* Aquí puedes agregar la lógica para continuar */}}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Pixia Magic</h1>
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4 max-w-6xl mx-auto">
                {/* Sección de selección de vacantes */}
                <h2 className="text-xl font-semibold text-green-400 mb-2">Selecciona una Vacante</h2>
                <div className="relative mb-4">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                        className="w-full text-left p-3 bg-gray-700 rounded-lg flex justify-between items-center"
                    >
                        {selectedVacancy ? selectedVacancy.title : 'Selecciona una vacante'}
                        <FaCaretDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <ul className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1">
                            {vacancies.map((vacancy) => (
                                <li
                                    key={vacancy.vacancyId}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors duration-300 
                                        ${selectedVacancy?.vacancyId === vacancy.vacancyId ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                    onClick={() => handleVacancySelect(vacancy)}
                                >
                                    <span className="text-white">{vacancy.title}</span>
                                    {selectedVacancy?.vacancyId === vacancy.vacancyId && (
                                        <FaCheckCircle className="text-green-300 float-right" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Sección de selección de plantillas */}
                <h2 className="text-xl font-semibold text-green-400 mb-2">Selecciona una Plantilla</h2>
                <div className="mb-6">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={3}
                        navigation
                        pagination={{ clickable: true }}
                        className="template-swiper min-h-[250px]"
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 10
                            },
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 15
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 20
                            }
                        }}
                    >
                        {templates.map(template => (
                            <SwiperSlide key={template.key} className="flex items-center justify-center py-2">
                                <div
                                    onClick={() => handleTemplateSelect(template)}
                                    className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 w-full max-w-[200px] shadow-lg ${
                                        selectedTemplate?.key === template.key 
                                            ? 'ring-4 ring-indigo-500 transform scale-105 shadow-xl' 
                                            : 'hover:ring-2 hover:ring-indigo-400 hover:scale-102'
                                    }`}
                                >
                                    <div className="relative w-full flex justify-center">
                                        <img 
                                            src={template.url} 
                                            alt={`Template ${template.key}`}
                                            className="w-auto h-auto max-h-[200px] object-contain"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2">
                                            <p className="text-white text-center text-sm font-medium">
                                                {template.key}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Botón para generar con barra de progreso */}
                <div className="relative">
                    <button
                        onClick={handleGeneratePost}
                        disabled={!selectedVacancy || !selectedTemplate || isLoading}
                        className={`w-full px-6 py-2 rounded-lg text-white transition-colors duration-300 
                            ${isLoading 
                                ? 'bg-gray-600 cursor-not-allowed' 
                                : selectedVacancy && selectedTemplate 
                                    ? 'bg-green-600 hover:bg-green-700' 
                                    : 'bg-gray-600 cursor-not-allowed'}`}
                    >
                        {isLoading ? 'Generando...' : 'Generar Post Automático'}
                    </button>

                    {/* Barra de progreso */}
                    {isLoading && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                    className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="text-center text-sm text-gray-400 mt-2">
                                {progress}% Completado
                            </div>
                            <div className="text-center text-xs text-gray-500 mt-1">
                                {progress <= 25 ? 'Generando textos...' :
                                 progress <= 50 ? 'Creando prompt...' :
                                 progress <= 75 ? 'Generando imagen...' :
                                 'Procesando imagen...'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PixiaMagic;
