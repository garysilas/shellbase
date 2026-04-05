import type { FormEvent } from 'react';

const ComposerAction = ({ label }: { label: string }) => {
  return (
    <button
      type="button"
      aria-label={label}
      disabled
      className="h-[18px] w-[18px] rounded-[5px] bg-zinc-500/90"
    >
      <span className="sr-only">{label}</span>
    </button>
  );
};

type ComposerDockProps = {
  draftMessage: string;
  onDraftMessageChange: (value: string) => void;
  onSendMessage: () => void;
};

export const ComposerDock = ({
  draftMessage,
  onDraftMessageChange,
  onSendMessage,
}: ComposerDockProps) => {
  const isSendDisabled = draftMessage.trim().length === 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSendDisabled) {
      return;
    }

    onSendMessage();
  };

  return (
    <div className="px-6 pb-7">
      <section className="mx-auto w-full max-w-[780px] rounded-[18px] border border-white/[0.05] bg-[#262626] px-4 pb-3 pt-3.5 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <form onSubmit={handleSubmit}>
          <div className="flex min-h-[54px] items-start gap-3">
            <div className="mt-0.5 h-4 w-4 shrink-0 rounded-[5px] bg-zinc-500" />
            <label htmlFor="message-composer" className="sr-only">
              Message composer
            </label>
            <textarea
              id="message-composer"
              value={draftMessage}
              onChange={(event) => onDraftMessageChange(event.target.value)}
              aria-label="Message composer"
              placeholder="Type a message"
              rows={2}
              className="min-h-[54px] flex-1 resize-none bg-transparent text-[13px] leading-6 text-zinc-200 outline-none placeholder:text-zinc-500"
            />
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
                type="submit"
                aria-label="Send message"
                disabled={isSendDisabled}
                className="h-[30px] w-[30px] rounded-[10px] bg-zinc-300 transition disabled:cursor-not-allowed disabled:opacity-40"
              />
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
