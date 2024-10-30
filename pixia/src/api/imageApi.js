import axios from 'axios';

export const improvePromptApi = async (prompt) => {
  try {
    const response = await axios.post('/api/prompts/process', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error improving prompt:', error);
    throw error;
  }
};

export const generateImageApi = async (prompt, improvedPrompt) => {
  try {
    // Si no hay improvedPrompt, primero mejoramos el prompt
    if (!improvedPrompt) {
      const { improvedPrompt: newImprovedPrompt } = await improvePromptApi(prompt);
      improvedPrompt = newImprovedPrompt;
    }

    const response = await axios.post('/api/images/generate-image', { 
      prompt,
      improvedPrompt 
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

export const processImageApi = (imageUrl, overlayText, prompt) => {
  return axios.post('/api/images/process-image', { imageUrl, overlayText, prompt });
};

export const uploadSelectedImageApi = async (selectedImageId, imageData, prompt, originalImageUrl, overlayText) => {
  // Asegurarse de que todos los datos necesarios estén presentes
  if (!selectedImageId || !imageData || !prompt || !originalImageUrl || !overlayText) {
    throw new Error('Missing required data for upload');
  }

  try {
    const response = await axios.post('/api/images/upload-variation', {
      selectedImageId,
      imageData,
      prompt,
      originalImageUrl,
      overlayText
    });
    
    return response;
  } catch (error) {
    console.error('Error in uploadSelectedImageApi:', error);
    throw error;
  }
};
