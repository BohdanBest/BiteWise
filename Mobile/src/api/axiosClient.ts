import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConfig';

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
    // Використовуємо lazy require, щоб уникнути Require cycle: axiosClient -> useAuthStore -> axiosClient
    const useAuthStore = require('../store/useAuthStore').default;
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
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const useAuthStore = require('../store/useAuthStore').default;
        const { token, refreshToken, setTokens, logout } = useAuthStore.getState();
        
        if (token && refreshToken) {
          // Робимо запит напряму через axios, щоб уникнути нескінченного циклу інтерсепторів axiosClient
          const response = await axios.post(`${API_BASE_URL}/Auth/refresh`, {
            accessToken: token,
            refreshToken: refreshToken
          });
          
          if (response.data && response.data.token && response.data.refreshToken) {
            // Оновлюємо токени в сторі
            await setTokens(response.data.token, response.data.refreshToken);
            
            // Повторюємо оригінальний запит з новим токеном
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return axiosClient(originalRequest);
          }
        }
        
        // Якщо немає токенів або рефреш не вдався
        logout();
      } catch (refreshError) {
        const useAuthStore = require('../store/useAuthStore').default;
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
