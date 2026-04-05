const emptyStateWidths = ['w-[190px]', 'w-[150px]', 'w-[170px]', 'w-[210px]'];

export const EmptyThreadState = () => {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-6">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex flex-col items-center gap-3" aria-hidden="true">
          {emptyStateWidths.map((widthClass) => (
            <span key={widthClass} className={`h-2 rounded-full bg-zinc-600/80 ${widthClass}`} />
          ))}
        </div>
        <p className="text-[13px] font-medium text-zinc-200">Start a conversation</p>
        <p className="text-[12px] text-zinc-400">Send a message below to get a reply.</p>
      </div>
    </div>
  );
};
