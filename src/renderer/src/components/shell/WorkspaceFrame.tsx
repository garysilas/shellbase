import { useState } from 'react';
import { MessageThread } from '../chat/MessageThread';
import { chatServiceFactory } from '../../services/chat/chatServiceFactory';
import { useChatStore } from '../../store/chat-store';
import { useConfigStore } from '../../store/config-store';
import { ComposerDock } from './ComposerDock';

const createChatMessage = (role: 'user' | 'assistant', content: string) => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString(),
});

export const WorkspaceFrame = () => {
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const messages = useChatStore(
    (state) => state.messagesByConversation[state.selectedConversationId] ?? [],
  );
  const appendMessage = useChatStore((state) => state.appendMessage);
  const sendState = useChatStore((state) => state.sendState);
  const setSendState = useChatStore((state) => state.setSendState);
  const resetSendState = useChatStore((state) => state.resetSendState);
  const mode = useConfigStore((state) => state.mode);
  const [draftMessage, setDraftMessage] = useState('');

  const handleSendMessage = async () => {
    const trimmedMessage = draftMessage.trim();

    if (!trimmedMessage || sendState.status === 'sending') {
      return;
    }

    const conversationId = selectedConversationId;

    appendMessage(conversationId, createChatMessage('user', trimmedMessage));
    setDraftMessage('');

    setSendState({
      status: 'sending',
      errorMessage: null,
    });

    try {
      const chatService = chatServiceFactory(mode);
      const assistantResponse = await chatService.sendMessage({
        conversationId,
        message: trimmedMessage,
      });

      appendMessage(
        conversationId,
        createChatMessage('assistant', assistantResponse.content),
      );
      resetSendState();
    } catch (error) {
      setSendState({
        status: 'error',
        errorMessage:
          error instanceof Error ? error.message : 'Unable to send message',
      });
    }
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
            isSending={sendState.status === 'sending'}
          />
        </div>
      </div>
    </section>
  );
};
