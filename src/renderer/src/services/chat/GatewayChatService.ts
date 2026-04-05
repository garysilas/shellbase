import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import type { ChatService, ChatServiceRequest, ChatServiceResponse } from './ChatService';

export type GatewayChatServiceConfig = {
  apiKey: string;
  baseURL: string;
  model: string;
};

export class GatewayChatService implements ChatService {
  private readonly openai;

  constructor(private readonly config: GatewayChatServiceConfig) {
    this.openai = createOpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
  }

  async sendMessage(request: ChatServiceRequest): Promise<ChatServiceResponse> {
    const result = await generateText({
      model: this.openai(this.config.model),
      prompt: request.message,
    });

    const content = result.text.trim();

    if (!content) {
      throw new Error('Real mode returned an empty response');
    }

    return { content };
  }
}
