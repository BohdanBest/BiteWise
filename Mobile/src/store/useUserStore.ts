import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  weightKg: number;
  heightCm: number;
  goalName: string;
  dailyCalorieGoal: number;
  formulaDetails: string;
}

export interface UpdateProfileDto {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: number; // 0: Lose, 1: Maintain, 2: Gain
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (dto: UpdateProfileDto) => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.get('/User/me');
      set({ profile: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch profile', error);
      set({ isLoading: false, error: error.message });
    }
  },

  updateProfile: async (dto: UpdateProfileDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosClient.put('/User/me', dto);
      set({ profile: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Failed to update profile', error);
      set({ isLoading: false, error: error.message });
      throw error; // Throw so component can catch and show alert
    }
  },

  clearProfile: () => set({ profile: null }),
}));
