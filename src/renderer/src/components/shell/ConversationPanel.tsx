type ConversationPanelProps = {
  isOpen: boolean;
};

const placeholderChats = ['New chat', 'Design review', 'Release notes'];

export const ConversationPanel = ({ isOpen }: ConversationPanelProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <aside
      aria-label="Conversation panel"
      className="hidden w-72 shrink-0 border-r border-white/[0.06] bg-[#1a1a1a] p-4 xl:flex xl:flex-col"
    >
      <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          Conversations
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {placeholderChats.map((chat) => (
            <button
              key={chat}
              type="button"
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-left text-sm text-zinc-300"
            >
              {chat}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
