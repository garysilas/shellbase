# `SPEC.md`


# Shellbase Specification

## 1. Project Identity

**Project name:** Shellbase

**Product concept:**  
Shellbase is a **desktop-first, chat-first IDE scaffold**.  
V1 is intentionally narrow: a polished chatbot experience inside a workspace-style shell that can later expand into a coding-agent platform.

**Core framing:**  
Build **a chat shell with a strong layout foundation**.  
Do **not** build a full agent platform in v1.

---

## 2. Product Goals

### Primary goal
Create a clean, extensible Electron desktop app that:
- feels like the root of a larger developer tool
- is visually simple now
- is structurally expandable later
- supports a basic chat workflow with mock and real AI modes

### V1 success criteria
A successful v1 allows the user to:
1. launch the desktop app
2. see a polished workspace shell
3. start a new chat
4. type and send a message
5. see the message appear in the thread
6. receive either a mock or real AI response
7. switch between temporary in-memory conversations
8. open settings and verify runtime configuration status
9. produce a local production build

---

## 3. Target User and Usage Context

### Primary user
- solo builder

### Usage context
- local/private development
- cross-platform from the start
- initially developed inside Codex
- future direction includes coding-agent capabilities and file access, but not in v1

---

## 4. V1 Scope

### Included
- Electron desktop app
- Vite + React + TypeScript + Tailwind CSS
- Zustand state management
- custom shell layout
- hidden native title bar with custom draggable top area
- left rail
- main workspace
- minimal right rail placeholder
- top bar with chat title only
- bottom-docked composer
- designed empty state
- temporary in-memory multi-conversation UI
- conversation panel opened from the left rail
- mock response mode
- real AI mode using AI SDK + AI Gateway
- one fixed model behind the scenes
- model selector placeholder embedded in composer
- settings modal
- toast + inline error handling
- dark mode only
- local production packaging
- moderate test coverage

### Explicitly excluded
- file tree
- code editor
- terminal
- code diff view
- tool execution
- file access implementation
- persistence
- auth
- cloud sync
- markdown rendering
- code block UX
- streaming responses
- agent orchestration
- plugin registry
- memory UI
- prompt editor
- multi-agent features
- advanced settings UI

---

## 5. Product Principles

1. **Do not overbuild.**
2. **Prioritize a clean UI early.**
3. **Make extensibility possible without implementing future systems now.**
4. **Preserve a workspace-like feel instead of a cluttered chat-app feel.**
5. **Keep architecture disciplined from the start.**
6. **Use placeholders intentionally and sparingly.**

---

## 6. Technical Stack

### Core
- Electron
- Vite
- React
- TypeScript
- Tailwind CSS
- Zustand

### UI approach
- mostly custom UI
- selective use of shadcn-style components/primitives
- do not let the UI kit define the app layout or visual identity

### AI
- AI SDK
- AI Gateway

### Testing
- Vitest
- React Testing Library
- Playwright

### Code quality
- ESLint
- Prettier
- TypeScript strict mode
- import ordering conventions
- path aliases
- Husky pre-commit hooks

### Package manager
- pnpm

### Repo shape
- single-package repository

---

## 7. Desktop Architecture

Use a strict Electron process separation.

### Main process
Responsibilities:
- app lifecycle
- BrowserWindow creation
- title bar/window configuration
- future native capability ownership
- future file-system capability ownership

### Preload
Responsibilities:
- narrow secure bridge via `contextBridge`
- typed API surface to renderer
- no broad Node exposure

### Renderer
Responsibilities:
- all React UI
- app shell
- conversation views
- settings UI
- state management
- chat invocation through typed abstractions only

### Process boundary rules
- renderer must not directly access Node APIs
- renderer must not directly depend on Electron main internals
- main must not depend on renderer code
- preload should remain minimal and typed

---

## 8. High-Level UI Layout

### Layout model
```text
[ Left Rail ][ Main Workspace ][ Right Rail Placeholder ]
```

