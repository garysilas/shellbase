# Current State

## 1. System Overview

### Tech Stack
- Desktop/runtime: Electron 41, `electron-vite`, Node 22+, `corepack pnpm`
- Frontend: React 19, TypeScript 6, Vite 7
- Styling: Tailwind CSS 3, PostCSS, global CSS
- State management: Zustand 5
- Tooling: ESLint 9, Prettier 3, Husky
- Testing: Vitest, React Testing Library, Playwright config
- Packaging: `electron-packager` via `corepack pnpm package`
- Missing from intended stack: AI SDK, AI Gateway, path aliases

### Validation Snapshot
- `corepack pnpm typecheck`: passes
- `corepack pnpm lint`: passes
- `corepack pnpm test`: passes, but only 1 renderer test exists
- `corepack pnpm build`: passes
- `pnpm` is not installed globally in this environment; repo scripts work through `corepack pnpm`

### Architecture Overview
- Main process: [`src/main/index.ts`](/Users/gary/WebstormProjects/shellbase/src/main/index.ts)
  - Owns app lifecycle and `BrowserWindow` creation
  - Loads the Vite dev server in development and built HTML in production
  - Keeps renderer isolated with `contextIsolation: true` and `nodeIntegration: false`
- Preload bridge: [`src/preload/index.ts`](/Users/gary/WebstormProjects/shellbase/src/preload/index.ts)
  - Exposes a narrow typed `window.shellbase` API
  - Current API surface is limited to platform/version metadata
- Shared contract: [`src/shared/shellbase-api.ts`](/Users/gary/WebstormProjects/shellbase/src/shared/shellbase-api.ts)
  - Defines the preload-to-renderer type boundary
- Renderer: [`src/renderer/src/App.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/App.tsx), [`src/renderer/src/components/shell/AppShell.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/AppShell.tsx)
  - Entire product lives in the renderer today
  - UI is split into shell components: top chrome, rails, workspace frame, composer, status bar
  - State is minimal: [`src/renderer/src/store/app-store.ts`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/store/app-store.ts) stores only the app title
- Backend/database/auth
  - None
  - This is currently a desktop UI scaffold, not a full-stack application

### Feature Breakdown
1. Electron shell bootstrap
   - Where: [`src/main/index.ts`](/Users/gary/WebstormProjects/shellbase/src/main/index.ts), [`electron.vite.config.ts`](/Users/gary/WebstormProjects/shellbase/electron.vite.config.ts)
   - How it works: builds separate main, preload, and renderer targets and launches a single `BrowserWindow`
2. Safe preload boundary
   - Where: [`src/preload/index.ts`](/Users/gary/WebstormProjects/shellbase/src/preload/index.ts), [`src/shared/shellbase-api.ts`](/Users/gary/WebstormProjects/shellbase/src/shared/shellbase-api.ts), [`src/renderer/src/types/global.d.ts`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/types/global.d.ts)
   - How it works: renderer gets typed access only to platform/version getters
3. Desktop shell layout
   - Where: [`src/renderer/src/components/shell/AppShell.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/AppShell.tsx) and shell subcomponents
   - How it works: static composition of left rail, optional conversation panel slot, main workspace, right rail, top chrome, and status bar
4. Custom top chrome and desktop feel
   - Where: [`src/renderer/src/components/shell/TopChrome.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/TopChrome.tsx)
   - How it works: applies `WebkitAppRegion` drag styling in the renderer and adjusts for macOS traffic lights
5. Empty workspace and composer placeholder
   - Where: [`src/renderer/src/components/shell/WorkspaceFrame.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/WorkspaceFrame.tsx), [`src/renderer/src/components/shell/ComposerDock.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/ComposerDock.tsx), [`src/renderer/src/components/shell/TopBar.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/TopBar.tsx)
   - How it works: renders a static empty-state surface, a centered “New chat” title, and a non-functional composer dock with a model pill
6. Runtime status display
   - Where: [`src/renderer/src/components/shell/StatusBar.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/StatusBar.tsx)
   - How it works: shows platform, Electron version, and Node version from the preload bridge
