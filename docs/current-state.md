# Current State

## 1. System Overview

### Tech Stack
- **Desktop/runtime:** Electron (`electron`, `electron-vite`)
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Testing:** Vitest + React Testing Library + Playwright (config only)
- **Tooling:** ESLint, Prettier, Husky, pnpm

### Architecture Overview
- **Main process** (`src/main/index.ts`)
  - Creates `BrowserWindow`
  - Handles app lifecycle (`whenReady`, `activate`, `window-all-closed`)
  - Loads dev URL or built renderer HTML
- **Preload** (`src/preload/index.ts`)
  - Exposes narrow typed bridge via `contextBridge`
  - API currently includes:
    - `getPlatform()`
    - `getVersions()`
- **Shared types** (`src/shared/shellbase-api.ts`)
  - Defines `ShellbaseApi` and `ShellbaseVersions`
- **Renderer** (`src/renderer/src/*`)
  - Minimal placeholder UI (`App.tsx`)
  - One Zustand store (`store/app-store.ts`) for static app title
  - Global type declaration for `window.shellbase`

### Feature Breakdown (Implemented)
1. **Electron scaffold + process boundaries**
   - **Where:** `src/main/index.ts`, `src/preload/index.ts`, `src/shared/shellbase-api.ts`
   - **How it works:** Main process creates window; preload exposes a small typed API; renderer consumes the API from `window.shellbase`.

2. **Renderer placeholder shell page**
   - **Where:** `src/renderer/src/App.tsx`, `src/renderer/src/main.tsx`, `src/renderer/index.html`
   - **How it works:** App renders a branded scaffold card and runtime/version info from preload.

3. **Basic state setup (Zustand)**
   - **Where:** `src/renderer/src/store/app-store.ts`
   - **How it works:** Store has one `title` field used by `App.tsx`.

4. **Initial test scaffolding**
   - **Where:** `src/renderer/src/App.test.tsx`, `src/renderer/src/test/setup.ts`, `vitest.config.ts`, `playwright.config.ts`
   - **How it works:** One RTL test verifies scaffold heading and mocked platform rendering; Playwright is configured but no e2e specs are present.

### Missing / Suspicious Areas
- Spec-targeted app shell is not implemented yet (left rail, top bar, right placeholder, composer, conversation panel).
- No chat domain model, no multi-conversation behavior, no send flow.
- No `ChatService` abstraction (`MockChatService`, `GatewayChatService`, factory) yet.
- No settings modal, no mock/real mode switching, no runtime config status UI.
- No AI SDK / AI Gateway integration.
- No `.env.example` for required runtime setup.
- Playwright points to `./e2e`, but `e2e` directory/specs do not exist.
- Window config does not yet implement the spec-required hidden native title bar / custom draggable top region.

## 2. Feature Status

### Feature Status Table

| Feature | Status | Evidence | Notes |
|---|---|---|---|
| Electron app boots with process split | **Fully implemented** | `src/main/index.ts`, `src/preload/index.ts` | Solid scaffold foundation |
| Typed preload bridge | **Fully implemented** | `src/shared/shellbase-api.ts`, `src/preload/index.ts`, `src/renderer/src/types/global.d.ts` | Narrow API, secure boundary |
| Placeholder renderer UI | **Fully implemented** | `src/renderer/src/App.tsx` | Only scaffold card, no product UX |
| Zustand setup | **Partially implemented** | `src/renderer/src/store/app-store.ts` | Only static title store |
| Custom desktop shell layout (rails/top bar/composer) | **Stubbed / placeholder** | Absence in `src/renderer/src/*` | Core UX not built |
| In-memory multi-conversation support | **Stubbed / placeholder** | No chat store/messages model | Missing core MVP behavior |
| Conversation panel toggle | **Stubbed / placeholder** | No UI/store implementation | Missing |
| Mock chat mode | **Stubbed / placeholder** | No chat service code | Missing |
| Real AI mode (AI SDK + Gateway) | **Stubbed / placeholder** | No service/integration code | Missing |
| Settings modal + config status | **Stubbed / placeholder** | No settings components/store | Missing |
| Error handling (inline/toast) | **Stubbed / placeholder** | No error UI/state patterns yet | Missing |
| Dark mode only | **Partially implemented** | `src/renderer/src/index.css` | Dark palette present, but full app theme not relevant yet |
| Unit/component testing | **Partially implemented** | `App.test.tsx` only | Coverage is very low vs spec |
| E2E testing | **Broken/incomplete** | `playwright.config.ts` expects `./e2e`; dir missing | `pnpm test:e2e` likely fails/discovers no tests |
| Local packaging | **Partially implemented** | `package.json` `package` script | Script exists; no validation artifacts/docs yet |

