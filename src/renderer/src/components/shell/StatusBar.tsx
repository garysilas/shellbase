export type StatusBarVersions = Readonly<{
  electron: string;
  chrome: string;
  node: string;
}>;

type StatusBarProps = {
  platform: string;
  versions: StatusBarVersions;
};

const StatusPill = ({ label }: { label: string }) => {
  return (
    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-zinc-500">
      {label}
    </span>
  );
};

export const StatusBar = ({ platform, versions }: StatusBarProps) => {
  return (
    <footer className="flex h-10 items-center justify-between border-t border-white/[0.04] bg-[#262626] px-4">
      <div className="flex min-w-0 items-center gap-2">
        <StatusPill label={`${platform} session`} />
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <StatusPill label={`Electron ${versions.electron}`} />
        <StatusPill label={`Node ${versions.node}`} />
      </div>
    </footer>
  );
};
