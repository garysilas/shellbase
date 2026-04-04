const ComposerAction = ({ label }: { label: string }) => {
  return (
    <button
      type="button"
      aria-label={label}
      className="h-[18px] w-[18px] rounded-[5px] bg-zinc-500/90"
    >
      <span className="sr-only">{label}</span>
    </button>
  );
};

export const ComposerDock = () => {
  return (
    <div className="absolute inset-x-0 bottom-7 flex justify-center px-6">
      <section className="w-full max-w-[780px] rounded-[18px] border border-white/[0.05] bg-[#262626] px-4 pb-3 pt-3.5 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <div className="flex min-h-[54px] items-start gap-3">
          <div className="mt-0.5 h-4 w-4 shrink-0 rounded-[5px] bg-zinc-500" />
          <div className="flex flex-col gap-2 pt-0.5" aria-hidden="true">
            <span className="h-2.5 w-[330px] max-w-[55vw] rounded-full bg-white/[0.12]" />
            <span className="h-2.5 w-[260px] max-w-[42vw] rounded-full bg-white/[0.08]" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.16] pt-3">
          <div className="flex items-center gap-2">
            <ComposerAction label="Attach context" />
            <ComposerAction label="Choose prompt tool" />
            <div className="rounded-full bg-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              Model
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ComposerAction label="Conversation options" />
            <button
              type="button"
              aria-label="Send message"
              className="h-[30px] w-[30px] rounded-[10px] bg-zinc-300"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
