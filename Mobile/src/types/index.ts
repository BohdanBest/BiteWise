export interface User {
  id: string;
  name: string;
  email: string;
  gender: number;
  age: number;
  weightKg: number;
  heightCm: number;
  goal: number;
  dailyCalorieGoal: number;
}

export interface FoodEntry {
  id: string;
  foodName: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  weightGrams: number;
  mealType: number;
  consumedAt: string;
}
