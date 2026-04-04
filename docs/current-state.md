# Current State

## 1. System Overview

### Tech Stack
- **Desktop/runtime:** Electron + `electron-vite`
- **Frontend:** React 19, TypeScript (strict), Vite
- **Styling:** Tailwind CSS + global CSS
- **State management:** Zustand
- **Testing:** Vitest + React Testing Library; Playwright configured
- **Tooling:** ESLint, Prettier, Husky, pnpm
- **Packaging:** `electron-packager` via `pnpm package`

### Architecture Overview
- **Main process** (`src/main/index.ts`)
  - Owns app lifecycle and `BrowserWindow` creation
  - Loads renderer from `ELECTRON_RENDERER_URL` in dev or `dist-renderer/index.html` in build
- **Preload layer** (`src/preload/index.ts`)
  - Exposes a narrow typed bridge with `contextBridge`
  - API: `getPlatform()` and `getVersions()`
- **Shared contract** (`src/shared/shellbase-api.ts`)
  - Defines renderer-visible types for the preload bridge
- **Renderer** (`src/renderer/src/*`)
  - `App.tsx` reads bridge data and mounts `AppShell`
  - UI shell is componentized under `components/shell`
  - Single Zustand store (`store/app-store.ts`) currently holds static app title
- **Backend/database/auth**
  - None in this codebase (desktop client scaffold only)

### Feature Breakdown
1. **Electron process boundary scaffold**
   - **Where:** `src/main/index.ts`, `src/preload/index.ts`, `src/shared/shellbase-api.ts`
   - **How:** Secure `contextIsolation` + preload bridge; renderer consumes only typed window API.

2. **Desktop shell layout foundation (visual)**
   - **Where:** `src/renderer/src/components/shell/*`, `src/renderer/src/App.tsx`
   - **How:** `AppShell` composes top chrome, left rail, conversation panel slot, workspace frame, status bar, and right rail.

3. **Top draggable chrome (renderer side)**
   - **Where:** `src/renderer/src/components/shell/TopChrome.tsx`
   - **How:** Applies `WebkitAppRegion: 'drag'` to a custom top strip.

4. **Workspace empty-state + composer dock placeholders**
   - **Where:** `WorkspaceFrame.tsx`, `ComposerDock.tsx`, `TopBar.tsx`
   - **How:** Renders static empty-state bars and non-functional composer controls.

5. **Runtime status visibility**
   - **Where:** `StatusBar.tsx`
   - **How:** Displays platform/electron/node values from preload API.

6. **Basic component-level test scaffold**
   - **Where:** `src/renderer/src/App.test.tsx`, `vitest.config.ts`, `src/renderer/src/test/setup.ts`
   - **How:** One RTL test asserts shell foundation elements render.

### Missing / Suspicious Areas
- `BrowserWindow` does not set hidden title bar options required by spec (`titleBarStyle: 'hidden'` style behavior is missing).
- Conversation panel state is hardcoded closed (`const isConversationPanelOpen = false`), so rail button cannot toggle it.
- No conversation domain model (no conversation IDs, selected chat, message history, or send lifecycle).
- No chat service layer (`ChatService`, `MockChatService`, `GatewayChatService`, factory).
- No settings modal, no mode switching (mock vs real), no config readiness UI.
- No AI SDK / AI Gateway dependencies or integration code.
- No `.env.example` for runtime setup.
- `playwright.config.ts` points to `./e2e`, but no `e2e` directory/specs currently exist.

## 2. Feature Status

### Feature Status Table

