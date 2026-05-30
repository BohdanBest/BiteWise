import { create } from 'zustand';

export enum Gender {
  Male = 0,
  Female = 1,
}

export enum Goal {
  LoseWeight = 0,
  MaintainWeight = 1,
  GainWeight = 2,
}

export interface RegistrationData {
  name?: string;
  email?: string;
  password?: string;
  gender?: Gender;
  age?: number;
  weightKg?: number;
  heightCm?: number;
  goal?: Goal;
}

interface RegistrationState {
  data: RegistrationData;
  updateData: (newData: Partial<RegistrationData>) => void;
  clearData: () => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  data: {},
  updateData: (newData) => 
    set((state) => ({ data: { ...state.data, ...newData } })),
  clearData: () => set({ data: {} }),
}));
