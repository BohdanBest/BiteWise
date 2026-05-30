import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axiosClient';
import { useUserStore } from './useUserStore';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  setTokens: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  isLoading: true, // Початково true, щоб показати Splash Screen під час перевірки

  login: async (data: any) => {
    const response = await axiosClient.post('/Auth/login', data);
    const { token, refreshToken } = response.data;
    await AsyncStorage.multiSet([
      ['userToken', token],
      ['refreshToken', refreshToken]
    ]);
    set({ token, refreshToken });
    await useUserStore.getState().fetchProfile();
  },

  register: async (data: any) => {
    const response = await axiosClient.post('/Auth/register', data);
    const { token, refreshToken } = response.data;
    await AsyncStorage.multiSet([
      ['userToken', token],
      ['refreshToken', refreshToken]
    ]);
    set({ token, refreshToken });
    await useUserStore.getState().fetchProfile();
  },

  setTokens: async (token: string, refreshToken: string) => {
    await AsyncStorage.multiSet([
      ['userToken', token],
      ['refreshToken', refreshToken]
    ]);
    set({ token, refreshToken, isLoading: false });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['userToken', 'refreshToken']);
    set({ token: null, refreshToken: null, isLoading: false });
    useUserStore.getState().clearProfile();
  },

  checkAuth: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const [[, token], [, refreshToken]] = await AsyncStorage.multiGet(['userToken', 'refreshToken']);
      if (token && refreshToken) {
        set({ token, refreshToken, isLoading: false });
        await useUserStore.getState().fetchProfile();
      } else {
        set({ token: null, refreshToken: null, isLoading: false });
      }
    } catch (e) {
      set({ token: null, refreshToken: null, isLoading: false });
    }
  }
}));

export default useAuthStore;
