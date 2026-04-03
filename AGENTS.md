# `AGENTS.md`


# Shellbase Agent Instructions

## Mission

Build **Shellbase** as a **desktop-first, chat-first IDE scaffold** using:

- Electron
- Vite
- React
- TypeScript
- Tailwind CSS
- Zustand
- AI SDK
- AI Gateway

V1 is **not** a full coding-agent platform.  
It is a **polished chat shell with a strong layout foundation**.

---

## Core Product Intent

Prioritize:
- visual cleanliness
- shell/layout quality
- extensible structure
- simple, deterministic implementation

Do not prioritize:
- speculative platform features
- deep infrastructure beyond current milestone
- generic boilerplate abstractions
- replacing custom layout with a UI-kit-driven app

---

## Non-Negotiable Scope Rules

### Implement in v1
- Electron desktop shell
- hidden native title bar + custom draggable top area
- left rail
- main workspace
- minimal right rail placeholder
- top bar with chat title only
- bottom-docked composer
- empty state
- in-memory multi-conversation support
- toggleable conversation panel
- mock chat mode
- real AI mode through AI SDK + AI Gateway
- settings modal
- plain text messages only
- dark mode only
- local production packaging
- moderate tests

### Do NOT implement unless explicitly requested
- persistence
- auth
- file explorer
- file editing
- terminal
- tool execution
- markdown rendering
- streaming
- plugin system
- memory UI
- prompt editor
- multi-agent logic
- cloud sync
- advanced settings
- release automation

---

## Required Architectural Boundaries

### Main process
Owns:
- app lifecycle
- BrowserWindow
- window configuration
- future native capabilities

### Preload
Owns:
- narrow typed secure bridge
- minimal renderer exposure

### Renderer
Owns:
- all React UI
- layout
- state
- chat workflow
- settings UI

### Boundary constraints
- renderer must not directly use unsafe Node APIs
- renderer must not directly access Electron main internals
- main must not import renderer logic
- preload must stay narrow and typed

---

## UI Intent

The app should feel like:
- a developer workspace shell
- clean and calm
- spacious
- future-extensible

The app should not feel like:
- a cluttered consumer chatbot
- a dashboard with too many controls
- a generic template

### Layout target
```text
[ Left Rail ][ Main Workspace ][ Right Rail Placeholder ]
```

### UI requirements
- left rail always visible
- conversation panel closed by default
- main workspace visually dominant
- right rail visible as minimal placeholder
- top bar contains chat title only
- settings gear lives near the bottom of the left rail
- composer includes model selector placeholder + send button
- dark mode only

---

## Coding Rules

1. Do not add features outside the current milestone.
2. Prefer simple implementations over clever abstractions.
3. Preserve visual cleanliness.
4. Keep modules small and strongly typed.
5. Avoid introducing persistence, auth, tools, or agent systems unless explicitly requested.
6. Ask for clarification before major architectural changes.
7. Keep placeholders lightweight and non-invasive.
8. Write or update tests only for implemented behavior.
9. Do not replace the custom shell layout with a generic UI-kit layout.

Additional guidance:
- prefer composition over deep prop threading
- keep business logic out of presentational components
- isolate provider/integration concerns behind services
- maintain deterministic structure that another agent can continue

---

## State Management Rules

Use Zustand.

Suggested store boundaries:
- UI state separate from chat domain state
- config state separate from UI state where practical

Expected stores:
- `uiStore`
- `chatStore`
- `configStore`

Do not create excessive stores without need.

---

## Chat Architecture Rules

The renderer must not depend directly on raw provider implementation details.

Use a service abstraction:
- `ChatService`
- `MockChatService`
- `GatewayChatService`
- `chatServiceFactory`

Requirements:
- support mock mode
- support real mode
- non-streaming only in v1
- architecture should permit streaming later without major rewrite

---

## Message Rendering Rules

V1 supports:
- plain text only

Do not implement:
- markdown
- code block rendering
- rich message content
- attachments

---

## Settings Rules

Settings in v1 should be small.

Include:
- mock vs real mode control
- config status display

Do not include:
- secret entry forms
- advanced preferences
- large settings information architecture

Secrets must remain in environment variables only.

---

## Quality Standards

### Tooling
Use:
- ESLint
- Prettier
- TypeScript strict mode
- import ordering
- path aliases
- Husky pre-commit hooks

### Testing
Use:
- Vitest
- React Testing Library
- Playwright

### Coverage level
Moderate.

Focus tests on:
- store behavior
- chat service selection
- shell interactions
- composer flow
- settings visibility/status
- mock chat smoke flow

Do not over-test purely cosmetic details.

---

## Repository Expectations

Use:
- pnpm
- single-package repo

Preserve clear module boundaries.

Suggested top-level structure:
- `src/main`
- `src/preload`
- `src/renderer`
- `tests`

---

## Milestone Execution Order

### Milestone 1
Project scaffold and tooling.

### Milestone 2
Desktop shell foundation.

### Milestone 3
Empty-state workspace and composer.

### Milestone 4
In-memory conversations and panel toggle.

### Milestone 5
Mock chat implementation.

### Milestone 6
Settings modal and config status.

### Milestone 7
Real AI integration via AI SDK + AI Gateway.

### Milestone 8
Tests.

### Milestone 9
Local production packaging.

Do not skip ahead by adding later-stage features early.

---

## Decision Heuristics

When uncertain, choose the option that is:
1. simpler
2. cleaner visually
3. more strongly typed
4. easier to extend later
5. less speculative

If a choice would introduce significant scope expansion, stop and ask for clarification.

---

## Final Output Expectations

The resulting implementation should:
- launch as an Electron desktop app
- present a polished shell
- support in-memory multi-conversation chat
- support mock and real AI modes
- preserve future extensibility
- remain visually restrained
- be safe for continued Codex-driven iteration
