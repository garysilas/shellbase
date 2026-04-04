import { create } from 'zustand';

export type ChatMode = 'mock' | 'real';

type ConfigStore = {
  mode: ChatMode;
  isGatewayConfigured: boolean;
  model: string;
  setMode: (mode: ChatMode) => void;
  setGatewayConfigured: (isConfigured: boolean) => void;
};

export const useConfigStore = create<ConfigStore>((set) => ({
  mode: 'mock',
  isGatewayConfigured: false,
  model: 'gateway-default',
  setMode: (mode) => set({ mode }),
  setGatewayConfigured: (isGatewayConfigured) =>
    set({ isGatewayConfigured }),
}));
