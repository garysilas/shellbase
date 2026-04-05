# Current State

## 1. System Overview

### Tech Stack
- Desktop/runtime: Electron 41, `electron-vite`, Node 22+, `pnpm`
- Renderer: React 19, TypeScript 6, Vite 7
- Styling: Tailwind CSS 3, PostCSS, custom CSS
- State: Zustand
- AI: `ai`, `@ai-sdk/openai`, AI Gateway env config
- Testing/tooling: Vitest, React Testing Library, Playwright config, ESLint, Prettier, Husky
- Packaging: `electron-packager`

### Validation Snapshot
- `corepack pnpm typecheck`: passes
- `corepack pnpm lint`: passes
- `corepack pnpm test`: passes, 4 files / 14 tests
- `corepack pnpm build`: passes
- `corepack pnpm test:e2e`: fails, `No tests found`
- `corepack pnpm package`: fails during packaging, `Failed to locate module "@ai-sdk/provider"` from `@ai-sdk/openai`

### Architecture Overview
- Main process: `src/main/index.ts`
  - Owns app lifecycle and `BrowserWindow` creation
  - Uses a hidden title bar on macOS only
  - Loads the dev server in development and built renderer assets in production
- Preload: `src/preload/index.ts`
  - Exposes a narrow typed `window.shellbase` bridge
  - Current API surface is limited to platform and version metadata
- Shared contract: `src/shared/shellbase-api.ts`
  - Defines the preload-to-renderer API types
- Renderer: `src/renderer/src`
  - Owns the entire product surface
  - Custom shell layout with left rail, optional conversation panel, workspace, status bar, settings modal, and right rail placeholder
  - Uses three Zustand stores:
    - `ui-store.ts` for panel and modal visibility
    - `chat-store.ts` for conversations, messages, and send status
    - `config-store.ts` for mock/real mode and config readiness
- Backend/database/auth
  - None
  - Real AI mode is direct client-side invocation through AI SDK + Gateway config

### Feature Breakdown
1. Electron shell bootstrap
   - Where: `src/main/index.ts`, `electron.vite.config.ts`
   - How it works: builds main, preload, and renderer separately and launches one desktop window
2. Secure preload boundary
   - Where: `src/preload/index.ts`, `src/shared/shellbase-api.ts`, `src/renderer/src/types/global.d.ts`
   - How it works: renderer gets typed access to a minimal safe bridge instead of Node APIs
3. Workspace shell layout
   - Where: `src/renderer/src/components/shell/AppShell.tsx` and shell subcomponents
   - How it works: composes top chrome, left rail, optional conversation panel, workspace frame, status bar, and right rail placeholder
4. In-memory multi-conversation state
   - Where: `src/renderer/src/store/chat-store.ts`, `src/renderer/src/components/shell/ConversationPanel.tsx`
   - How it works: seeds one conversation, supports new conversations, selection, message append, and updated timestamps
5. Plain text message rendering
   - Where: `src/renderer/src/components/chat/MessageThread.tsx`
   - How it works: renders user and assistant messages as simple text bubbles with no markdown or rich content
6. Composer and send flow
   - Where: `src/renderer/src/components/shell/WorkspaceFrame.tsx`, `src/renderer/src/components/shell/ComposerDock.tsx`
   - How it works: accepts plain text input, appends the user message, calls a chat service, then appends the assistant reply or stores an error state
7. Chat service abstraction
   - Where: `src/renderer/src/services/chat/ChatService.ts`, `MockChatService.ts`, `GatewayChatService.ts`, `chatServiceFactory.ts`
   - How it works: mock mode returns deterministic text; real mode calls `generateText` through AI Gateway config
8. Settings and runtime config status
   - Where: `src/renderer/src/components/settings/SettingsModal.tsx`, `src/renderer/src/store/config-store.ts`, `src/renderer/src/config/gateway-runtime-config.ts`
   - How it works: shows mode toggles and whether real mode is configured from renderer-safe env vars
9. Tooling and automated checks
   - Where: `package.json`, `eslint.config.js`, `vitest.config.ts`, `playwright.config.ts`, `.husky/pre-commit`
   - How it works: lint, typecheck, unit tests, and build are wired; Playwright is configured but not yet populated

