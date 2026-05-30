import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { lightColors, darkColors } from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  getColors: () => typeof lightColors;
  isDark: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
      isDark: () => {
        const { mode } = get();
        if (mode === 'system') {
          return Appearance.getColorScheme() === 'dark';
        }
        return mode === 'dark';
      },
      getColors: () => {
        const { isDark } = get();
        return isDark() ? darkColors : lightColors;
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
