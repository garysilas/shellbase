export type ChatServiceRequest = {
  conversationId: string;
  message: string;
};

export type ChatServiceResponse = {
  content: string;
};

export interface ChatService {
  sendMessage(request: ChatServiceRequest): Promise<ChatServiceResponse>;
}