### Missing / Suspicious Areas
- Real mode is not truly conversational. `GatewayChatService` sends only the latest prompt, not conversation history.
- Packaging is not production-ready. `corepack pnpm package` currently fails on the AI SDK dependency graph.
- E2E coverage is missing. `playwright.config.ts` exists, but `test:e2e` fails because there are no tests.
- The designed empty state exists in `src/renderer/src/components/chat/EmptyThreadState.tsx` but is never rendered.
- `src/renderer/src/components/shell/TopBar.tsx` exists but is unused.
- Hidden native title bar behavior is only implemented on macOS. Windows/Linux still use the default title bar.
- Path aliases required by the repo brief are not configured in TypeScript or Vite.
- `config-store.ts` includes `modelLabel`, but the value is static and not used meaningfully.

## 2. Feature Status

### Feature Status Table

| Feature | Status | Notes |
|---|---|---|
| Electron app bootstrap | Fully implemented | App launches, builds, and keeps the renderer isolated |
| Narrow preload bridge | Fully implemented | Safe typed `window.shellbase` API is in place |
| Custom desktop shell layout | Fully implemented | Left rail, main workspace, right rail placeholder, and status bar are present |
| Hidden title bar + draggable top area | Partially implemented | macOS-focused only; not consistent cross-platform |
| Conversation panel toggle | Fully implemented | Panel opens from the left rail and supports selection |
| In-memory conversations | Fully implemented | Create/select flows work in state and tests |
| Plain text composer/send loop | Fully implemented | User messages and assistant replies render correctly |
| Mock chat mode | Fully implemented | Deterministic mock response path is wired and tested |
| Real AI mode | Partially implemented | Service exists and unit tests pass, but live requests are single-turn and packaging is broken |
| Settings modal + config status | Fully implemented | Mode switch and config readiness display work |
| Empty-state workspace | Partially implemented | Component exists, but the live workspace renders nothing when a thread is empty |
| Model selector placeholder | Stubbed / placeholder | Visual pill only, no model selection behavior |
| Right rail placeholder | Stubbed / placeholder | Intentional placeholder only |
| Unit/integration tests | Partially implemented | Good store/service/UI smoke coverage, but not yet moderate end-to-end coverage |
| Playwright e2e coverage | Broken | `corepack pnpm test:e2e` fails because no specs exist |
| Local production packaging | Broken | `corepack pnpm package` fails on `@ai-sdk/provider` resolution |

### Critical Issues
- Packaging fails today, so the app cannot be shipped as a verified local production bundle.
- Real AI mode does not use prior messages, so multi-turn conversations are only simulated in the UI.
- Playwright is wired in name only; the e2e command fails outright.
- The empty thread path is visually incomplete because the intended empty-state component is unused.

### Incomplete Features
- Cross-platform custom window chrome still needs finishing.
- The model selector is still a placeholder, which is acceptable for v1, but the current `modelLabel` state is effectively dead weight.
- Conversation titles never evolve beyond the default title unless something else calls `setConversationTitle`.
- Send state is global rather than per conversation, which is workable for v1 but brittle if multi-thread activity grows.

## 3. Gap Analysis

### Intended Product
The intended product is a desktop-first, chat-first IDE scaffold: a polished Electron shell with in-memory multi-conversation chat, a minimal settings surface, mock and real AI modes, and enough quality gates to keep iteration safe.

### Current State
The repo is past pure scaffolding. It already has a functioning shell, in-memory conversations, mock replies, a real-mode service path, settings, unit coverage, and a passing production build. The missing pieces are mostly around production hardening, behavioral completeness, and a few spec-alignment gaps rather than wholesale missing architecture.

### Gap Analysis
- Product gap: the app looks like a chat client and behaves like one in mock mode, but real mode is still single-turn rather than true conversation.
- Production gap: packaging and e2e coverage are not ready, which blocks a reliable MVP release.
- Spec gap: the empty state is not actually shown, and cross-platform title bar handling is incomplete.
- Tooling gap: required path aliases are still missing.

### Recommended Simplifications
- Keep the current three-store structure and existing service boundary. It is already the right size for v1.
- Do not add new surface area. Fix packaging, conversation context, empty state, and tests before adding any future-facing shell affordances.
- Remove or wire dead placeholders instead of adding more placeholders.

### Over-Engineered or Unnecessary Parts
- `TopBar.tsx` is dead code.
- `EmptyThreadState.tsx` is dead code until it is actually rendered.
- `config-store.ts` exposes `setConfigStatus` and `modelLabel`, but current UI logic does not need both.
- Playwright configuration exists ahead of any actual test coverage.

## 4. MVP Roadmap

