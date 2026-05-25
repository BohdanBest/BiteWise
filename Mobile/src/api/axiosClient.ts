import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConfig';
import useAuthStore from '../store/useAuthStore';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Інтерсептор для додавання токена в кожен запит
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Інтерсептор для перехоплення помилок (наприклад, 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Якщо токен прострочився, можна зробити логаут або рефреш
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