| Feature | Status | Evidence | Notes |
|---|---|---|---|
| Electron app lifecycle and boot | **Fully implemented** | `src/main/index.ts` | Window boot and lifecycle hooks are in place |
| Secure typed preload bridge | **Fully implemented** | `src/preload/index.ts`, `src/shared/shellbase-api.ts`, `src/renderer/src/types/global.d.ts` | Good boundary discipline |
| Hidden native title bar + custom drag area | **Partially implemented** | `TopChrome.tsx`, `src/main/index.ts` | Drag area exists; hidden native title bar config is missing |
| Left rail / main workspace / right rail layout | **Partially implemented** | `AppShell.tsx`, `LeftRail.tsx`, `RightRail.tsx`, `WorkspaceFrame.tsx` | Visual shell exists, but behavior is placeholder-level |
| Top bar with chat title only | **Fully implemented** | `TopBar.tsx` | Renders centered `New chat` title |
| Bottom-docked composer | **Partially implemented** | `ComposerDock.tsx` | Present visually, no functional input/send flow |
| Empty state | **Partially implemented** | `WorkspaceFrame.tsx` | Visual skeleton only |
| Toggleable conversation panel | **Stubbed / placeholder** | `AppShell.tsx`, `ConversationPanel.tsx`, `LeftRail.tsx` | Component exists; no state wiring or toggle action |
| In-memory multi-conversation support | **Stubbed / placeholder** | Only `store/app-store.ts` exists | No chat store/domain |
| Message thread and plain text rendering | **Stubbed / placeholder** | No chat/message components outside shell placeholders | No user/assistant message rendering |
| Mock chat mode | **Stubbed / placeholder** | No mock service code | Missing core MVP interaction |
| Real AI mode (AI SDK + Gateway) | **Stubbed / placeholder** | No AI service code/deps | Missing entirely |
| Settings modal + config status | **Stubbed / placeholder** | Settings button only in `LeftRail.tsx` | No modal/state |
| Dark mode only | **Fully implemented** | `src/renderer/src/index.css` | `color-scheme: dark` and dark shell styling |
| Unit/component tests | **Partially implemented** | `App.test.tsx` | Single test only; below moderate target |
| E2E smoke tests | **Broken / incomplete** | `playwright.config.ts` with missing `e2e` folder | Config exists without specs |
| Local packaging path | **Partially implemented** | `package.json` script `package` | Script exists; no packaging verification docs |

### Critical Issues
1. No end-to-end chat path exists (cannot send/receive messages).
2. Conversation lifecycle is missing (cannot create/select/switch real chats).
3. Settings/config control surface is absent (cannot safely choose mock vs real mode).
4. Real AI integration is absent (no dependencies, no service, no env contract).
5. Desktop title bar spec is incomplete in `BrowserWindow` configuration.

### Incomplete Features
- Current implementation maps to **Milestone 2 shell visuals + partial Milestone 3 placeholders**.
- Milestones 4–9 in `docs/specs/SPEC.md` are largely unimplemented.

## 3. Gap Analysis

### Intended Product
Shellbase is intended to be a polished desktop-first, chat-first IDE scaffold with:
- clean workspace shell layout
- in-memory multi-conversation chat
- mock mode and real AI mode via AI SDK + AI Gateway
- small settings modal for runtime status
- disciplined architecture for future expansion

### Current State
- The process architecture is clean and correctly separated.
- The shell layout is visually scaffolded.
- Product behavior is mostly non-interactive placeholders.
- Core chat/settings/service/state capabilities are missing.

### Gap Analysis
- **Strong foundation:** Electron boundary design and shell component decomposition are good.
- **Primary gap:** No functional chat domain (state + actions + rendering + services).
- **Primary UX gap:** Rail and composer controls look present but do not perform MVP actions.
- **Operational gap:** No runtime config/env setup and no real-mode implementation.
- **Quality gap:** Test coverage and e2e flows do not yet validate MVP behavior.

### Recommended Simplifications
- Keep current shell components and add behavior incrementally instead of redesigning layout.
- Implement mock mode first through a minimal `ChatService` interface before real integration.
- Introduce only three stores (`ui`, `chat`, `config`) and avoid extra abstraction layers.
- Keep message rendering plain text only, as specified.

## 4. MVP Roadmap

### Priority Task List (ordered)

1. **Implement `ui`, `chat`, `config` stores** — **Done**
   - **What to build:** Split state into deterministic domains (panel/settings state, conversations/messages/send state, mode/config status).
   - **Why it matters:** Unblocks all interactive behavior with clear boundaries.
   - **Files to modify:** `src/renderer/src/store/*` (new store modules), `src/renderer/src/App.tsx`.
   - **Success criteria:** Conversation panel and settings open state are store-driven; chat data model exists.

2. **Wire shell controls to real state/actions**
   - **What to build:** Make `New chat`, `Open conversation panel`, and `Settings` buttons functional.
   - **Why it matters:** Converts static shell into usable workspace navigation.
   - **Files to modify:** `components/shell/LeftRail.tsx`, `AppShell.tsx`, `ConversationPanel.tsx`.
   - **Success criteria:** Panel toggles, new conversation is created, settings can open/close.

