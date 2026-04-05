import { create } from 'zustand';

export type AppMode = 'mock' | 'real';
export type ConfigStatus = 'configured' | 'not-configured';

export type ConfigStore = {
  mode: AppMode;
  configStatus: ConfigStatus;
  isRealModeAvailable: boolean;
  modelLabel: string;
  setMode: (mode: AppMode) => void;
  setConfigStatus: (status: ConfigStatus) => void;
  setRealModeAvailable: (available: boolean) => void;
};

export const createInitialConfigState = (): Pick<
  ConfigStore,
  'mode' | 'configStatus' | 'isRealModeAvailable' | 'modelLabel'
> => ({
  mode: 'mock',
  configStatus: 'not-configured',
  isRealModeAvailable: false,
  modelLabel: 'Model',
});

export const useConfigStore = create<ConfigStore>((set) => ({
  ...createInitialConfigState(),
  setMode: (mode) => set({ mode }),
  setConfigStatus: (configStatus) =>
    set((state) => ({
      configStatus,
      isRealModeAvailable: configStatus === 'configured',
      mode: configStatus === 'configured' ? state.mode : 'mock',
    })),
  setRealModeAvailable: (isRealModeAvailable) =>
    set((state) => ({
      isRealModeAvailable,
      configStatus: isRealModeAvailable ? 'configured' : 'not-configured',
      mode: isRealModeAvailable ? state.mode : 'mock',
    })),
}));
