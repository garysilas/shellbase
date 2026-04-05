interface ImportMetaEnv {
  readonly VITE_AI_GATEWAY_API_KEY?: string;
  readonly VITE_AI_GATEWAY_BASE_URL?: string;
  readonly VITE_AI_GATEWAY_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