### Behavioral rules
- left rail is always visible
- right rail is visible as a minimal placeholder
- conversation list is not always visible; it opens from the left rail
- main workspace is the visual focus
- settings is accessed from a gear icon in the lower part of the left rail

---

## 9. Window Chrome

Use:
- hidden native title bar
- custom draggable top area

Requirements:
- polished desktop feel
- cross-platform aware
- avoid unsafe draggable region behavior around interactive controls

---

## 10. Detailed UI Specification

### 10.1 Left Rail
Always visible.

Contents:
- app name/logo near top
- New Chat button
- button to open conversation panel
- space for future rail actions
- settings gear button near bottom

Notes:
- this is a narrow rail, not a full conversation sidebar
- it should feel like a persistent navigation spine

### 10.2 Conversation Panel
Opened from the left rail.

Behavior:
- closed by default
- used for conversation list in v1
- temporary/in-memory only
- no persistence
- no rename/delete complexity unless needed later

### 10.3 Main Workspace
Contains:
- top bar
- content surface
- message thread or empty state
- bottom composer dock

### 10.4 Top Bar
V1 contents:
- chat title only

Notes:
- no settings in top bar
- no active model selector in top bar
- keep it minimal

### 10.5 Right Rail
Visible in v1 as a minimal placeholder only.

Purpose:
- preserve workspace balance
- signal future extensibility
- avoid implementing right-side functionality in v1

### 10.6 Empty State
Show before first message in a conversation.

Requirements:
- designed but restrained
- centered branding/title treatment
- short helper text
- optional subtle suggestion chips/placeholders
- should feel spacious and calm

### 10.7 Message Thread
Requirements:
- plain text only
- clear user vs assistant visual distinction
- no markdown rendering
- no code blocks
- no attachments
- no rich content

### 10.8 Composer
Requirements:
- auto-resizing multiline textarea
- model selector placeholder embedded in composer
- send button
- bottom-docked presentation
- clean, uncluttered layout

No support in v1 for:
- file attachments
- tools
- slash commands
- advanced controls

### 10.9 Settings
Opened from gear icon in left rail.

Implementation:
- small modal or compact settings surface

V1 settings content:
- mock vs real mode toggle/control
- AI/environment configuration status
- optional future placeholders only if very lightweight

Must not:
- accept/store secrets in UI
- become a large preferences system

---

## 11. Conversation Model

### V1 behavior
- support multiple conversations
- conversations are temporary/in-memory only
- New Chat creates a new conversation
- one conversation can be selected at a time
- no persistence across app restarts

### Conversation titles
- auto-generate from the first user message
- use a generic fallback if needed

---

## 12. Chat Behavior

### Modes
Support both:
- mock mode
- real AI mode

### Mode control
- configurable through settings/runtime config
- designed to be easy to switch during development

### Response rendering
- render full assistant response when complete
- no token streaming in v1

### Streaming requirement
- do not implement streaming now
- architecture should allow future streaming without major rewrite

---

## 13. AI Integration

### Provider path
Use:
- AI SDK
- AI Gateway

### Model behavior
- one fixed model behind the scenes in v1
- no true multi-model support yet
- model selector UI in composer is placeholder-only

### Integration constraints
- AI provider complexity must be wrapped behind a service layer
- renderer UI should consume normalized chat results
- keep transport/provider details out of presentational components

### Suggested contract shape
```ts
type ChatReply = {
  conversationId: string;
  message: {
    id: string;
    role: 'assistant';
    content: string;
    createdAt: string;
  };
  meta?: {
    model?: string;
    provider?: string;
    mode: 'mock' | 'real';
  };
};
```

---

## 14. State Management

Use Zustand.

### Suggested stores

#### `useUiStore`
Owns:
- conversation panel open/closed
- settings modal open/closed
- active rail state if needed
- toast state

