import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getGatewayRuntimeConfigMock } = vi.hoisted(() => ({
  getGatewayRuntimeConfigMock: vi.fn(),
}));

vi.mock('../../config/gateway-runtime-config', () => ({
  getGatewayRuntimeConfig: getGatewayRuntimeConfigMock,
}));

import { chatServiceFactory } from './chatServiceFactory';
import { GatewayChatService } from './GatewayChatService';
import { MockChatService } from './MockChatService';

describe('chatServiceFactory', () => {
  beforeEach(() => {
    getGatewayRuntimeConfigMock.mockReset();
  });

  it('returns mock chat service in mock mode', () => {
    const service = chatServiceFactory('mock');

    expect(service).toBeInstanceOf(MockChatService);
  });

  it('returns gateway chat service in real mode when configured', () => {
    getGatewayRuntimeConfigMock.mockReturnValue({
      apiKey: 'test-gateway-key',
      baseURL: 'https://ai-gateway.vercel.sh/v1',
      model: 'openai/gpt-4o-mini',
      isConfigured: true,
    });

    const service = chatServiceFactory('real');

    expect(service).toBeInstanceOf(GatewayChatService);
  });

  it('throws when real mode is not configured', () => {
    getGatewayRuntimeConfigMock.mockReturnValue({
      apiKey: null,
      baseURL: 'https://ai-gateway.vercel.sh/v1',
      model: 'openai/gpt-4o-mini',
      isConfigured: false,
    });

    expect(() => chatServiceFactory('real')).toThrow(
      'Real mode is not configured. Set VITE_AI_GATEWAY_API_KEY.',
    );
  });
});
