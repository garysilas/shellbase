import { beforeEach, describe, expect, it, vi } from 'vitest';

const { generateTextMock, modelFactoryMock, createOpenAIMock } = vi.hoisted(() => {
  const modelFactory = vi.fn();

  return {
    generateTextMock: vi.fn(),
    modelFactoryMock: modelFactory,
    createOpenAIMock: vi.fn(() => modelFactory),
  };
});

vi.mock('ai', () => ({
  generateText: generateTextMock,
}));

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: createOpenAIMock,
}));

import { GatewayChatService } from './GatewayChatService';

describe('GatewayChatService', () => {
  beforeEach(() => {
    generateTextMock.mockReset();
    modelFactoryMock.mockReset();
    createOpenAIMock.mockClear();
  });

  it('returns normalized assistant content from AI SDK text result', async () => {
    modelFactoryMock.mockReturnValue('gateway-model');
    generateTextMock.mockResolvedValue({
      text: 'Gateway response',
    });

    const service = new GatewayChatService({
      apiKey: 'test-gateway-key',
      baseURL: 'https://ai-gateway.vercel.sh/v1',
      model: 'openai/gpt-4o-mini',
    });

    await expect(
      service.sendMessage({
        conversationId: 'conversation-1',
        message: 'Hello from shellbase',
      }),
    ).resolves.toEqual({ content: 'Gateway response' });

    expect(createOpenAIMock).toHaveBeenCalledWith({
      apiKey: 'test-gateway-key',
      baseURL: 'https://ai-gateway.vercel.sh/v1',
    });
    expect(modelFactoryMock).toHaveBeenCalledWith('openai/gpt-4o-mini');
    expect(generateTextMock).toHaveBeenCalledWith({
      model: 'gateway-model',
      prompt: 'Hello from shellbase',
    });
  });
});