3. **Build conversation list + selection flow**
   - **What to build:** Replace placeholder chats with store-backed conversation list and active selection.
   - **Why it matters:** Multi-conversation behavior is core to product intent.
   - **Files to modify:** `ConversationPanel.tsx`, chat store module(s).
   - **Success criteria:** User can create and switch among in-memory conversations.

4. **Implement chat thread + composer interaction (plain text)**
   - **What to build:** Text input, send action, message list, empty state transition.
   - **Why it matters:** Delivers first real user value.
   - **Files to modify:** `WorkspaceFrame.tsx`, `ComposerDock.tsx`, add chat UI components under `components`.
   - **Success criteria:** Sending a message appends user content in the active conversation.

5. **Add chat service abstraction + mock implementation**
   - **What to build:** `ChatService`, `MockChatService`, and `chatServiceFactory`.
   - **Why it matters:** Keeps UI independent from provider details and enables fast MVP completion.
   - **Files to modify:** add `src/renderer/src/services/chat/*`, connect in chat action flow.
   - **Success criteria:** Mock mode returns deterministic assistant reply without provider coupling.

6. **Build minimal settings modal and mode controls**
   - **What to build:** Settings surface for mock/real mode selection and config status.
   - **Why it matters:** Required by v1 scope and safe real-mode gating.
   - **Files to modify:** add settings component(s), `LeftRail.tsx`, config store module.
   - **Success criteria:** Mode can be switched and status is visible without exposing secrets.

7. **Integrate AI SDK + AI Gateway real mode**
   - **What to build:** `GatewayChatService` with one fixed model and non-streaming response.
   - **Why it matters:** Completes v1 functional contract.
   - **Files to modify:** `package.json` deps, service modules, config utilities.
   - **Success criteria:** In real mode with valid env, assistant reply is returned.

8. **Add runtime env scaffolding and guards**
   - **What to build:** `.env.example` and runtime config validation.
   - **Why it matters:** Prevents setup ambiguity and supports settings status UX.
   - **Files to modify:** `.env.example`, config helper(s), docs.
   - **Success criteria:** Missing env does not crash app; UI reports not configured.

9. **Raise tests to moderate MVP coverage**
   - **What to build:** Store tests, service selection tests, shell/chat/settings component tests, e2e smoke specs.
   - **Why it matters:** Stabilizes iteration and prevents regressions.
   - **Files to modify:** `src/renderer/src/**/*.test.ts(x)`, add `e2e/*`, possibly `playwright.config.ts`.
   - **Success criteria:** `test` and `test:e2e` validate mock flow and settings/config behavior.

10. **Finalize desktop shell polish + packaging verification**
   - **What to build:** Add missing hidden title bar window config and validate packaging workflow.
   - **Why it matters:** Aligns with desktop UX spec and v1 delivery criteria.
   - **Files to modify:** `src/main/index.ts`, docs runbook.
   - **Success criteria:** Custom chrome works as intended; local package artifacts are reproducible.

### MVP Definition
The MVP is complete when a user can:
- launch the desktop app
- create and switch in-memory conversations
- send a plain text message and receive a mock reply
- switch to real mode (when configured) and receive a provider reply
- open settings and confirm runtime configuration status

### Suggested Development Order
1. Store split and shell wiring
2. Conversation model and panel interactions
3. Message thread/composer with mock service
4. Settings + runtime status
5. Real AI integration
6. Tests and e2e smoke coverage
7. Desktop chrome completion and packaging verification

## 5. Cleanup Recommendations

### Code Smells
- Interaction-critical values are hardcoded in UI (`isConversationPanelOpen = false`, placeholder chat lists).
- `store/app-store.ts` no longer matches intended domain boundaries.
- Shell controls visually imply functionality that is not wired yet.
- Playwright config exists without corresponding test directory/specs.

### Refactor Suggestions
- Create `ui-store`, `chat-store`, and `config-store` before adding more UI complexity.
- Keep shell components presentational; move behavior into store actions/hooks.
- Add a small `services/chat` boundary now to avoid provider logic leaking into components.

### Safe Improvements
- Add `.env.example` immediately (mode/config keys only, no secret defaults).
- Scaffold `e2e/` with one smoke test after mock flow lands.
- Add explicit `aria-pressed`/state labels for panel and settings toggles once wired.
