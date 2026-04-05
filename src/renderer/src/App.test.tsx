import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { useChatStore } from './store/chat-store';
import { createInitialConfigState, useConfigStore } from './store/config-store';
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

const resetConfigStore = () => {
  useConfigStore.setState({
    ...createInitialConfigState(),
    setMode: useConfigStore.getState().setMode,
    setConfigStatus: useConfigStore.getState().setConfigStatus,
    setRealModeAvailable: useConfigStore.getState().setRealModeAvailable,
  });
};

describe('App', () => {
  beforeEach(() => {
    resetUiStore();
    resetChatStore();
    resetConfigStore();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
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

  it('sends a mock-mode message and appends a deterministic assistant reply', async () => {
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

    const composer = screen.getByLabelText('Message composer');
    const sendButton = screen.getByRole('button', { name: 'Send message' });

    fireEvent.change(composer, {
      target: { value: 'Hello Shellbase' },
    });
    fireEvent.click(sendButton);

    expect(await screen.findByText('Hello Shellbase')).toBeInTheDocument();
    expect(
      await screen.findByText('Mock response: Hello Shellbase'),
    ).toBeInTheDocument();
  });

  it('opens settings, shows config status, and switches mode', async () => {
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

    vi.stubEnv('VITE_AI_GATEWAY_API_KEY', 'test-gateway-key');

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));

    const settingsDialog = screen.getByRole('dialog', { name: 'Settings' });

    expect(await within(settingsDialog).findByText('Configured')).toBeInTheDocument();
    expect(
      within(settingsDialog).getByText('Real mode available'),
    ).toBeInTheDocument();

    const realModeButton = within(settingsDialog).getByRole('button', {
      name: 'Real mode',
    });
    const mockModeButton = within(settingsDialog).getByRole('button', {
      name: 'Mock mode',
    });

    fireEvent.click(realModeButton);
    expect(useConfigStore.getState().mode).toBe('real');

    fireEvent.click(mockModeButton);
    expect(useConfigStore.getState().mode).toBe('mock');
  });

  it('keeps real mode guarded when gateway config is unavailable', async () => {
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

    vi.stubEnv('VITE_AI_GATEWAY_API_KEY', '');

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));

    const settingsDialog = screen.getByRole('dialog', { name: 'Settings' });
    const realModeButton = within(settingsDialog).getByRole('button', {
      name: 'Real mode',
    });

    expect(await within(settingsDialog).findByText('Not configured')).toBeInTheDocument();
    expect(realModeButton).toBeDisabled();
    expect(
      within(settingsDialog).getByText(
        'Real mode unavailable. Set VITE_AI_GATEWAY_API_KEY to enable it.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(realModeButton);

    expect(useConfigStore.getState().mode).toBe('mock');
  });
});
