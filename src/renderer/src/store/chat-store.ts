import { create } from 'zustand';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ConversationContextMessage = Pick<ChatMessage, 'role' | 'content'>;

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type SendState = {
  status: 'idle' | 'sending' | 'error';
  errorMessage: string | null;
};

export type ChatStore = {
  conversations: Conversation[];
  selectedConversationId: string;
  messagesByConversation: Record<string, ChatMessage[]>;
  sendState: SendState;
  createConversation: (title?: string) => string;
  selectConversation: (conversationId: string) => void;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  setConversationTitle: (conversationId: string, title: string) => void;
  setSendState: (next: SendState) => void;
  resetSendState: () => void;
};

const DEFAULT_CONVERSATION_TITLE = 'New chat';

const createTimestamp = () => new Date().toISOString();

const createUpdatedTimestamp = (previousUpdatedAt: string) => {
  const nextTimestamp = createTimestamp();

  if (nextTimestamp > previousUpdatedAt) {
    return nextTimestamp;
  }

  return new Date(Date.parse(previousUpdatedAt) + 1).toISOString();
};

const createConversation = (title = DEFAULT_CONVERSATION_TITLE): Conversation => {
  const timestamp = createTimestamp();

  return {
    id: crypto.randomUUID(),
    title,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const createInitialSendState = (): SendState => ({
  status: 'idle',
  errorMessage: null,
});

export const toConversationContext = (
  messages: ChatMessage[],
): ConversationContextMessage[] => {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
};

export const createInitialChatState = (): Pick<
  ChatStore,
  'conversations' | 'selectedConversationId' | 'messagesByConversation' | 'sendState'
> => {
  const initialConversation = createConversation();

  return {
    conversations: [initialConversation],
    selectedConversationId: initialConversation.id,
    messagesByConversation: {
      [initialConversation.id]: [],
    },
    sendState: createInitialSendState(),
  };
};

export const useChatStore = create<ChatStore>((set) => ({
  ...createInitialChatState(),
  createConversation: (title = DEFAULT_CONVERSATION_TITLE) => {
    const conversation = createConversation(title);

    set((state) => ({
      conversations: [...state.conversations, conversation],
      selectedConversationId: conversation.id,
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversation.id]: [],
      },
    }));

    return conversation.id;
  },
  selectConversation: (conversationId) =>
    set((state) => {
      const conversationExists = state.conversations.some(
        (conversation) => conversation.id === conversationId,
      );

      if (!conversationExists) {
        return state;
      }

      return {
        selectedConversationId: conversationId,
      };
    }),
  appendMessage: (conversationId, message) =>
    set((state) => {
      const existingMessages = state.messagesByConversation[conversationId];

      if (!existingMessages) {
        return state;
      }

      const targetConversation = state.conversations.find(
        (conversation) => conversation.id === conversationId,
      );

      if (!targetConversation) {
        return state;
      }

      const updatedAt = createUpdatedTimestamp(targetConversation.updatedAt);

      return {
        conversations: state.conversations.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, updatedAt }
            : conversation,
        ),
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: [...existingMessages, message],
        },
      };
    }),
  setConversationTitle: (conversationId, title) =>
    set((state) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        return state;
      }

      let didUpdate = false;

      const conversations = state.conversations.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        didUpdate = true;

        return {
          ...conversation,
          title: trimmedTitle,
          updatedAt: createUpdatedTimestamp(conversation.updatedAt),
        };
      });

      if (!didUpdate) {
        return state;
      }

      return { conversations };
    }),
  setSendState: (next) => set({ sendState: next }),
  resetSendState: () => set({ sendState: createInitialSendState() }),
}));
