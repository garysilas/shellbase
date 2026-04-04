import { create } from 'zustand';

export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
};

export type ChatConversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
};

type AppendChatMessageInput = {
  conversationId: string;
  role: ChatMessageRole;
  content: string;
};

type ChatStore = {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  isSending: boolean;
  nextConversationNumber: number;
  nextMessageNumber: number;
  createConversation: () => string;
  selectConversation: (conversationId: string) => void;
  appendMessage: (input: AppendChatMessageInput) => string | null;
  setSendingState: (isSending: boolean) => void;
};

const createConversationId = (conversationNumber: number) =>
  `conversation-${conversationNumber}`;

const createMessageId = (messageNumber: number) => `message-${messageNumber}`;

const initialConversation: ChatConversation = {
  id: createConversationId(1),
  title: 'New chat',
  messages: [],
};

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [initialConversation],
  activeConversationId: initialConversation.id,
  isSending: false,
  nextConversationNumber: 2,
  nextMessageNumber: 1,
  createConversation: () => {
    const conversationId = createConversationId(get().nextConversationNumber);

    set((state) => ({
      conversations: [
        ...state.conversations,
        {
          id: conversationId,
          title: 'New chat',
          messages: [],
        },
      ],
      activeConversationId: conversationId,
      nextConversationNumber: state.nextConversationNumber + 1,
    }));

    return conversationId;
  },
  selectConversation: (conversationId) =>
    set((state) => {
      const hasConversation = state.conversations.some(
        (conversation) => conversation.id === conversationId,
      );

      if (!hasConversation) {
        return state;
      }

      return {
        activeConversationId: conversationId,
      };
    }),
  appendMessage: ({ conversationId, role, content }) => {
    const { conversations, nextMessageNumber } = get();
    const hasConversation = conversations.some(
      (conversation) => conversation.id === conversationId,
    );

    if (!hasConversation) {
      return null;
    }

    const messageId = createMessageId(nextMessageNumber);

    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                {
                  id: messageId,
                  role,
                  content,
                },
              ],
            }
          : conversation,
      ),
      nextMessageNumber: state.nextMessageNumber + 1,
    }));

    return messageId;
  },
  setSendingState: (isSending) => set({ isSending }),
}));
