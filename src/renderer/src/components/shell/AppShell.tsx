import type { ShellbaseVersions } from '../../../../shared/shellbase-api';
import { useChatStore } from '../../store/chat-store';
import { useUiStore } from '../../store/ui-store';
import { ConversationPanel } from './ConversationPanel';
import { LeftRail } from './LeftRail';
import { RightRail } from './RightRail';
import { StatusBar } from './StatusBar';
import { TopChrome } from './TopChrome';
import { WorkspaceFrame } from './WorkspaceFrame';

type AppShellProps = {
  appName: string;
  platform: string;
  versions: ShellbaseVersions;
};

export const AppShell = ({ appName, platform, versions }: AppShellProps) => {
  const isConversationPanelOpen = useUiStore(
    (state) => state.isConversationPanelOpen,
  );
  const isSettingsOpen = useUiStore((state) => state.isSettingsOpen);
  const toggleConversationPanel = useUiStore(
    (state) => state.toggleConversationPanel,
  );
  const toggleSettings = useUiStore((state) => state.toggleSettings);
  const createConversation = useChatStore((state) => state.createConversation);
  const selectedConversationId = useChatStore(
    (state) => state.selectedConversationId,
  );
  const activeConversationTitle = useChatStore((state) => {
    const activeConversation = state.conversations.find(
      (conversation) => conversation.id === state.selectedConversationId,
    );

    return activeConversation?.title ?? 'New chat';
  });

  const handleCreateConversation = () => {
    createConversation();
  };

  return (
    <main className="h-screen overflow-hidden bg-[#262626] text-zinc-100">
      <div className="flex h-full flex-col bg-[linear-gradient(180deg,#2a2a2a_0%,#242424_100%)]">
        <TopChrome
          appName={appName}
          platform={platform}
          title={activeConversationTitle}
        />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <LeftRail
            appName={appName}
            isConversationPanelOpen={isConversationPanelOpen}
            isSettingsOpen={isSettingsOpen}
            onCreateConversation={handleCreateConversation}
            onToggleConversationPanel={toggleConversationPanel}
            onToggleSettings={toggleSettings}
          />
          <div className="flex min-w-0 flex-1 flex-col bg-[#262626]">
            <div className="flex min-h-0 flex-1 gap-2 bg-[#0d0d0d] p-2">
              <ConversationPanel isOpen={isConversationPanelOpen} />
              <WorkspaceFrame key={selectedConversationId} />
            </div>
            <StatusBar platform={platform} versions={versions} />
          </div>
          <RightRail />
        </div>
      </div>
    </main>
  );
};
