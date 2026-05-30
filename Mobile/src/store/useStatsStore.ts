import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

export interface DailyCalorieStatDto {
  date: string;
  dayOfWeek: string;
  calories: number;
}

export interface StatRecordDto {
  value: number;
  dayOfWeek: string;
}

export interface TopFoodDto {
  foodName: string;
  count: number;
}

export interface WeeklyStatisticsDto {
  dailyCalorieGoal: number;
  dailyCalories: DailyCalorieStatDto[];
  averageCalories: number;
  maxCalories: StatRecordDto;
  minCalories: StatRecordDto;
  topFoods: TopFoodDto[];
}

interface StatsState {
  stats: WeeklyStatisticsDto | null;
  isLoading: boolean;
  error: string | null;
  fetchWeeklyStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchWeeklyStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const response = await axiosClient.get(`/Diary/statistics/weekly/${dateString}`);
      set({ stats: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch weekly stats:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