### Priority Task List
1. Fix Electron packaging for real mode [Done]
   - What to build: make `corepack pnpm package` complete successfully with AI SDK dependencies present in the packaged app
   - Why it matters: this is the clearest current production blocker
   - Files to modify: `package.json`, `pnpm-lock.yaml`, `electron.vite.config.ts`
   - Success criteria: `dist-packages` is created successfully and the packaged app launches

2. Make real mode multi-turn instead of single-turn
   - What to build: change the chat service contract to accept conversation history and have `GatewayChatService` send context instead of only the latest prompt
   - Why it matters: without this, “conversation” is only a renderer concept
   - Files to modify: `src/renderer/src/services/chat/ChatService.ts`, `src/renderer/src/services/chat/GatewayChatService.ts`, `src/renderer/src/components/shell/WorkspaceFrame.tsx`, `src/renderer/src/store/chat-store.ts`
   - Success criteria: a second user message can reference earlier context and the service request includes prior messages

3. Restore the intended empty-state experience
   - What to build: render `EmptyThreadState` whenever the selected conversation has no messages
   - Why it matters: this is visible on first launch and currently looks unfinished
   - Files to modify: `src/renderer/src/components/shell/WorkspaceFrame.tsx`, `src/renderer/src/components/chat/EmptyThreadState.tsx`
   - Success criteria: first launch and newly created empty chats show a deliberate empty state

4. Tighten settings and real-mode UX
   - What to build: prevent or clearly guard switching into unusable real mode, and make config status/error behavior more explicit
   - Why it matters: current behavior allows a mode switch that only fails later on send
   - Files to modify: `src/renderer/src/components/settings/SettingsModal.tsx`, `src/renderer/src/store/config-store.ts`, `src/renderer/src/App.test.tsx`
   - Success criteria: real mode cannot be entered silently when unconfigured, or the UI clearly communicates the failure before send

5. Add the first e2e smoke test
   - What to build: one Playwright happy-path test for launching the app shell and sending a mock message
   - Why it matters: the repo already claims Playwright support, but the command currently fails
   - Files to modify: `playwright.config.ts`, add `e2e/*`
   - Success criteria: `corepack pnpm test:e2e` passes locally

6. Finish cross-platform shell polish
   - What to build: align title bar behavior more closely across macOS, Windows, and Linux
   - Why it matters: the current shell only fully matches the brief on macOS
   - Files to modify: `src/main/index.ts`, `src/renderer/src/components/shell/TopChrome.tsx`
   - Success criteria: non-macOS builds no longer fall back to a visibly different default chrome experience

7. Add path aliases and remove brittle relative imports
   - What to build: configure aliases for renderer/shared imports and migrate touched files
   - Why it matters: this is a stated repo expectation and will keep the codebase easier to extend
   - Files to modify: `tsconfig.web.json`, `tsconfig.node.json`, `electron.vite.config.ts`, affected source files
   - Success criteria: new imports no longer require deep relative traversal like `../../../../shared/...`

### MVP Definition
Shellbase is MVP-ready when it can launch as a desktop app, show a polished shell, create and switch in-memory conversations, send plain text messages, receive mock and real replies with conversation context, open settings, pass unit and e2e smoke coverage, and package locally without errors.

### Suggested Development Order
1. Packaging fix
2. Real multi-turn context
3. Empty state + settings hardening
4. E2E smoke coverage
5. Cross-platform polish
6. Path aliases and light cleanup

## 5. Cleanup Recommendations

### Code Smells
- Dead components: `TopBar.tsx`, `EmptyThreadState.tsx`
- Placeholder state that is not pulling weight: `modelLabel`, `setConfigStatus`
- Repeated test-store reset boilerplate across `App.test.tsx` and `state-stores.test.ts`
- Long relative imports between renderer and shared modules

### Refactor Suggestions
- Collapse duplicated test reset helpers into shared test utilities once more store tests are added.
- Either remove `TopBar.tsx` or make it the actual top title surface.
- Either wire `EmptyThreadState.tsx` immediately or remove it until needed.
- Simplify `config-store.ts` so derived config readiness is not tracked in two places unless there is a clear need.

### Safe Improvements
- Add a tiny `e2e` directory with one smoke test and keep the rest of Playwright out of scope.
- Add a small packaging note once the `@ai-sdk/provider` issue is fixed so future contributors can reproduce packaging confidently.
- Auto-title a conversation from the first user message if you want the conversation panel to feel less placeholder-heavy without adding scope.
