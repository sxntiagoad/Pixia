import axios from './axios';

export const getTemplatesApi = async () => {
  try {
    const response = await axios.get('/templates');
    return response;
  } catch (error) {
    console.error('Error al obtener templates:', error);
    throw error;
  }
};

export const processWithTemplateApi = async (imageUrl, templateName, texts) => {
  try {
    const response = await axios.post('/templates/process', {
      imageUrl,
      templateName,
      texts
    });
    return response;
  } catch (error) {
    console.error('Error al procesar template:', error);
    throw error;
  }
};
