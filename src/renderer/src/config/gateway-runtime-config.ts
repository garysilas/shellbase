const DEFAULT_GATEWAY_BASE_URL = 'https://ai-gateway.vercel.sh/v1';
const DEFAULT_GATEWAY_MODEL = 'openai/gpt-4o-mini';

export type GatewayRuntimeConfig = {
  apiKey: string | null;
  baseURL: string;
  model: string;
  isConfigured: boolean;
};

const getTrimmedValue = (value: string | undefined): string => {
  return value?.trim() ?? '';
};

export const getGatewayRuntimeConfig = (): GatewayRuntimeConfig => {
  const apiKey = getTrimmedValue(import.meta.env.VITE_AI_GATEWAY_API_KEY);
  const baseURL =
    getTrimmedValue(import.meta.env.VITE_AI_GATEWAY_BASE_URL) ||
    DEFAULT_GATEWAY_BASE_URL;
  const model =
    getTrimmedValue(import.meta.env.VITE_AI_GATEWAY_MODEL) ||
    DEFAULT_GATEWAY_MODEL;

  return {
    apiKey: apiKey || null,
    baseURL,
    model,
    isConfigured: apiKey.length > 0,
  };
};
