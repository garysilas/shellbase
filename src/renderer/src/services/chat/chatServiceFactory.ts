import { getGatewayRuntimeConfig } from '../../config/gateway-runtime-config';
import type { AppMode } from '../../store/config-store';
import type { ChatService } from './ChatService';
import { GatewayChatService } from './GatewayChatService';
import { MockChatService } from './MockChatService';

const mockChatService = new MockChatService();

export const chatServiceFactory = (mode: AppMode): ChatService => {
  if (mode === 'mock') {
    return mockChatService;
  }

  const gatewayConfig = getGatewayRuntimeConfig();

  if (!gatewayConfig.isConfigured || !gatewayConfig.apiKey) {
    throw new Error('Real mode is not configured. Set VITE_AI_GATEWAY_API_KEY.');
  }

  return new GatewayChatService({
    apiKey: gatewayConfig.apiKey,
    baseURL: gatewayConfig.baseURL,
    model: gatewayConfig.model,
  });
};
