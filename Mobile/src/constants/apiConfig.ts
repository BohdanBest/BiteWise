// src/constants/apiConfig.ts
import { Platform } from 'react-native';

// Для Android емулятора localhost це 10.0.2.2. Для iOS емулятора - localhost (або 127.0.0.1)
// Вказуємо порт нашого бекенду (5207 або 5000)
export const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5207/api' : 'http://localhost:5207/api';