#### `useChatStore`
Owns:
- conversations
- selected conversation id
- messages by conversation
- send/request state
- conversation creation/select behavior

#### `useConfigStore`
Owns:
- current mode (mock vs real)
- config status
- fixed model metadata placeholder
- runtime availability indicators

### State rules
- keep UI state separate from chat domain state
- keep async behavior deterministic
- do not introduce unnecessary global state beyond current needs

---

## 15. Service Architecture

Create a typed chat service abstraction.

### Interface
A service layer should allow the UI to remain unaware of implementation details.

Suggested shape:
- `sendMessage(...)`
- `getMode()`
- future extensibility for streaming support

### Implementations
- `MockChatService`
- `GatewayChatService`

### Selection
- use a config-driven factory or equivalent selection layer

---

## 16. Error Handling

Use:
- toast notifications
- inline error presentation in chat/thread context

Requirements:
- handle missing env configuration gracefully
- handle network/provider failures gracefully
- do not rely on blocking modal errors for normal runtime failures
- avoid silent failures

---

## 17. Secrets and Config

### Secrets handling
Use:
- environment variables only

### Settings UI behavior
Settings may show:
- configured / not configured
- runtime mode
- status indicators

Settings must not:
- allow entering secrets
- persist secrets in app state
- expose secret values in UI

Provide:
- `.env.example`

---

## 18. Theme

V1 theme strategy:
- dark mode only

Requirements:
- developer-tool aesthetic
- strong spacing and hierarchy
- minimal clutter
- consistent shell styling

---

## 19. Repository Structure

Suggested structure:

```text
shellbase/
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ electron.vite.config.ts
├─ tailwind.config.ts
├─ postcss.config.js
├─ eslint.config.js
├─ .prettierrc
├─ .env.example
├─ .husky/
├─ playwright.config.ts
├─ src/
│  ├─ main/
│  │  ├─ index.ts
│  │  ├─ window.ts
│  │  └─ ipc/
│  │     └─ index.ts
│  ├─ preload/
│  │  ├─ index.ts
│  │  └─ api/
│  │     └─ appBridge.ts
│  ├─ renderer/
│  │  ├─ main.tsx
│  │  ├─ App.tsx
│  │  ├─ app/
│  │  │  ├─ providers/
│  │  │  └─ layout/
│  │  ├─ components/
│  │  │  ├─ shell/
│  │  │  │  ├─ AppShell.tsx
│  │  │  │  ├─ LeftRail.tsx
│  │  │  │  ├─ RightRail.tsx
│  │  │  │  ├─ TopBar.tsx
│  │  │  │  ├─ WorkspaceFrame.tsx
│  │  │  │  └─ ConversationPanel.tsx
│  │  │  ├─ chat/
│  │  │  │  ├─ ChatView.tsx
│  │  │  │  ├─ ChatTitle.tsx
│  │  │  │  ├─ MessageList.tsx
│  │  │  │  ├─ MessageBubble.tsx
│  │  │  │  ├─ Composer.tsx
│  │  │  │  └─ EmptyState.tsx
│  │  │  ├─ settings/
│  │  │  │  └─ SettingsModal.tsx
│  │  │  ├─ feedback/
│  │  │  │  ├─ ToastHost.tsx
│  │  │  │  └─ InlineError.tsx
│  │  │  └─ ui/
│  │  ├─ stores/
│  │  │  ├─ uiStore.ts
│  │  │  ├─ chatStore.ts
│  │  │  └─ configStore.ts
│  │  ├─ services/
│  │  │  ├─ chat/
│  │  │  │  ├─ ChatService.ts
│  │  │  │  ├─ MockChatService.ts
│  │  │  │  ├─ GatewayChatService.ts
│  │  │  │  └─ chatServiceFactory.ts
│  │  │  └─ config/
│  │  │     └─ runtimeConfig.ts
│  │  ├─ lib/
│  │  │  ├─ types/
│  │  │  ├─ constants/
│  │  │  ├─ utils/
│  │  │  └─ validators/
│  │  └─ styles/
│  │     └─ globals.css
├─ tests/
│  ├─ unit/
│  ├─ component/
│  └─ e2e/
└─ dist/
```

