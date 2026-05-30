// src/constants/apiConfig.ts
import { Platform } from 'react-native';

// Для Android емулятора localhost це 10.0.2.2. Для iOS емулятора - localhost (або 127.0.0.1)
// Вказуємо порт нашого бекенду (5138)
export const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5138/api' : 'http://192.168.31.149:5138/api';