7. Tooling and basic quality gates
   - Where: [`package.json`](/Users/gary/WebstormProjects/shellbase/package.json), [`eslint.config.js`](/Users/gary/WebstormProjects/shellbase/eslint.config.js), [`vitest.config.ts`](/Users/gary/WebstormProjects/shellbase/vitest.config.ts), [`playwright.config.ts`](/Users/gary/WebstormProjects/shellbase/playwright.config.ts), [`.husky/pre-commit`](/Users/gary/WebstormProjects/shellbase/.husky/pre-commit)
   - How it works: Husky runs lint and unit tests; Vitest is wired; Playwright is configured but unused

### Missing / Suspicious Areas
- No chat domain exists: no conversations, messages, active conversation, send lifecycle, or assistant responses
- No `uiStore`, `chatStore`, or `configStore`; the code still uses a single trivial app store
- No `ChatService`, `MockChatService`, `GatewayChatService`, or service factory
- No settings modal, mode toggle, or runtime config status UI
- No AI SDK or AI Gateway dependencies in [`package.json`](/Users/gary/WebstormProjects/shellbase/package.json)
- Conversation panel state is hardcoded closed in [`src/renderer/src/components/shell/AppShell.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/AppShell.tsx)
- Left rail and composer controls are visual only; they do not trigger application behavior
- Hidden native title bar is only configured on macOS; Windows/Linux still use the default title bar
- Path aliases are expected by the project brief but are not configured in TypeScript or Vite
- Playwright points to `./e2e`, but no `e2e` directory or specs exist
- No `.env.example` or config bootstrap for future real-mode setup

## 2. Feature Status

### Feature Status Table

| Feature | Status | Evidence | Production impact |
|---|---|---|---|
| Electron boot and window lifecycle | Fully implemented | [`src/main/index.ts`](/Users/gary/WebstormProjects/shellbase/src/main/index.ts) | App launches correctly |
| Typed preload bridge | Fully implemented | [`src/preload/index.ts`](/Users/gary/WebstormProjects/shellbase/src/preload/index.ts), [`src/shared/shellbase-api.ts`](/Users/gary/WebstormProjects/shellbase/src/shared/shellbase-api.ts) | Safe process boundary is in place |
| Custom shell layout | Partially implemented | [`src/renderer/src/components/shell/AppShell.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/AppShell.tsx) | Visual shell works, but most controls are inert |
| Hidden title bar + draggable top area | Partially implemented | [`src/main/index.ts`](/Users/gary/WebstormProjects/shellbase/src/main/index.ts), [`src/renderer/src/components/shell/TopChrome.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/TopChrome.tsx) | Meets intent on macOS only; cross-platform behavior is incomplete |
| Left rail and right rail placeholders | Partially implemented | [`src/renderer/src/components/shell/LeftRail.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/LeftRail.tsx), [`src/renderer/src/components/shell/RightRail.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/RightRail.tsx) | Looks correct, but buttons are not wired |
| Top bar with chat title | Fully implemented | [`src/renderer/src/components/shell/TopBar.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/TopBar.tsx) | Works for the current static shell |
| Empty state workspace | Partially implemented | [`src/renderer/src/components/shell/WorkspaceFrame.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/WorkspaceFrame.tsx) | Placeholder only; no thread or state transitions |
| Composer dock | Stubbed / placeholder | [`src/renderer/src/components/shell/ComposerDock.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/ComposerDock.tsx) | User cannot type or send messages |
| Conversation panel | Stubbed / placeholder | [`src/renderer/src/components/shell/ConversationPanel.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/ConversationPanel.tsx) | Hardcoded off; inaccessible in practice |
| In-memory multi-conversation support | Stubbed / placeholder | [`src/renderer/src/store/app-store.ts`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/store/app-store.ts) | Core MVP workflow missing |
| Plain text thread rendering | Stubbed / placeholder | No thread/message components exist | Core MVP workflow missing |
| Mock chat mode | Stubbed / placeholder | No mock service code anywhere in `src` | Core MVP workflow missing |
| Real AI mode via AI SDK + Gateway | Stubbed / placeholder | Missing deps and service code | Core MVP workflow missing |
| Settings modal + config status | Stubbed / placeholder | Settings button exists only in [`LeftRail.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/LeftRail.tsx) | User cannot inspect or switch runtime mode |
| Dark mode only | Fully implemented | [`src/renderer/src/index.css`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/index.css) | Matches current brief |
| Lint/typecheck/build pipeline | Fully implemented | [`package.json`](/Users/gary/WebstormProjects/shellbase/package.json) | Verified locally with `corepack pnpm` |
| Unit test setup | Partially implemented | [`src/renderer/src/App.test.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/App.test.tsx) | Passes, but far below moderate coverage |
| Playwright e2e coverage | Broken / incomplete | [`playwright.config.ts`](/Users/gary/WebstormProjects/shellbase/playwright.config.ts) with no `e2e` directory | `test:e2e` has no actual product coverage |
| Local packaging path | Partially implemented | [`package.json`](/Users/gary/WebstormProjects/shellbase/package.json) | Script exists; packaging was not re-verified in this audit |

### Critical Issues
1. The app cannot perform its core job: there is no message input, send action, thread rendering, or assistant response path.
2. The conversation system does not exist, so “chat-first IDE scaffold” behavior is absent.
3. Settings and runtime mode control do not exist, so mock vs real mode cannot be configured safely.
4. Real AI integration is missing entirely, including dependencies, env contract, and service isolation.
5. Desktop chrome behavior does not fully match the brief because non-macOS platforms still show the default title bar.

### Incomplete Features
- Current implementation is best described as Milestone 2 complete and Milestone 3 partially visualized.
- Milestones 4 through 9 from [`docs/specs/SPEC.md`](/Users/gary/WebstormProjects/shellbase/docs/specs/SPEC.md) are mostly still ahead of the codebase.
- The shipped experience today is a static shell, not a usable chat product.

## 3. Gap Analysis

### Intended Product
Shellbase is intended to be a desktop-first, chat-first IDE scaffold with:
- a polished Electron shell
- in-memory multi-conversation chat
- plain text message flow
- mock and real AI modes through a service boundary
- a small settings surface for runtime status
- enough test coverage to keep iteration safe

### Current State
- The desktop shell is visually present and the Electron boundary is disciplined.
- The renderer is almost entirely static placeholder UI.
- The app launches, builds, lints, and passes one smoke-style component test.
- The product behaviors that matter for MVP are not implemented.

### Gap Analysis
- Foundation gap: architecture discipline is better than feature completion; the system is structurally safe but functionally shallow.
- Product gap: the core chat loop is missing, which means the current app does not satisfy the project’s primary value proposition.
- State gap: the expected store boundaries and service abstractions are not in place, so there is no clean home for chat or settings behavior.
- Quality gap: automated checks validate only the shell scaffold, not the user journeys described in the spec.
- Platform gap: the custom title bar behavior is not consistently implemented across platforms.

### Recommended Simplifications
- Keep the current shell composition and add behavior into it rather than redesigning the UI.
- Add only the three intended stores: `ui`, `chat`, and `config`.
- Implement mock chat first and use that to drive the message thread, conversation list, and settings flow before touching real AI mode.
- Keep message rendering plain text only and defer all markdown/code formatting work.
- Do not add more placeholder chrome or future-facing panels until the send/receive loop exists.

### Over-Engineered or Unnecessary Parts
- There is very little true over-engineering. The bigger issue is under-implementation.
- The main premature pieces are the Playwright setup without tests, the non-functional placeholder controls, and packaging workflows before the core chat path exists.

## 4. MVP Roadmap

### Priority Task List

1. Define the missing state model [Done]
   - What to build: add `ui`, `chat`, and `config` stores with typed conversation, message, and mode state
   - Why it matters: every missing user-facing feature depends on this foundation
   - Files to modify: replace or retire [`src/renderer/src/store/app-store.ts`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/store/app-store.ts); add `src/renderer/src/store/ui-store.ts`, `chat-store.ts`, `config-store.ts`
   - Success criteria: app state includes panel open/close, settings visibility, active conversation, conversations, messages, and current mode

2. Wire the shell controls to real actions [Done]
   - What to build: make “New chat,” “Open conversation panel,” and “Settings” functional
   - Why it matters: the shell currently suggests behavior that does not exist
   - Files to modify: [`src/renderer/src/components/shell/LeftRail.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/LeftRail.tsx), [`src/renderer/src/components/shell/AppShell.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/AppShell.tsx), [`src/renderer/src/components/shell/ConversationPanel.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/ConversationPanel.tsx)
   - Success criteria: new chat creates a conversation, the panel toggles, and settings can open