Module boundary requirements:
- `main` cannot depend on renderer modules
- renderer cannot directly access Node/Electron internals
- shell components must not depend on provider-specific chat logic
- settings UI must show config state, not raw secrets

---

## 20. Coding Standards

### General
- TypeScript strict mode required
- small, focused modules
- explicit types on public interfaces
- avoid unnecessary abstraction
- keep architecture easy for autonomous agents to continue

### UI
- preserve visual cleanliness
- avoid clutter
- use placeholders lightly
- prefer spacing/hierarchy over decoration
- keep shell custom

### Components
- shell/layout first
- presentation separated from business logic
- use shadcn-style primitives selectively only where useful

### Naming
- descriptive, concrete names
- avoid vague abstractions

### Formatting
- ESLint + Prettier enforced
- import ordering enforced
- pre-commit hooks enabled

---

## 21. Testing Strategy

### Coverage target
Moderate coverage.

### Unit tests
Use Vitest for:
- utilities
- runtime config parsing
- chat service selection
- title generation
- Zustand store logic

### Component tests
Use React Testing Library for:
- left rail behavior
- conversation panel toggle
- empty state rendering
- message rendering
- composer interactions
- settings modal state and status display
- inline error behavior

### E2E tests
Use Playwright for smoke flows:

#### Flow 1: mock chat
- launch app
- create/open chat
- type and send a message
- verify mock assistant response appears

#### Flow 2: settings/config
- open settings
- verify status rendering
- verify graceful behavior when real mode is unavailable or not configured

Testing rules:
- focus on behavior, not implementation details
- avoid brittle visual-only tests
- do not over-test styling

---

## 22. Development Workflow

Use milestone-based incremental implementation.

### Milestone 1 — Scaffold
- initialize Electron + Vite + React + TS + Tailwind
- set up pnpm
- configure lint/format/strict TS
- configure Husky
- configure testing skeleton
- establish process boundaries

### Milestone 2 — Shell foundation
- create BrowserWindow
- implement hidden title bar/custom drag region
- build AppShell
- build left rail
- build main workspace
- build right rail placeholder
- build top bar with chat title only
- establish dark theme layout tokens

### Milestone 3 — Empty-state workspace
- build empty state
- build bottom composer dock
- embed model selector placeholder in composer
- add settings gear to left rail

### Milestone 4 — In-memory conversations
- add Zustand stores
- implement New Chat
- implement conversation selection
- implement conversation panel
- auto-title conversations from first user message

### Milestone 5 — Mock chat
- implement mock chat service
- wire send flow
- render messages
- add request/loading/error states

### Milestone 6 — Settings
- implement settings modal
- add mock vs real mode control
- add config status display
- keep secrets out of UI

### Milestone 7 — Real AI integration
- implement GatewayChatService
- integrate AI SDK + AI Gateway
- use one fixed model
- keep non-streaming flow

### Milestone 8 — Tests
- unit tests
- component tests
- Playwright smoke flows

### Milestone 9 — Packaging
- configure local production build
- verify packaged app creation
- document local build/run steps

---

## 23. Build Constraints

The agent must not add the following unless explicitly requested:
- persistence
- authentication
- file system UI
- tool systems
- terminal
- editor panes
- markdown rendering
- streaming
- plugin architecture
- memory systems
- advanced settings
- cloud services

This is a **chat-first scaffold**, not a full platform.

---

## 24. Delivery Expectations

The implementation should produce:
- a clean Electron desktop app
- disciplined module boundaries
- extensible shell structure
- working mock chat flow
- working real AI path via AI SDK + AI Gateway
- test coverage appropriate to v1
- local production packaging support

The final result should be suitable for continued autonomous iteration in Codex.
