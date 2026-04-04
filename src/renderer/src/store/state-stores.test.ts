import type { ChatMessage } from './chat-store';
import { createInitialChatState, useChatStore } from './chat-store';
import { createInitialConfigState, useConfigStore } from './config-store';
import { createInitialUiState, useUiStore } from './ui-store';

const resetUiStore = () => {
  useUiStore.setState({
    ...createInitialUiState(),
    openConversationPanel: useUiStore.getState().openConversationPanel,
    closeConversationPanel: useUiStore.getState().closeConversationPanel,
    toggleConversationPanel: useUiStore.getState().toggleConversationPanel,
    openSettings: useUiStore.getState().openSettings,
    closeSettings: useUiStore.getState().closeSettings,
    toggleSettings: useUiStore.getState().toggleSettings,
  });
};

const resetChatStore = () => {
  useChatStore.setState({
    ...createInitialChatState(),
    createConversation: useChatStore.getState().createConversation,
    selectConversation: useChatStore.getState().selectConversation,
    appendMessage: useChatStore.getState().appendMessage,
    setConversationTitle: useChatStore.getState().setConversationTitle,
    setSendState: useChatStore.getState().setSendState,
    resetSendState: useChatStore.getState().resetSendState,
  });
};

const resetConfigStore = () => {
  useConfigStore.setState({
    ...createInitialConfigState(),
    setMode: useConfigStore.getState().setMode,
    setConfigStatus: useConfigStore.getState().setConfigStatus,
    setRealModeAvailable: useConfigStore.getState().setRealModeAvailable,
  });
};

describe('state stores', () => {
  beforeEach(() => {
    resetUiStore();
    resetChatStore();
    resetConfigStore();
  });

  it('starts ui state closed and updates it through actions', () => {
    expect(useUiStore.getState().isConversationPanelOpen).toBe(false);
    expect(useUiStore.getState().isSettingsOpen).toBe(false);

    useUiStore.getState().openConversationPanel();
    expect(useUiStore.getState().isConversationPanelOpen).toBe(true);

    useUiStore.getState().toggleConversationPanel();
    expect(useUiStore.getState().isConversationPanelOpen).toBe(false);

    useUiStore.getState().openSettings();
    expect(useUiStore.getState().isSettingsOpen).toBe(true);

    useUiStore.getState().closeSettings();
    expect(useUiStore.getState().isSettingsOpen).toBe(false);
  });

  it('starts with one selected empty conversation titled New chat', () => {
    const state = useChatStore.getState();

    expect(state.conversations).toHaveLength(1);
    expect(state.conversations[0]?.title).toBe('New chat');
    expect(state.selectedConversationId).toBe(state.conversations[0]?.id);
    expect(state.messagesByConversation[state.selectedConversationId]).toEqual([]);
    expect(state.sendState).toEqual({
      status: 'idle',
      errorMessage: null,
    });
  });

  it('creates and selects a new conversation', () => {
    const initialConversationId = useChatStore.getState().selectedConversationId;

    const newConversationId = useChatStore
      .getState()
      .createConversation('Planning session');

    const state = useChatStore.getState();

    expect(state.conversations).toHaveLength(2);
    expect(state.selectedConversationId).toBe(newConversationId);
    expect(state.selectedConversationId).not.toBe(initialConversationId);
    expect(
      state.conversations.find((conversation) => conversation.id === newConversationId)
        ?.title,
    ).toBe('Planning session');
    expect(state.messagesByConversation[newConversationId]).toEqual([]);
  });

  it('ignores attempts to select an unknown conversation', () => {
    const initialConversationId = useChatStore.getState().selectedConversationId;

    useChatStore.getState().selectConversation('missing-conversation');

    expect(useChatStore.getState().selectedConversationId).toBe(
      initialConversationId,
    );
  });

  it('stores appended messages under the matching conversation and updates timestamps', () => {
    const conversation = useChatStore.getState().conversations[0];

    if (!conversation) {
      throw new Error('Expected seeded conversation to exist');
    }

    const initialUpdatedAt = conversation.updatedAt;
    const message: ChatMessage = {
      id: 'message-1',
      role: 'user',
      content: 'Hello Shellbase',
      createdAt: '2026-04-04T00:00:00.000Z',
    };

    useChatStore.getState().appendMessage(conversation.id, message);

    const updatedState = useChatStore.getState();
    const updatedConversation = updatedState.conversations[0];

    expect(updatedState.messagesByConversation[conversation.id]).toEqual([message]);
    expect(updatedConversation?.updatedAt).not.toBe(initialUpdatedAt);
  });

  it('starts config in mock mode and updates deterministically', () => {
    const initialState = useConfigStore.getState();

    expect(initialState.mode).toBe('mock');
    expect(initialState.configStatus).toBe('not-configured');
    expect(initialState.isRealModeAvailable).toBe(false);
    expect(initialState.modelLabel).toBe('Model');

    useConfigStore.getState().setMode('real');
    useConfigStore.getState().setConfigStatus('configured');
    useConfigStore.getState().setRealModeAvailable(true);

    expect(useConfigStore.getState()).toMatchObject({
      mode: 'real',
      configStatus: 'configured',
      isRealModeAvailable: true,
      modelLabel: 'Model',
    });
  });
});
