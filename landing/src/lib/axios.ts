import axios from 'axios';

const config = {
  baseURL: `https://localhost:7257/`,
  headers: {
    // Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const axiosClient = axios.create(config);
axiosClient.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      if (request.headers) {
        request.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return request;
  },
  (error) => Promise.reject(error)
);
axiosClient.interceptors.response.use(
  (response) => {
    console.log('🚀 ~ response:', response);
    return response.data ?? response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
