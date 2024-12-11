import axios from './axios';

export const generateImageApi = async ({ prompt, format, gender }) => {
  try {
    const response = await axios.post('/images/generate-image', { 
      prompt,
      format, 
      gender
    });
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

export const removeBackground = async (image) => {
  try {
    const response = await axios.post('/images/remove-bg', { image });
    return response.data.result;
  } catch (error) {
    throw error;
  }
}

export const processImageApi = (imageUrl, overlayText, prompt, templateName, format) => {
  return axios.post('/images/process-image', { 
    imageUrl, 
    overlayText, 
    prompt,
    templateName,
    format 
  });
};

export const uploadSelectedImageApi = async (
  selectedImageId, 
  imageData, 
  prompt, 
  originalImageUrl, 
  overlayText, 
  userId,
  format 
) => {
  return axios.post('/images/upload-variation', {
    selectedImageId,
    imageData,
    prompt,
    originalImageUrl,
    overlayText,
    userId,
    format 
  });
};

export const fetchImagesApi = () => {
  return axios.get('/images');
};
