const placeholderActions = [
  'Inspector',
  'Symbols',
  'Changes',
  'Diagnostics',
  'Extensions',
];

export const RightRail = () => {
  return (
    <aside className="flex w-8 shrink-0 flex-col items-center gap-3 bg-[#262626] px-1 pt-12">
      {placeholderActions.map((action, index) => {
        const emphasized = index === 1;

        return (
          <button
            key={action}
            type="button"
            aria-label={action}
            className={
              emphasized
                ? 'h-[18px] w-[18px] rounded-[5px] bg-zinc-300 text-[#111111]'
                : 'h-[14px] w-[14px] rounded-[4px] bg-zinc-500/90 text-zinc-900'
            }
          >
            <span className="sr-only">{action}</span>
          </button>
        );
      })}
    </aside>
  );
};