### Critical Issues (Production/MVP blockers)
1. No chat workflow exists (cannot send/receive messages).
2. No conversation system exists (cannot create/switch chats).
3. No settings/config mode switch for mock vs real.
4. No AI integration path.
5. Core shell UX (rails/top bar/composer) not implemented.

### Incomplete Features
- Most milestone 2+ capabilities from `docs/specs/SPEC.md` are not yet implemented.
- Current codebase aligns most closely with **Milestone 1 scaffold + partial visual placeholder**.

## 3. Gap Analysis

### Intended Product
A polished desktop-first, chat-first IDE shell with:
- custom workspace layout
- in-memory multi-conversation chat
- mock and real AI modes
- deterministic, typed boundaries for future expansion

### Current State
- Architecture skeleton is clean and correctly separated.
- Product behavior is still a static scaffold page.
- State, services, and feature modules required by MVP are mostly absent.

### Missing Core Features for a Usable MVP
1. Shell layout primitives (left rail, main workspace, right placeholder, top bar, composer dock).
2. Chat domain state (`conversations`, `selectedConversation`, `messages`, send status).
3. Conversation panel + New Chat flow.
4. Message thread rendering + empty state + composer interactions.
5. Chat service abstraction and mock implementation.
6. Settings modal with mode toggle and runtime config status.
7. Real AI service implementation via AI SDK + AI Gateway.
8. Behavior-focused tests for stores, shell interactions, and message flow.

### Over-Engineered or Unnecessary Parts (relative to current maturity)
- No major over-engineering found.
- One misalignment: Playwright configuration exists before any e2e tests; harmless but incomplete.

### Recommended Simplifications
- Follow the spec milestone order strictly; avoid introducing optional abstractions early.
- Keep services/store boundaries minimal but explicit (`ui`, `chat`, `config` + chat service factory).
- Implement mock mode first end-to-end before adding real AI path.

## 4. MVP Roadmap

### MVP Definition
A usable MVP for this repo means:
- Desktop app launches
- User can create/select temporary conversations
- User can send message and receive mock reply
- User can switch to real mode when configured and get a non-streamed assistant reply
- Settings shows mode + config readiness

### Priority Task List (Ordered)

1. **Build shell layout foundation** *(Done)*
   - **What to build:** App shell with left rail, top bar title, main workspace, right rail placeholder, bottom composer dock placeholder.
   - **Why it matters:** Establishes core UX and unlocks all interaction features.
   - **Files to modify:** `src/renderer/src/App.tsx`, new layout components under `src/renderer/src`.
   - **Success criteria:** Layout matches spec structure; conversation panel closed by default; settings entry point present.

2. **Split app state into domain stores**
   - **What to build:** `ui`, `chat`, and `config` Zustand stores.
   - **Why it matters:** Prevents state coupling and supports deterministic feature growth.
   - **Files to modify:** add new store modules under `src/renderer/src/store` (or `stores`), wire into `App.tsx`.
   - **Success criteria:** State slices independently manage UI toggles, conversation/message domain, and runtime mode/config.

