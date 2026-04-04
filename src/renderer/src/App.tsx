import { AppShell } from './components/shell/AppShell';
import { useChatStore } from './store/chat-store';
import { useConfigStore } from './store/config-store';
import { useUiStore } from './store/ui-store';

const fallbackVersions = {
  electron: 'unavailable',
  chrome: 'unavailable',
  node: 'unavailable',
} as const;

export const App = () => {
  const appName = useUiStore((state) => state.appName);
  const isConversationPanelOpen = useUiStore(
    (state) => state.isConversationPanelOpen,
  );
  const isSettingsOpen = useUiStore((state) => state.isSettingsOpen);
  const mode = useConfigStore((state) => state.mode);
  const workspaceTitle = useChatStore((state) => {
    const activeConversation = state.conversations.find(
      (conversation) => conversation.id === state.activeConversationId,
    );

    return activeConversation?.title ?? 'New chat';
  });

  const shellbaseApi = window.shellbase;
  const platform = shellbaseApi?.getPlatform?.() ?? 'desktop';
  const versions = shellbaseApi?.getVersions?.() ?? fallbackVersions;

  return (
    <AppShell
      appName={appName}
      platform={platform}
      versions={versions}
      workspaceTitle={workspaceTitle}
      isConversationPanelOpen={isConversationPanelOpen}
      isSettingsOpen={isSettingsOpen}
      mode={mode}
    />
  );
};
