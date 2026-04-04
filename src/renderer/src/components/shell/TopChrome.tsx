import type { CSSProperties } from 'react';

type TopChromeProps = {
  appName: string;
};

const leftChips = ['Workspace', 'Desktop'];
const centerChips = ['Dark shell', 'Local session'];

export const TopChrome = ({ appName }: TopChromeProps) => {
  return (
    <div
      className="flex h-8 items-center justify-between border-b border-white/[0.04] bg-[#262626] px-3 text-[11px] text-zinc-400"
      style={{ WebkitAppRegion: 'drag' } as CSSProperties}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-500" />
        </div>
        <div className="rounded-full bg-white/[0.08] px-3 py-1 font-medium tracking-[0.22em] text-zinc-200">
          {appName}
        </div>
        <div className="flex items-center gap-2" aria-hidden="true">
          {leftChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-white/[0.05] px-3 py-1 tracking-[0.18em] text-zinc-500"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden items-center gap-2 md:flex" aria-hidden="true">
        {centerChips.map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-white/[0.05] px-3 py-1 tracking-[0.18em] text-zinc-500"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="h-3 w-3 rounded-sm bg-[#6E787E2E]" />
        <span className="h-3 w-3 rounded-sm bg-[#6E787E29]" />
        <span className="h-3 w-3 rounded-sm bg-[#6E787E24]" />
      </div>
    </div>
  );
};
