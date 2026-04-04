import { create } from 'zustand';

export type UiStore = {
  isConversationPanelOpen: boolean;
  isSettingsOpen: boolean;
  openConversationPanel: () => void;
  closeConversationPanel: () => void;
  toggleConversationPanel: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
};

export const createInitialUiState = (): Pick<
  UiStore,
  'isConversationPanelOpen' | 'isSettingsOpen'
> => ({
  isConversationPanelOpen: false,
  isSettingsOpen: false,
});

export const useUiStore = create<UiStore>((set) => ({
  ...createInitialUiState(),
  openConversationPanel: () => set({ isConversationPanelOpen: true }),
  closeConversationPanel: () => set({ isConversationPanelOpen: false }),
  toggleConversationPanel: () =>
    set((state) => ({
      isConversationPanelOpen: !state.isConversationPanelOpen,
    })),
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  toggleSettings: () =>
    set((state) => ({
      isSettingsOpen: !state.isSettingsOpen,
    })),
}));
