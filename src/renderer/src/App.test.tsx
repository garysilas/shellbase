import { fireEvent, render, screen, within } from '@testing-library/react';
import { useChatStore } from './store/chat-store';
import { useUiStore } from './store/ui-store';
import { App } from './App';

const resetUiStore = () => {
  useUiStore.setState({
    isConversationPanelOpen: false,
    isSettingsOpen: false,
    openConversationPanel: useUiStore.getState().openConversationPanel,
    closeConversationPanel: useUiStore.getState().closeConversationPanel,
    toggleConversationPanel: useUiStore.getState().toggleConversationPanel,
    openSettings: useUiStore.getState().openSettings,
    closeSettings: useUiStore.getState().closeSettings,
    toggleSettings: useUiStore.getState().toggleSettings,
  });
};

const resetChatStore = () => {
  const initialState = useChatStore.getInitialState();

  useChatStore.setState({
    conversations: initialState.conversations,
    selectedConversationId: initialState.selectedConversationId,
    messagesByConversation: initialState.messagesByConversation,
    sendState: initialState.sendState,
    createConversation: useChatStore.getState().createConversation,
    selectConversation: useChatStore.getState().selectConversation,
    appendMessage: useChatStore.getState().appendMessage,
    setConversationTitle: useChatStore.getState().setConversationTitle,
    setSendState: useChatStore.getState().setSendState,
    resetSendState: useChatStore.getState().resetSendState,
  });
};

describe('App', () => {
  beforeEach(() => {
    resetUiStore();
    resetChatStore();
  });

  it('renders the shell foundation layout', () => {
    Object.defineProperty(window, 'shellbase', {
      configurable: true,
      value: {
        getPlatform: () => 'darwin',
        getVersions: () => ({
          electron: '1.0.0',
          chrome: '1.0.0',
          node: '1.0.0',
        }),
      },
    });

    render(<App />);

    expect(screen.getAllByText('New chat')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open conversation panel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Conversation panel')).not.toBeInTheDocument();
    expect(screen.getByText('darwin session')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'New chat' })).not.toBeInTheDocument();
  });

  it('wires rail controls to ui and chat state', () => {
    Object.defineProperty(window, 'shellbase', {
      configurable: true,
      value: {
        getPlatform: () => 'darwin',
        getVersions: () => ({
          electron: '1.0.0',
          chrome: '1.0.0',
          node: '1.0.0',
        }),
      },
    });

    const initialConversationId = useChatStore.getState().selectedConversationId;
    const secondConversationId = useChatStore
      .getState()
      .createConversation('Design review');
    useChatStore.getState().selectConversation(initialConversationId);

    render(<App />);

    const newChatButton = screen.getByRole('button', { name: 'New chat' });
    const panelButton = screen.getByRole('button', {
      name: 'Open conversation panel',
    });
    const settingsButton = screen.getByRole('button', { name: 'Settings' });
    const initialConversationCount = useChatStore.getState().conversations.length;

    fireEvent.click(panelButton);

    const conversationPanel = screen.getByLabelText('Conversation panel');

    expect(conversationPanel).toBeInTheDocument();
    expect(useUiStore.getState().isConversationPanelOpen).toBe(true);
    expect(panelButton).toHaveAttribute('aria-pressed', 'true');
    expect(within(conversationPanel).getByText('Chats')).toBeInTheDocument();

    const selectedConversationButton = within(conversationPanel).getByRole(
      'button',
      { name: 'New chat' },
    );
    const secondaryConversationButton = within(conversationPanel).getByRole(
      'button',
      { name: 'Design review' },
    );

    expect(selectedConversationButton).toHaveAttribute('aria-pressed', 'true');
    expect(secondaryConversationButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(secondaryConversationButton);

    expect(useChatStore.getState().selectedConversationId).toBe(secondConversationId);
    expect(secondaryConversationButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(settingsButton);

    expect(useUiStore.getState().isSettingsOpen).toBe(true);
    expect(settingsButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(newChatButton);

    expect(useChatStore.getState().conversations).toHaveLength(
      initialConversationCount + 1,
    );
  });
});
