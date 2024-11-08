import axios from './axios';

// Obtener todas las vacantes
export const getVacanciesApi = async () => {
    try {
        const response = await axios.get('/vacancies');
        return response.data;
    } catch (error) {
        console.error('Error al obtener vacantes:', error);
        throw error;
    }
};

export const createVacancyApi = async (vacancyData) => {
    try {
        const response = await axios.post('/vacancies', vacancyData);
        return response;
    } catch (error) {
        console.error('Error al crear vacante:', error);
        throw error;
    }
};

// Generar textos para la vacante
export const generateVacancyTextsApi = async (vacancyData, format) => {
    try {
        const response = await axios.post('/prompts/vacancy-texts', {
            title: vacancyData.title,
            description: vacancyData.description,
            requirements: vacancyData.requirements,
            format: format
        });
        return response.data;
    } catch (error) {
        console.error('Error al generar textos de la vacante:', error);
        throw error;
    }
};

// Generar prompt para la vacante
export const generateVacancyPromptApi = async (textsData) => {
    try {
        const response = await axios.post('/prompts/vacancy-prompt', {
            title: textsData.title,
            description: textsData.text1,
            requirements: textsData.text2
        });
        return response.data;
    } catch (error) {
        console.error('Error al generar prompt de la vacante:', error);
        throw error;
    }
};