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
- `corepack pnpm test`: passes, 4 files / 15 tests
- `corepack pnpm test:e2e`: passes, 1 file / 1 test
- `corepack pnpm package`: passes, writes `dist-packages/Shellbase-darwin-arm64`

### Architecture Overview
- Main process: `src/main/index.ts`
  - Owns app lifecycle and `BrowserWindow` creation
  - Uses a hidden title bar across platforms, with overlay controls on non-macOS
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
   - How it works: mock mode returns deterministic text; real mode calls `generateText` through AI Gateway config and supports conversation message history
8. Settings and runtime config status
   - Where: `src/renderer/src/components/settings/SettingsModal.tsx`, `src/renderer/src/store/config-store.ts`, `src/renderer/src/config/gateway-runtime-config.ts`
   - How it works: shows mode toggles and whether real mode is configured from renderer-safe env vars
9. Tooling and automated checks
   - Where: `package.json`, `eslint.config.js`, `vitest.config.ts`, `playwright.config.ts`, `.husky/pre-commit`
   - How it works: lint, typecheck, unit tests, Playwright Electron smoke coverage, and packaging are wired and currently passing

### Missing / Suspicious Areas
- Send failures are stored in `sendState.errorMessage` but never rendered as inline feedback or toast.
- Conversation titles are never auto-generated from first user input; they remain `New chat` unless another caller sets them.
- `src/renderer/src/components/shell/TopChrome.tsx` includes non-essential chips and branding beyond the spec's title-only top bar intent.
- `src/renderer/src/components/shell/ComposerDock.tsx` uses a fixed-height textarea; auto-resizing multiline behavior is not implemented.
- `src/renderer/src/components/shell/TopBar.tsx` is dead code.
- `setConfigStatus` in `config-store.ts` is effectively redundant in runtime flow and primarily exercised in tests.
- `GatewayChatService.test.ts` only validates prompt mode; the message-history path is not yet covered.

## 2. Feature Status

### Feature Status Table

| Feature | Status | Notes |
|---|---|---|
| Electron app bootstrap | Fully implemented | App launches, builds, and keeps the renderer isolated |
| Narrow preload bridge | Fully implemented | Safe typed `window.shellbase` API is in place |
| Custom desktop shell layout | Fully implemented | Left rail, main workspace, right rail placeholder, and status bar are present |
| Hidden title bar + draggable top area | Fully implemented | Hidden native chrome is configured in main and draggable regions are applied in renderer |
| Conversation panel toggle | Fully implemented | Panel opens from the left rail and supports selection |
| In-memory conversations | Fully implemented | Create/select flows work in state and tests |
| Designed empty-state workspace | Fully implemented | Empty conversations render `EmptyThreadState` in the main surface |
| Plain text message rendering | Fully implemented | User and assistant messages render as plain text only |
| Plain text composer/send loop | Partially implemented | Send flow works, but auto-resizing and user-visible error feedback are still missing |
| Mock chat mode | Fully implemented | Deterministic mock response path is wired and tested |
| Real AI mode | Fully implemented | Gateway mode is guarded by runtime config and supports non-streaming conversation context |
| Settings modal + config status | Fully implemented | Mode switch and config readiness display work |
| Conversation auto-title from first user message | Partially implemented | `setConversationTitle` exists but is never invoked in send flow |
| Toast + inline error handling | Broken | Error state is tracked, but there is no user-visible inline/toast surface |
| Model selector placeholder | Stubbed / placeholder | Visual pill only, no model selection behavior |
| Right rail placeholder | Stubbed / placeholder | Intentional placeholder only |
| Unit/integration tests | Partially implemented | Store, service, and shell interaction tests exist (15 tests total) |
| Playwright e2e coverage | Fully implemented | Electron smoke flow exists and `corepack pnpm test:e2e` passes |
| Local production packaging | Fully implemented | `corepack pnpm package` succeeds locally |

### Critical Issues
- Real mode failures (network/provider/config edge cases) are silent in the UI because `errorMessage` is never surfaced.
- Conversation panel usability degrades as sessions accumulate because titles are never auto-derived from user content.
- Top chrome currently exceeds scope intent (title-only bar), adding non-essential UI noise to the shell.

### Incomplete Features
- Conversation auto-title behavior from first user message (specified in `docs/specs/SPEC.md`) is not wired.
- Composer textarea is multiline but not auto-resizing.
- Toast/inline error surfaces defined by spec are still absent.
- Coverage is still light for the real-mode history path and failure UX flows.

## 3. Gap Analysis

### Intended Product
The intended product is a desktop-first, chat-first IDE scaffold: a polished Electron shell with in-memory multi-conversation chat, a minimal settings surface, mock and real AI modes, and enough quality gates to keep iteration safe.

### Current State
The repo is beyond scaffold phase and currently healthy at a build/runtime level: shell layout is polished, multi-conversation state works in memory, mock and real modes are wired, and local validation commands (`typecheck`, `lint`, `test`, `test:e2e`, `package`) all pass. Remaining gaps are mostly product-completeness and spec-alignment items rather than architectural blockers.

### Gap Analysis
- UX reliability gap: error state is captured but not surfaced, so failed sends do not provide actionable feedback to users.
- Conversation quality gap: chat titles are static defaults, making multi-conversation navigation weaker than intended.
- Spec fidelity gap: top chrome includes extra decorative elements and composer lacks auto-resize behavior.
- Testing depth gap: core flows are covered, but history-based real-mode behavior and error UX are not deeply exercised.

### Recommended Simplifications
- Keep the current three-store structure and existing service boundary. It is already the right size for v1.
- Avoid adding new product surface area; close behavioral gaps in existing flows first.
- Remove dead or redundant primitives (`TopBar`, duplicated config mutation pathways) instead of layering more placeholders.

