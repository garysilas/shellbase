import type { AppMode, ConfigStatus } from '../../store/config-store';

type SettingsModalProps = {
  isOpen: boolean;
  mode: AppMode;
  configStatus: ConfigStatus;
  isRealModeAvailable: boolean;
  onModeChange: (mode: AppMode) => void;
  onClose: () => void;
};

const getConfigStatusLabel = (configStatus: ConfigStatus) => {
  return configStatus === 'configured' ? 'Configured' : 'Not configured';
};

export const SettingsModal = ({
  isOpen,
  mode,
  configStatus,
  isRealModeAvailable,
  onModeChange,
  onClose,
}: SettingsModalProps) => {
  if (!isOpen) {
    return null;
  }

  const isRealModeDisabled = !isRealModeAvailable;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[420px] flex-col gap-5 rounded-[14px] border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <header className="flex items-center justify-between">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.24em] text-zinc-300">
            Settings
          </h2>
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="h-7 w-7 rounded-[8px] bg-white/[0.08] text-zinc-300 transition hover:bg-white/[0.14]"
          />
        </header>

        <section className="flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Mode</p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={mode === 'mock'}
              onClick={() => onModeChange('mock')}
              className={`rounded-[9px] border px-3 py-2 text-[12px] transition ${
                mode === 'mock'
                  ? 'border-zinc-300 bg-zinc-200/10 text-zinc-100'
                  : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.06]'
              }`}
            >
              Mock mode
            </button>
            <button
              type="button"
              aria-pressed={mode === 'real'}
              disabled={isRealModeDisabled}
              onClick={() => {
                if (isRealModeDisabled) {
                  return;
                }

                onModeChange('real');
              }}
              className={`rounded-[9px] border px-3 py-2 text-[12px] transition ${
                mode === 'real'
                  ? 'border-zinc-300 bg-zinc-200/10 text-zinc-100'
                  : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.06]'
              } ${
                isRealModeDisabled
                  ? 'cursor-not-allowed border-white/10 bg-white/[0.02] text-zinc-500 opacity-60 hover:bg-white/[0.02]'
                  : ''
              }`}
            >
              Real mode
            </button>
          </div>
          <p
            role={isRealModeAvailable ? undefined : 'alert'}
            className={`text-[12px] ${
              isRealModeAvailable ? 'text-zinc-400' : 'text-amber-300'
            }`}
          >
            {isRealModeAvailable
              ? 'Real mode available with current environment config.'
              : 'Real mode unavailable. Set VITE_AI_GATEWAY_API_KEY to enable it.'}
          </p>
        </section>

        <section className="flex flex-col gap-2 rounded-[10px] border border-white/10 bg-white/[0.02] p-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Config status
          </p>
          <p className="text-[13px] text-zinc-200">{getConfigStatusLabel(configStatus)}</p>
          <p className="text-[12px] text-zinc-400">
            {isRealModeAvailable ? 'Real mode available' : 'Real mode unavailable'}
          </p>
        </section>
      </section>
    </div>
  );
};
