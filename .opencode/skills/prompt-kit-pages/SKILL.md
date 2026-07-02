---
name: prompt-kit-pages
description: Use when implementing AI/chat/agent pages or interfaces with prompt-kit, shadcn/ui, Inertia React, React 19, and Tailwind CSS. Trigger on prompt-kit, AI page, chat UI, agent UI, assistant interface, prompt input, streaming response, reasoning panel, tool calls, markdown messages, or file upload UI.
---

# Prompt-Kit Pages

Build production-ready AI interfaces in this Laravel/Inertia React project using prompt-kit and shadcn/ui.

## Project Defaults

- This project uses Laravel 12, Inertia React 2, React 19, Tailwind CSS 4, and shadcn/ui.
- Inertia pages live in `resources/js/Pages` unless the existing routing/bundler convention says otherwise.
- shadcn components are configured by `components.json` and use these aliases:
- `@/components` -> `resources/js/components`
- `@/components/ui` -> `resources/js/components/ui`
- `@/lib/utils` -> `resources/js/lib/utils`
- Tailwind/shadcn CSS is in `resources/css/app.css`.
- Prefer installing prompt-kit components into `resources/js/components/ui` unless the existing project has already established a separate `components/prompt-kit` location.
- Use Inertia `<Link>`, `<Form>`, `router.visit()`, and server-rendered props instead of building standalone client-side routing.
- Keep AI provider calls server-side in Laravel routes/controllers/jobs/actions; the React page should send user input to Laravel and render returned/streamed state.

## Required Preflight

Before editing a page:

- Inspect the target route/page/component and sibling files for conventions.
- Inspect currently installed prompt-kit/shadcn components under `resources/js/components/ui`.
- Confirm dependencies in `package.json` before adding new packages.
- Use Laravel Boost `search-docs` for Inertia, Laravel, Tailwind, or Pest details before changing Laravel ecosystem code.
- If creating or changing API-style mobile endpoints, follow the project's API/Scribe rules; otherwise use web routes and Inertia for the Laravel app.

## Installing Prompt-Kit Components

prompt-kit components are installed individually through the shadcn CLI:

```bash
npx shadcn add "https://prompt-kit.com/c/[COMPONENT].json"
```

Common components:

- `prompt-input` for AI input forms with textarea, submit behavior, actions, and tooltips.
- `chat-container` for intelligent auto-scroll behavior via `use-stick-to-bottom`.
- `scroll-button` for returning to the bottom of a `ChatContainerRoot`; it must live inside the prompt-kit chat container context.
- `message` for conversation rows, avatars, markdown content, and message actions.
- `markdown` for GitHub Flavored Markdown rendering with `react-markdown`, `remark-gfm`, and optimized streaming-message rendering.
- `code-block` for Shiki-highlighted code snippets and markdown code blocks.
- `loader` for AI waiting/typing/loading states; with Tailwind v4, manually verify required keyframes are present in `resources/css/app.css`.
- `prompt-suggestion` for clickable suggested prompts or highlighted suggestions.
- `response-stream` only for simulated/client-controlled progressive text. Do not use it as the primary renderer for real LLM streaming output unless the product explicitly wants client-side fake streaming.
- `reasoning` for collapsible/visible model reasoning traces when the backend intentionally exposes them.
- `file-upload` for multimodal prompt attachments.
- `tool` for agent tool-call/result visualization.
- `source` for citations or retrieved-context references.
- `jsx-preview` only when rendering trusted/generated JSX previews is explicitly part of the feature.

Prefer installing only the components needed for the page. Do not bulk-install prompt-kit.

## Component Selection

For a basic chat page, start with:

- `ChatContainerRoot`
- `ChatContainerContent`
- `ChatContainerScrollAnchor`
- `Message`
- `MessageContent`
- `PromptInput`
- `PromptInputTextarea`
- `PromptInputActions`
- `Button`

Add these only when the interaction needs them:

- `ScrollButton` for long conversations where users may scroll away from the bottom.
- `Markdown` and `CodeBlock` for assistant responses that contain formatted text or code.
- `Loader` for pending assistant turns.
- `PromptSuggestion` for empty states or guided onboarding.
- `Reasoning` for explicit reasoning/transcript displays.
- `Tool` and `Source` for agent workflows with tool calls and citations.
- `FileUpload` for attachments.

## Page Architecture

Use this structure for AI pages:

- Laravel route returns an Inertia page with initial messages, available suggestions, limits, and feature flags.
- React page owns transient input state and optimistic pending UI.
- Server-side Laravel action/controller handles prompt submission and AI/provider integration.
- Long-running generation should be queued or streamed when appropriate; do not block UI on expensive synchronous work.
- Messages should have stable IDs for React keys and markdown memoization.
- Keep derived render state close to the page unless it becomes reusable across multiple AI pages.

## UX Requirements

- Provide a strong empty state: purpose, constraints, and a few useful prompt suggestions.
- Show a clear pending state for the assistant turn.
- Preserve scroll position when the user scrolls up; do not yank the viewport to the bottom unless they are already near the bottom.
- Add retry/copy/regenerate affordances only when backed by real behavior.
- Render markdown safely and consistently; do not inject raw HTML unless explicitly sanitized.
- Keep destructive or externally visible agent actions visibly distinct from normal text generation.
- Support mobile layouts: input remains reachable, messages wrap cleanly, and action bars do not overflow.
- Match the existing site design language before inventing a new visual system.

## React Guidance

- Use React 19 patterns and existing project conventions.
- Do not add `useMemo` or `useCallback` by default; add them only when the existing codebase convention or measured rendering behavior requires it.
- Use stable message IDs and avoid array indexes as keys for message lists.
- Keep controlled prompt input simple; avoid global state unless multiple surfaces need to share conversation state.
- Prefer composition over boolean prop proliferation for reusable chat/message subcomponents.

## Inertia Guidance

- Use `<Form>` for straightforward submissions when the server response updates page props.
- Use `useForm` or `router.post()` when the prompt flow needs optimistic UI, manual reset, cancellation, or partial reload control.
- For large histories, use deferred props, pagination, or lazy loading rather than shipping every message eagerly.
- Add skeleton or graceful empty states for deferred props.

## Tailwind/Shadcn Guidance

- Use the project shadcn tokens (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-card`, etc.).
- Prefer `gap-*` over child margins for layout spacing.
- Use Tailwind v4 utilities only; avoid deprecated opacity/grow/shrink utility forms.
- Preserve dark mode if surrounding pages support it.
- Keep repeated page-specific patterns inline until they are clearly reused; then extract a local component.

## Verification

After implementation:

- Run the smallest relevant frontend verification, typically `npm run build` for new TSX/CSS imports.
- Run `vendor/bin/pint --dirty --format agent` before finalizing any PHP/Laravel changes.
- Add or update Pest feature tests when backend routes, validation, authorization, or persistence change.
- For meaningful UI flows, use browser testing or Playwright to verify desktop and mobile behavior when feasible.

## Reference

- Full prompt-kit LLM reference: `https://www.prompt-kit.com/llms-full.txt`
- Install format: `npx shadcn add "https://prompt-kit.com/c/[COMPONENT].json"`
