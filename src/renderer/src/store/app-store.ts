import { create } from 'zustand';

type AppStore = {
  title: string;
};

export const useAppStore = create<AppStore>(() => ({
  title: 'Shellbase',
}));
