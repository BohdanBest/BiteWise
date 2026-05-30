import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

export interface FoodEntryResponseDto {
  id: string;
  foodName: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  weightGrams: number;
  mealType: number; // 0=Breakfast, 1=Lunch, 2=Dinner, 3=Snack
  consumedAt: string;
}

export interface DailySummaryDto {
  totalCaloriesConsumed: number;
  dailyCalorieGoal: number;
  remainingCalories: number;
  totalProteins: number;
  totalFats: number;
  totalCarbs: number;
  entries: FoodEntryResponseDto[];
}

interface DiaryState {
  selectedDate: Date;
  summary: DailySummaryDto | null;
  isLoading: boolean;
  error: string | null;
  fetchSummary: (date: Date) => Promise<void>;
  changeDate: (daysOffset: number) => void;
  addFoodItem: (item: any) => Promise<void>;
  deleteFoodItem: (entryId: string) => Promise<void>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  selectedDate: new Date(),
  summary: null,
  isLoading: false,
  error: null,

  fetchSummary: async (date: Date) => {
    set({ isLoading: true, error: null });
    try {
      // Format date to YYYY-MM-DD for backend
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const response = await axiosClient.get(`/Diary/summary/${dateString}`);
      set({ summary: response.data, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch diary summary:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  changeDate: (daysOffset: number) => {
    const currentDate = get().selectedDate;
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + daysOffset);
    
    set({ selectedDate: newDate });
    get().fetchSummary(newDate);
  },

  addFoodItem: async (item: any) => {
    set({ isLoading: true, error: null });
    try {
      // Мапінг текстового mealType на enum
      let mealTypeEnum = 1; // Lunch by default
      if (item.mealType === 'breakfast') mealTypeEnum = 0;
      else if (item.mealType === 'lunch') mealTypeEnum = 1;
      else if (item.mealType === 'dinner') mealTypeEnum = 2;
      else if (item.mealType === 'snack') mealTypeEnum = 3;

      const payload = {
        foodName: item.name,
        calories: item.calories,
        proteins: item.proteins,
        fats: item.fats,
        carbs: item.carbs,
        weightGrams: item.weight,
        mealType: mealTypeEnum,
      };

      await axiosClient.post('/Diary/add', payload);
      
      // Після успішного додавання оновлюємо дані для поточного дня
      const currentDate = get().selectedDate;
      await get().fetchSummary(currentDate);
    } catch (error: any) {
      console.error('Failed to add food item:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  deleteFoodItem: async (entryId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.delete(`/Diary/${entryId}`);
      
      const currentDate = get().selectedDate;
      await get().fetchSummary(currentDate);
    } catch (error: any) {
      console.error('Failed to delete food item:', error);
      set({ error: error.message, isLoading: false });
    }
  }
}));
