import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConfig';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додаємо змінні для уникнення race condition при рефреші токена
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Інтерсептор для додавання токена в кожен запит
axiosClient.interceptors.request.use(
  (config) => {
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
      if (isRefreshing) {
        // Якщо вже йде рефреш, додаємо запит у чергу
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const useAuthStore = require('../store/useAuthStore').default;
        const { token, refreshToken, setTokens, logout } = useAuthStore.getState();
        
        if (token && refreshToken) {
          // Робимо запит напряму через axios
          const response = await axios.post(`${API_BASE_URL}/Auth/refresh-token`, {
            accessToken: token,
            refreshToken: refreshToken
          });
          
          if (response.data && response.data.token && response.data.refreshToken) {
            await setTokens(response.data.token, response.data.refreshToken);
            
            // Відпускаємо всі запити з черги з новим токеном
            processQueue(null, response.data.token);
            
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            isRefreshing = false;
            return axiosClient(originalRequest);
          }
        }
        
        // Якщо немає токенів або рефреш не вдався
        processQueue(new Error('Tokens missing or invalid'));
        isRefreshing = false;
        useAuthStore.getState().logout();
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        const useAuthStore = require('../store/useAuthStore').default;
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
