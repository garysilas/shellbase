import type { CSSProperties } from 'react';

type TopChromeProps = {
  appName: string;
  platform: string;
  title: string;
};

const leadingChips = ['Desktop'];
const trailingChips = ['Dark shell', 'Local session'];

type AppRegionStyle = CSSProperties & {
  WebkitAppRegion: 'drag' | 'no-drag';
};

const dragRegionStyle: AppRegionStyle = { WebkitAppRegion: 'drag' };
const noDragRegionStyle: AppRegionStyle = { WebkitAppRegion: 'no-drag' };

export const TopChrome = ({ appName, platform, title }: TopChromeProps) => {
  const isMac =
    platform === 'darwin' ||
    /mac/i.test(navigator.platform) ||
    /mac os|macintosh|macintel/i.test(navigator.userAgent);
  const dragStyle = dragRegionStyle;
  const noDragStyle = noDragRegionStyle;
  const chromePaddingClass = isMac ? 'pl-[108px] pr-12' : 'pl-12 pr-[152px]';

  return (
    <div
      className={`flex h-8 items-center justify-between bg-[#262626] text-[11px] text-zinc-400 ${chromePaddingClass}`}
      style={dragStyle}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/[0.08] px-3 py-1 font-medium tracking-[0.22em] text-zinc-200" style={noDragStyle}>
          {appName}
        </div>
        <div className="flex items-center gap-2" aria-hidden="true" style={noDragStyle}>
          <span className="rounded-full bg-zinc-300 px-3 py-1 font-medium tracking-[0.18em] text-[#111111]">
            {title}
          </span>
          {leadingChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-white/[0.05] px-3 py-1 tracking-[0.18em] text-zinc-500"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div
        className="hidden items-center gap-2 md:flex"
        aria-hidden="true"
        style={noDragStyle}
      >
        {trailingChips.map((chip) => (
          <span
            key={chip}
            className="rounded-full bg-white/[0.05] px-3 py-1 tracking-[0.18em] text-zinc-500"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
};
