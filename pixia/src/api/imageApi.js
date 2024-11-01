import axios from 'axios';

export const improvePromptApi = async (prompt, templateId) => {
  try {
    const response = await axios.post('/api/prompts/process', { 
      prompt,
      templateId
    });
    return response.data;
  } catch (error) {
    console.error('Error improving prompt:', error);
    throw error;
  }
};

export const generateImageApi = async (prompt, improvedPrompt, template) => {
  try {
    // Si no hay improvedPrompt, primero mejoramos el prompt
    if (!improvedPrompt) {
      const { improvedPrompt: newImprovedPrompt } = await improvePromptApi(prompt, template._id);
      improvedPrompt = newImprovedPrompt;
    }

    const response = await axios.post('/api/images/generate-image', { 
      prompt,
      improvedPrompt,
      templateConfig: {
        dimensions: template.aiImageConfig.dimensions,
        position: template.aiImageConfig.position,
        composition: template.aiImageConfig.composition
      }
    });
    
    return response;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const fetchImagesApi = () => {
  return axios.get('/api/images');
};

export const processImageApi = (imageUrl, overlayText, prompt, template) => {
  return axios.post('/api/images/process-image', { 
    imageUrl, 
    overlayText, 
    prompt,
    templateId: template._id,
    textFields: template.textFields,
    baseImagePath: template.baseImagePath
  });
};

export const uploadSelectedImageApi = async (selectedImageId, imageData, prompt, originalImageUrl, overlayText, template) => {
  if (!selectedImageId || !imageData || !prompt || !originalImageUrl || !overlayText || !template) {
    throw new Error('Missing required data for upload');
  }

  try {
    const response = await axios.post('/api/images/upload-variation', {
      selectedImageId,
      imageData,
      prompt,
      originalImageUrl,
      overlayText,
      templateData: {
        id: template._id,
        textFields: template.textFields,
        baseImagePath: template.baseImagePath,
        dimensions: template.aiImageConfig.dimensions,
        position: template.aiImageConfig.position
      }
    });
    
    return response;
  } catch (error) {
    console.error('Error in uploadSelectedImageApi:', error);
    throw error;
  }
};

// Nuevas funciones para manejar plantillas
export const fetchTemplatesApi = () => {
  return axios.get('/api/templates');
};

export const getTemplateByIdApi = (templateId) => {
  return axios.get(`/api/templates/${templateId}`);
};

// Función para previsualizar cómo quedaría la imagen en la plantilla
export const previewTemplateWithImageApi = async (templateId, imageUrl) => {
  try {
    const response = await axios.post('/api/templates/preview', {
      templateId,
      imageUrl
    });
    return response;
  } catch (error) {
    console.error('Error generating template preview:', error);
    throw error;
  }
};