3. **Implement conversation model and panel interactions**
   - **What to build:** New Chat creation, conversation selection, panel toggle, in-memory conversation list.
   - **Why it matters:** Core “chat-first” behavior requires multi-conversation flow.
   - **Files to modify:** chat/ui store files, shell/conversation panel components.
   - **Success criteria:** User can create multiple chats and switch among them without persistence.

4. **Implement message thread + composer send flow (mock only first)**
   - **What to build:** Empty state, message list, plain text bubbles, composer with send button and model placeholder.
   - **Why it matters:** Delivers first end-to-end user value.
   - **Files to modify:** chat UI components, chat store actions.
   - **Success criteria:** Sending a message appends user message and then mock assistant response.

5. **Add typed chat service abstraction + mock service**
   - **What to build:** `ChatService`, `MockChatService`, and factory.
   - **Why it matters:** Keeps renderer independent from provider details and prepares real mode.
   - **Files to modify:** new service modules under renderer services area; integrate store send action through service.
   - **Success criteria:** UI/store call only interface/factory; mock mode is default and functional.

6. **Add settings modal + config status**
   - **What to build:** Minimal settings modal with mock/real mode toggle and readiness status display.
   - **Why it matters:** Required by spec and needed to gate real mode safely.
   - **Files to modify:** settings component(s), `config` store, shell controls.
   - **Success criteria:** Settings opens from left rail; mode toggles; status indicates configured/not configured.

7. **Implement real AI path with gateway service**
   - **What to build:** `GatewayChatService` using AI SDK + AI Gateway with single fixed model and non-streaming response.
   - **Why it matters:** Completes functional parity with v1 scope.
   - **Files to modify:** service layer, env/runtime config utilities, settings status logic.
   - **Success criteria:** In real mode with valid env, user receives assistant reply from provider.

8. **Add environment scaffolding and guardrails**
   - **What to build:** `.env.example` and runtime config validation behavior.
   - **Why it matters:** Prevents fragile local setup and supports clear config status UX.
   - **Files to modify:** new `.env.example`, config utility module(s), docs.
   - **Success criteria:** App gracefully reports missing config and does not crash when real mode is unavailable.

9. **Expand tests to moderate MVP coverage**
   - **What to build:** Unit tests for stores + service selection; component tests for shell/chat/settings; e2e smoke for mock flow and settings.
   - **Why it matters:** Ensures stable iteration velocity.
   - **Files to modify:** add tests under renderer and `e2e` directory; keep `playwright.config.ts` testDir valid.
   - **Success criteria:** `pnpm test` and `pnpm test:e2e` run with meaningful MVP checks.

10. **Validate packaging and document local release steps**
   - **What to build:** Confirm `pnpm package` output + short packaging runbook.
   - **Why it matters:** Completes v1 local production expectation.
   - **Files to modify:** docs file(s), optionally package script adjustments only if necessary.
   - **Success criteria:** Packaged app artifacts are generated locally and documented.

### Suggested Development Order
1. Layout foundation
2. Store boundaries
3. Conversation model/panel
4. Composer + thread + mock flow
5. Settings + config status
6. Real AI integration
7. Tests
8. Packaging verification/docs

## 5. Cleanup Recommendations

### Code Smells
- Single monolithic placeholder `App.tsx` will become hard to evolve once features are added.
- Current store naming (`app-store.ts`) does not yet reflect expected domain separation.
- Playwright config references a missing `e2e` directory.

### Refactor Suggestions
- Break `App.tsx` into shell + feature components before adding behavior.
- Rename/restructure stores to explicit domains (`ui`, `chat`, `config`) as features land.
- Introduce a minimal service folder now to avoid retrofitting provider logic into UI later.

### Safe Improvements
- Add `.env.example` immediately, even before real integration.
- Add `e2e` directory scaffold with one smoke spec once mock flow exists.
- Keep preload bridge narrow and typed; add only stable app-level bridge methods when needed.
