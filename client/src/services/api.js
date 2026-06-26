import axios from 'axios';

const PROD_API = 'https://klenty-project-project-management-portal-9nmi.onrender.com/api';
const DEV_API = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? DEV_API : PROD_API),
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('projectnest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Unable to connect to the server. Please try again later.',
      });
    }
    if (error.response.status === 401) {
      localStorage.removeItem('projectnest_token');
    }
    return Promise.reject(error.response.data || error);
  }
);

export default api;
