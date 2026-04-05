import type { ChatService, ChatServiceRequest, ChatServiceResponse } from './ChatService';

const createMockResponse = (message: string) => {
  return `Mock response: ${message}`;
};

export class MockChatService implements ChatService {
  sendMessage(request: ChatServiceRequest): Promise<ChatServiceResponse> {
    return Promise.resolve({
      content: createMockResponse(request.message),
    });
  }
}
