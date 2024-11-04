import axios from './axios';

export const generateImageApi = async (prompt) => {
  try {
    const response = await axios.post('/images/generate-image', { prompt });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProcessedImageUrlsByUserId = async (userId) => {
  try {
    const response = await axios.get(`/images/get-images/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching processed images:', error);
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

export const uploadSelectedImageApi = async (selectedImageId, imageData, prompt, originalImageUrl, overlayText, userId) => {
  return axios.post('/images/upload-variation', {
    selectedImageId,
    imageData,
    prompt,
    originalImageUrl,
    overlayText,
    userId
  });
};

export const fetchImagesApi = () => {
  return axios.get('/images');
};
