import axios from './axios';

// Obtener todas las plantillas
export const getTemplatesApi = async () => {
  try {
    const response = await axios.get('/templates');
    console.log('API Response:', response.data); // Para debugging
    return response;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

// Obtener una plantilla por ID
export const getTemplateByIdApi = async (templateId) => {
  try {
    const response = await axios.get(`/templates/${templateId}`);
    return response;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
};

// Crear una nueva plantilla
export const createTemplateApi = async (formData) => {
  try {
    const response = await axios.post('/templates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};