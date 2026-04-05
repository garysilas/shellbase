import { SettingsModal } from '../settings/SettingsModal';
import { useConfigStore } from '../../store/config-store';

type RailButtonProps = {
  label: string;
  emphasized?: boolean;
  isPressed?: boolean;
  onClick?: () => void;
};

const RailButton = ({
  label,
  emphasized = false,
  isPressed,
  onClick,
}: RailButtonProps) => {
  const toneClasses = emphasized
    ? 'h-[18px] w-[18px] rounded-[5px] bg-zinc-300 text-[#111111]'
    : 'h-[14px] w-[14px] rounded-[4px] bg-zinc-500/90 text-zinc-900';

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isPressed}
      onClick={onClick}
      className={`flex items-center justify-center transition hover:bg-zinc-400/90 ${toneClasses}`}
    >
      <span className="sr-only">{label}</span>
    </button>
  );
};

type LeftRailProps = {
  appName: string;
  isConversationPanelOpen: boolean;
  isSettingsOpen: boolean;
  onCreateConversation: () => void;
  onToggleConversationPanel: () => void;
  onToggleSettings: () => void;
};

export const LeftRail = ({
  appName,
  isConversationPanelOpen,
  isSettingsOpen,
  onCreateConversation,
  onToggleConversationPanel,
  onToggleSettings,
}: LeftRailProps) => {
  const mode = useConfigStore((state) => state.mode);
  const configStatus = useConfigStore((state) => state.configStatus);
  const isRealModeAvailable = useConfigStore((state) => state.isRealModeAvailable);
  const setMode = useConfigStore((state) => state.setMode);

  return (
    <>
      <aside className="flex w-8 shrink-0 flex-col items-center justify-between bg-[#262626] px-1 py-3">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            aria-label={`${appName} home`}
            className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-zinc-300 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#111111]"
          >
            S
          </button>
          <RailButton label="New chat" onClick={onCreateConversation} />
          <RailButton
            label="Open conversation panel"
            isPressed={isConversationPanelOpen}
            onClick={onToggleConversationPanel}
          />
          <RailButton label="Future workspace action" />
        </div>

        <div className="flex flex-col items-center gap-2.5">
          <RailButton label="Project actions" />
          <RailButton
            label="Settings"
            emphasized
            isPressed={isSettingsOpen}
            onClick={onToggleSettings}
          />
        </div>
      </aside>

      <SettingsModal
        isOpen={isSettingsOpen}
        mode={mode}
        configStatus={configStatus}
        isRealModeAvailable={isRealModeAvailable}
        onModeChange={setMode}
        onClose={onToggleSettings}
      />
    </>
  );
};
