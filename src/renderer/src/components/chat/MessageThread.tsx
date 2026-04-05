import type { ChatMessage } from '../../store/chat-store';

type MessageThreadProps = {
  messages: ChatMessage[];
};

export const MessageThread = ({ messages }: MessageThreadProps) => {
  return (
    <ol aria-label="Message thread" className="flex flex-col gap-3 px-6 py-6">
      {messages.map((message) => {
        const isUserMessage = message.role === 'user';

        return (
          <li
            key={message.id}
            className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
          >
            <article
              className={`max-w-[min(720px,85%)] rounded-[12px] border px-4 py-3 text-[13px] leading-6 text-zinc-200 ${
                isUserMessage
                  ? 'border-zinc-300/30 bg-zinc-200/10'
                  : 'border-white/10 bg-white/[0.04]'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </article>
          </li>
        );
      })}
    </ol>
  );
};
