import type { ShellbaseVersions } from '../../../../shared/shellbase-api';
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
  const isConversationPanelOpen = false;

  return (
    <main className="h-screen overflow-hidden bg-[#262626] text-zinc-100">
      <div className="flex h-full flex-col bg-[linear-gradient(180deg,#2a2a2a_0%,#242424_100%)]">
        <TopChrome appName={appName} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <LeftRail appName={appName} />
          <ConversationPanel isOpen={isConversationPanelOpen} />
          <div className="flex min-w-0 flex-1 flex-col bg-[#262626]">
            <WorkspaceFrame title="New chat" />
            <StatusBar platform={platform} versions={versions} />
          </div>
          <RightRail />
        </div>
      </div>
    </main>
  );
};