### Over-Engineered or Unnecessary Parts
- `TopBar.tsx` is dead code.
- `setConfigStatus` and `setRealModeAvailable` overlap in responsibility and can be simplified.
- Duplicated store reset helpers across tests are repetitive and better centralized.
- Decorative chip sets in `TopChrome.tsx` add scope beyond the core shell intent.

## 4. MVP Roadmap

### Priority Task List
1. Surface send failures to users
   - What to build: render inline error text in workspace and add a lightweight toast surface for transient send failures
   - Why it matters: currently, failed real-mode sends appear silent even though error state exists
   - Files to modify: `src/renderer/src/components/shell/WorkspaceFrame.tsx`, `src/renderer/src/store/ui-store.ts`, add `src/renderer/src/components/feedback/*`, `src/renderer/src/App.test.tsx`
   - Success criteria: forcing service failure shows clear inline and/or toast feedback without crashing send flow

2. Auto-title conversations from first user message
   - What to build: update selected conversation title on first successful user message using a trimmed, deterministic title strategy
   - Why it matters: multi-chat navigation is weak when all threads remain `New chat`
   - Files to modify: `src/renderer/src/components/shell/WorkspaceFrame.tsx`, `src/renderer/src/store/chat-store.ts`, `src/renderer/src/components/shell/ConversationPanel.tsx`, `src/renderer/src/App.test.tsx`
   - Success criteria: new thread title updates after first user send and remains stable for subsequent messages

3. Align top chrome with title-only intent
   - What to build: reduce `TopChrome` content to the active chat title and required drag-safe framing only
   - Why it matters: keeps v1 shell visually clean and consistent with product brief
   - Files to modify: `src/renderer/src/components/shell/TopChrome.tsx`, `src/renderer/src/components/shell/AppShell.tsx`, related tests/e2e snapshots if needed
   - Success criteria: top bar presents title-only UI while preserving draggable behavior and window-control safety

4. Add auto-resizing composer behavior
   - What to build: make textarea height grow with content up to a capped max, then scroll internally
   - Why it matters: required by spec and improves chat usability for multi-line prompts
   - Files to modify: `src/renderer/src/components/shell/ComposerDock.tsx`, add/update composer interaction tests
   - Success criteria: composer expands smoothly on multiline input and collapses after send/reset

5. Deepen real-mode service tests for message-history path
   - What to build: add unit tests proving `GatewayChatService` sends `messages` payload when history is provided and keeps prompt fallback behavior
   - Why it matters: current tests only validate prompt branch, leaving conversational branch under-verified
   - Files to modify: `src/renderer/src/services/chat/GatewayChatService.test.ts`
   - Success criteria: test suite asserts both message-history and prompt code paths with deterministic expectations

6. Add second e2e flow for settings/real-mode guard and error feedback
   - What to build: Playwright flow that opens settings, verifies real-mode availability UX, and validates visible error output on forced failure
   - Why it matters: broadens confidence beyond one happy-path mock send
   - Files to modify: `e2e/app-shell.e2e.js` (or split into `e2e/settings.e2e.js`), optional helper in `e2e/`
   - Success criteria: `corepack pnpm test:e2e` covers both mock send and settings/error behavior

7. Simplify config-store API and remove dead shell artifact
   - What to build: collapse redundant config state mutation path(s) and remove or repurpose unused `TopBar.tsx`
   - Why it matters: reduces maintenance overhead and accidental divergence in state semantics
   - Files to modify: `src/renderer/src/store/config-store.ts`, `src/renderer/src/components/shell/TopBar.tsx`, impacted tests
   - Success criteria: one clear runtime config update pathway and no dead shell component files

8. Document release verification checklist
   - What to build: concise docs checklist for local release validation (env setup, test commands, package command, smoke launch)
   - Why it matters: keeps future iterations reproducible and avoids regressions during handoff
   - Files to modify: `docs/current-state.md`, optionally `docs/release-checklist.md`
   - Success criteria: contributor can follow docs to validate a release candidate without tribal knowledge

### MVP Definition
Shellbase is MVP-ready when it launches as a polished desktop shell, supports in-memory multi-conversation chat with mock and real (context-aware) replies, shows user-visible failure feedback, allows reliable settings-mode switching, passes targeted unit/e2e coverage, and packages locally without manual fixes.

### Suggested Development Order
1. Send error feedback
2. Conversation auto-title
3. Top chrome scope alignment
4. Composer auto-resize
5. Real-mode history test depth
6. Second e2e behavior flow
7. Config/dead-code cleanup
8. Release checklist docs

## 5. Cleanup Recommendations

### Code Smells
- Dead component: `TopBar.tsx`
- Placeholder state that is not pulling weight: `modelLabel`
- Redundant config mutation surface: `setConfigStatus` vs `setRealModeAvailable`
- Repeated test-store reset boilerplate across `App.test.tsx` and `state-stores.test.ts`
- Partial test coverage for dual execution branches in `GatewayChatService`

### Refactor Suggestions
- Collapse duplicated test reset helpers into shared test utilities once more store tests are added.
- Remove `TopBar.tsx` if `TopChrome.tsx` remains the single top-surface implementation.
- Simplify `config-store.ts` so runtime availability is driven through one authoritative update path.
- Keep `TopChrome.tsx` focused on shell necessities (title + drag-safe structure), not decorative chips.

### Safe Improvements
- Add targeted tests for `GatewayChatService` message-history inputs and empty-response failures.
- Add one additional Playwright flow for settings/error behavior while keeping total e2e scope small.
- Add a short release checklist document tied to existing scripts (`typecheck`, `lint`, `test`, `test:e2e`, `package`).
