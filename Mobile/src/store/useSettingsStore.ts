import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationService } from '../services/NotificationService';

interface SettingsState {
  notificationsEnabled: boolean;
  mealTimes: {
    breakfast: string; // HH:mm format
    lunch: string;
    dinner: string;
  };
  toggleNotifications: (enabled: boolean) => Promise<void>;
  updateMealTime: (meal: 'breakfast' | 'lunch' | 'dinner', time: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      notificationsEnabled: false,
      mealTimes: {
        breakfast: '09:00',
        lunch: '14:00',
        dinner: '19:00',
      },
      toggleNotifications: async (enabled: boolean) => {
        set({ notificationsEnabled: enabled });
        const { mealTimes } = get();
        await NotificationService.scheduleMealReminders(enabled, mealTimes);
      },
      updateMealTime: async (meal, time) => {
        set((state) => ({
          mealTimes: { ...state.mealTimes, [meal]: time }
        }));
        const { notificationsEnabled, mealTimes } = get();
        if (notificationsEnabled) {
          await NotificationService.scheduleMealReminders(notificationsEnabled, mealTimes);
        }
      }
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
