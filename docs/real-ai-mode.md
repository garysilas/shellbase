# Real AI Mode Setup

Shellbase real mode reads configuration from renderer-safe environment variables.

## Required
- `VITE_AI_GATEWAY_API_KEY`

## Optional
- `VITE_AI_GATEWAY_BASE_URL` (defaults to `https://ai-gateway.vercel.sh/v1`)
- `VITE_AI_GATEWAY_MODEL` (defaults to `openai/gpt-4o-mini`)

Copy `.env.example` to `.env`, set your values, then run `corepack pnpm dev`.
