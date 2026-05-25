import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true, // Початково true, щоб показати Splash Screen під час перевірки

  setToken: async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    set({ token, isLoading: false });
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    set({ token: null, isLoading: false });
  },

  checkAuth: async () => {
    try {
      // Штучна затримка для показу Splash Screen (2.5 сек)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const token = await AsyncStorage.getItem('userToken');
      set({ token, isLoading: false });
    } catch (e) {
      set({ token: null, isLoading: false });
    }
  }
}));

export default useAuthStore;