3. Build the real conversation panel [Done]
   - What to build: replace placeholder chat names with store-backed conversations and active selection
   - Why it matters: multi-conversation support is part of the stated MVP
   - Files to modify: [`src/renderer/src/components/shell/ConversationPanel.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/ConversationPanel.tsx), chat store files
   - Success criteria: user can create, view, and switch in-memory conversations

4. Implement the thread and composer flow [Done]
   - What to build: text input, send button behavior, plain text message list, empty-state transition
   - Why it matters: this is the first point where the product becomes useful
   - Files to modify: [`src/renderer/src/components/shell/WorkspaceFrame.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/WorkspaceFrame.tsx), [`src/renderer/src/components/shell/ComposerDock.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/ComposerDock.tsx), add `src/renderer/src/components/chat/*`
   - Success criteria: user can type a message, send it, and see it appear in the active conversation

5. Add the service boundary and mock mode
   - What to build: `ChatService`, `MockChatService`, and `chatServiceFactory`
   - Why it matters: this keeps provider logic out of components and unlocks deterministic MVP behavior
   - Files to modify: add `src/renderer/src/services/chat/ChatService.ts`, `MockChatService.ts`, `chatServiceFactory.ts`; wire the send flow through the service layer
   - Success criteria: sending a message in mock mode appends a predictable assistant reply

6. Add the settings modal and config status
   - What to build: a minimal settings surface with mock/real mode selection and config readiness display
   - Why it matters: mode control is in the spec and is required before real integration
   - Files to modify: add `src/renderer/src/components/settings/*`; update [`src/renderer/src/components/shell/LeftRail.tsx`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/components/shell/LeftRail.tsx) and config store files
   - Success criteria: user can open settings, switch mode, and see whether real mode is configured

7. Integrate real AI mode
   - What to build: add AI SDK and AI Gateway dependencies, a non-streaming `GatewayChatService`, and env-backed configuration
   - Why it matters: completes the core product contract without broadening scope
   - Files to modify: [`package.json`](/Users/gary/WebstormProjects/shellbase/package.json), new `src/renderer/src/services/chat/GatewayChatService.ts`, config helpers, docs
   - Success criteria: with valid env vars, real mode returns a response through the service abstraction

8. Raise tests to MVP-safe coverage
   - What to build: store tests, service selection tests, shell interaction tests, composer flow tests, settings tests, one Playwright smoke test
   - Why it matters: current coverage only proves the static scaffold renders
   - Files to modify: add renderer tests under `src/renderer/src`, add `e2e/*`, update [`playwright.config.ts`](/Users/gary/WebstormProjects/shellbase/playwright.config.ts) if needed
   - Success criteria: unit tests cover store/service behavior and one e2e test covers the mock chat happy path

9. Finish desktop polish and packaging verification
   - What to build: make title bar behavior match the brief on non-macOS platforms and verify `corepack pnpm package`
   - Why it matters: closes the gap between “working shell” and “deliverable desktop app”
   - Files to modify: [`src/main/index.ts`](/Users/gary/WebstormProjects/shellbase/src/main/index.ts), packaging notes/docs
   - Success criteria: custom chrome is consistent enough across supported platforms and local package output is documented and repeatable

### MVP Definition
The MVP is usable when a user can launch the desktop app, create and switch in-memory conversations, send a plain text message, receive a mock reply, switch to real mode when configured, and inspect configuration status from settings.

### Suggested Development Order
1. Stores and shell wiring
2. Conversation panel and selection
3. Thread and composer flow
4. Mock service integration
5. Settings and config status
6. Real AI integration
7. Tests and e2e smoke
8. Desktop polish and packaging verification

## 5. Cleanup Recommendations

### Code Smells
- Interaction-critical state is hardcoded in UI components instead of stores
- [`src/renderer/src/store/app-store.ts`](/Users/gary/WebstormProjects/shellbase/src/renderer/src/store/app-store.ts) is too small to match the intended architecture
- Renderer imports use long relative paths because aliases are not configured
- Playwright config exists without any tests to justify the maintenance cost
- Several controls are visually emphasized even though they do nothing

### Refactor Suggestions
- Replace the current single store with `ui`, `chat`, and `config` stores before adding more UI logic
- Keep shell components presentational and move behavior into store actions and chat services
- Add `services/chat` before real integration work so provider details do not leak into components
- Introduce path aliases when the next round of new files lands; do not churn existing imports just for style

### Safe Improvements
- Add `.env.example` with non-secret placeholders and a short setup note
- Add an `e2e` directory with one smoke test as soon as mock chat is functional
- Add accessible pressed/open state on panel and settings toggles once those controls are wired
- Keep the current shell visuals; do not spend time restyling before the chat loop works
