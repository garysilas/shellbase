import { useChatStore } from '../../store/chat-store';

type ConversationPanelProps = {
  isOpen: boolean;
};

export const ConversationPanel = ({ isOpen }: ConversationPanelProps) => {
  const conversations = useChatStore((state) => state.conversations);
  const selectedConversationId = useChatStore(
    (state) => state.selectedConversationId,
  );
  const selectConversation = useChatStore((state) => state.selectConversation);

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      id="conversation-panel"
      aria-label="Conversation panel"
      className="flex w-[262px] shrink-0 flex-col overflow-hidden rounded-[10px] border-[5px] border-[#262626] bg-[#0d0d0d]"
    >
      <div className="flex h-11 items-center justify-between bg-[#262626] px-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
          Chats
        </p>
        <span
          aria-hidden="true"
          className="h-[10px] w-[10px] rounded-[2px] bg-zinc-500"
        />
      </div>
      <div className="flex flex-col gap-2 px-3 pb-4 pt-4">
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedConversationId;

          return (
            <button
              key={conversation.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectConversation(conversation.id)}
              className={`flex items-center gap-2 rounded-[6px] text-left transition ${
                isSelected
                  ? 'bg-white/[0.05] px-1.5 py-1.5'
                  : 'px-2 py-1 text-zinc-400 hover:bg-white/[0.02]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`shrink-0 rounded-[2px] ${
                  isSelected
                    ? 'h-[10px] w-[10px] bg-zinc-500'
                    : 'ml-[2px] h-2 w-2 bg-zinc-600'
                }`}
              />
              <span
                className={`truncate text-[12px] ${
                  isSelected ? 'font-medium text-zinc-300' : 'text-zinc-400'
                }`}
              >
                {conversation.title}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
