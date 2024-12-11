import axios from './axios';

export const getTemplatesApi = async () => {
  try {
    const response = await axios.get('/templates');
    console.log('Respuesta de getTemplatesApi:', response.data);
    return response;
  } catch (error) {
    console.error('Error al obtener templates:', error);
    throw error;
  }
};

export const getCleanTemplatesApi = async () => {
  try {
    console.log('Llamando a getCleanTemplatesApi');
    const response = await axios.get('/templates/pngtemplates');
    
    // Transformar el array de URLs en el formato que espera el componente
    const templates = response.data.map((url) => ({
      key: url.split('/').pop(), // Obtiene el nombre del archivo
      url: url,                  // URL completa de la imagen
    }));

    console.log('Templates procesados:', templates);
    return { data: templates };
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
    console.log('Respuesta de processWithTemplateApi:', response.data);
    return response;
  } catch (error) {
    console.error('Error al procesar template:', error);
    throw error;
  }
};
