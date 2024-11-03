import axios from './axios';

export const generateImageApi = async (prompt) => {
  try {
    const response = await axios.post('/images/generate-image', { prompt });
    return response;
  } catch (error) {
    throw error;
  }
};

export const processImageApi = (imageUrl, overlayText, prompt, templateName) => {
  return axios.post('/images/process-image', { 
    imageUrl, 
    overlayText, 
    prompt,
    templateName 
  });
};

export const uploadSelectedImageApi = async (selectedImageId, imageData, prompt, originalImageUrl, overlayText) => {
  return axios.post('/images/upload-variation', {
    selectedImageId,
    imageData,
    prompt,
    originalImageUrl,
    overlayText
  });
};

export const fetchImagesApi = () => {
  return axios.get('/images');
};
