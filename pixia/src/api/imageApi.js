import axios from 'axios';

export const generateImageApi = (prompt) => {
  return axios.post('/api/images/generate-image', { prompt });
};

export const fetchImagesApi = () => {
  return axios.get('/api/images');
};
