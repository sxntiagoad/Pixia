import React, { useEffect, useState } from 'react';
import { getVacanciesApi, generateVacancyTextsApi, generateVacancyPromptApi } from '../api/vacancy';
import { generateImageApi, fetchImagesApi, processImageApi, uploadSelectedImageApi, removeBackground } from '../api/imageApi';
import { getCleanTemplatesApi } from '../api/templateApi';
import { FaCheckCircle, FaCaretDown } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageEdit from '../components/ImageEdit';
import Navbar from '../components/Navbar';
import { Navigation, Pagination } from 'swiper/modules';
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
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-900 p-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-4">Editor de Imagen</h2>
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <ImageEdit 
                                imageUrl={selectedTemplate.url}
                                overlayImage={generatedTexts.processedImage}
                                initialTexts={[
                                    {
                                        text: generatedTexts.title || '',
                                        fontSize: 40,
                                        top: 0,
                                        left: 100,
                                    },
                                    {
                                        text: generatedTexts.text1 || '',
                                        fontSize: 18,
                                        top: 200,
                                        left: 100,
                                    },
                                    {
                                        text: generatedTexts.text2 || '',
                                        fontSize: 16,
                                        top: 400,
                                        left: 100,
                                    }
                                ]}
                                onSave={handleSaveEdit}
                            />
                            <div className="mt-4 flex justify-center gap-4">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                                >
                                    Volver
                                </button>
                                <button
                                    onClick={() => {/* Lógica para continuar */}}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header con efectos modernos */}
                    <div className="relative mb-8 p-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl backdrop-blur-sm border border-gray-700/50 shadow-xl">
                        <div className="absolute inset-0 bg-green-400/5 rounded-2xl"></div>
                        <div className="relative">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                                Magic Pixia 🪄✨
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Crea posts impactantes para tus vacantes en segundos
                            </p>
                        </div>
                    </div>

                    {/* Contenedor principal con diseño moderno */}
                    <div className="bg-gradient-to-b from-gray-800/80 to-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-lg">
                        {/* Sección de selección de vacantes con diseño mejorado */}
                        <div className="space-y-6">
                            <div className="relative">
                                <h2 className="text-xl font-semibold text-green-400 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Selecciona una Vacante
                                </h2>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                                    className="w-full text-left p-4 bg-gray-700/50 hover:bg-gray-700/70 transition-all duration-300 rounded-xl flex justify-between items-center border border-gray-600/30 focus:border-green-400/50 focus:outline-none"
                                >
                                    <span className="text-gray-200">
                                        {selectedVacancy ? selectedVacancy.title : 'Selecciona una vacante'}
                                    </span>
                                    <FaCaretDown className={`transition-transform duration-300 text-green-400 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <ul className="absolute z-10 w-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden shadow-xl">
                                        {vacancies.map((vacancy) => (
                                            <li
                                                key={vacancy.vacancyId}
                                                className={`p-4 cursor-pointer transition-all duration-300 
                                                    ${selectedVacancy?.vacancyId === vacancy.vacancyId 
                                                        ? 'bg-green-500/20 text-green-400' 
                                                        : 'hover:bg-gray-700/50 text-gray-300'}`}
                                                onClick={() => handleVacancySelect(vacancy)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{vacancy.title}</span>
                                                    {selectedVacancy?.vacancyId === vacancy.vacancyId && (
                                                        <FaCheckCircle className="text-green-400" />
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Sección de plantillas con diseño mejorado */}
                            <div>
                                <h2 className="text-xl font-semibold text-green-400 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Selecciona una Plantilla
                                </h2>
                                <div className="relative">
                                    <Swiper
                                        modules={[Navigation, Pagination]}
                                        spaceBetween={20}
                                        slidesPerView={3}
                                        navigation
                                        pagination={{ clickable: true }}
                                        className="template-swiper min-h-[280px]"
                                        breakpoints={{
                                            320: { slidesPerView: 1 },
                                            640: { slidesPerView: 2 },
                                            1024: { slidesPerView: 3 }
                                        }}
                                    >
                                        {templates.map(template => (
                                            <SwiperSlide key={template.key} className="p-2">
                                                <div
                                                    onClick={() => handleTemplateSelect(template)}
                                                    className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-500 
                                                        ${selectedTemplate?.key === template.key 
                                                            ? 'ring-2 ring-green-400 transform scale-105 shadow-lg shadow-green-400/20' 
                                                            : 'hover:ring-2 hover:ring-green-400/50 hover:scale-102'}`}
                                                >
                                                    <div className="relative aspect-[4/3] overflow-hidden">
                                                        <img 
                                                            src={template.url} 
                                                            alt={`Template ${template.key}`}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <p className="absolute bottom-3 left-3 text-white text-sm font-medium">
                                                                {template.key}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>

                            {/* Botón de generación con diseño mejorado */}
                            <div className="relative mt-8">
                                <button
                                    onClick={handleGeneratePost}
                                    disabled={!selectedVacancy || !selectedTemplate || isLoading}
                                    className={`w-full py-4 rounded-xl text-white transition-all duration-300 
                                        ${isLoading 
                                            ? 'bg-gray-600 cursor-not-allowed' 
                                            : selectedVacancy && selectedTemplate 
                                                ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-[1.02]' 
                                                : 'bg-gray-600 cursor-not-allowed'}`}
                                >
                                    {isLoading ? 'Generando...' : 'Generar Post Automático'}
                                </button>

                                {/* Barra de progreso mejorada */}
                                {isLoading && (
                                    <div className="mt-6">
                                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 flex justify-between text-sm">
                                            <span className="text-green-400">{progress}% Completado</span>
                                            <span className="text-gray-400">
                                                {progress <= 25 ? 'Generando textos...' :
                                                 progress <= 50 ? 'Creando prompt...' :
                                                 progress <= 75 ? 'Generando imagen...' :
                                                 'Procesando imagen...'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PixiaMagic;
