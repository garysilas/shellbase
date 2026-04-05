import { useState } from 'react';
import { MessageThread } from '../chat/MessageThread';
import { useChatStore } from '../../store/chat-store';
import { ComposerDock } from './ComposerDock';

const createUserMessage = (content: string) => ({
  id: crypto.randomUUID(),
  role: 'user' as const,
  content,
  createdAt: new Date().toISOString(),
});

export const WorkspaceFrame = () => {
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const messages = useChatStore(
    (state) => state.messagesByConversation[state.selectedConversationId] ?? [],
  );
  const appendMessage = useChatStore((state) => state.appendMessage);
  const [draftMessage, setDraftMessage] = useState('');

  const handleSendMessage = () => {
    const trimmedMessage = draftMessage.trim();

    if (!trimmedMessage) {
      return;
    }

    appendMessage(selectedConversationId, createUserMessage(trimmedMessage));
    setDraftMessage('');
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col rounded-[10px] border-[5px] border-[#262626] bg-[#0d0d0d]">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[5px]">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {messages.length > 0 ? <MessageThread messages={messages} /> : null}
          </div>
          <ComposerDock
            draftMessage={draftMessage}
            onDraftMessageChange={setDraftMessage}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </section>
  );
};
