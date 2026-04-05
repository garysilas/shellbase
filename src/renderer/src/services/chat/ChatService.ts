export type ChatServiceRequest = {
  conversationId: string;
  message: string;
  messages?: ChatServiceMessage[];
};

export type ChatServiceMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatServiceResponse = {
  content: string;
};

export interface ChatService {
  sendMessage(request: ChatServiceRequest): Promise<ChatServiceResponse>;
}
