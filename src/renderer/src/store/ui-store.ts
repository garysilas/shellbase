import { create } from 'zustand';

type UiStore = {
  appName: string;
  isConversationPanelOpen: boolean;
  isSettingsOpen: boolean;
  setConversationPanelOpen: (isOpen: boolean) => void;
  toggleConversationPanel: () => void;
  setSettingsOpen: (isOpen: boolean) => void;
  toggleSettings: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  appName: 'Shellbase',
  isConversationPanelOpen: false,
  isSettingsOpen: false,
  setConversationPanelOpen: (isConversationPanelOpen) =>
    set({ isConversationPanelOpen }),
  toggleConversationPanel: () =>
    set((state) => ({
      isConversationPanelOpen: !state.isConversationPanelOpen,
    })),
  setSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  toggleSettings: () =>
    set((state) => ({
      isSettingsOpen: !state.isSettingsOpen,
    })),
}));
