# Web design system — quick reference

Read this before adding or editing pages in `apps/web/src/app`. It captures the
reusable patterns so new pages stay consistent without re-deriving them. Pair it
with [CLAUDE.md](../CLAUDE.md) (content/frontmatter rules) and the portfolio-voice
memory (tone).

## Page shell

```tsx
<div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">   {/* prose pages: about, research */}
<div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">   {/* wide pages: home, listings */}
```

## Section header

```tsx
<h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Title</h2>
<p className="text-xs text-zinc-400 mb-6">One-line subtitle / framing</p>
```

## Card variants (copy the closest one)

- **Info card** — `p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl`
- **Plain/impact card** — same but `p-5` and no fill (`border` only) for emphasis blocks.
- **Accent callout** — tinted: `p-4 bg-{c}-50 dark:bg-{c}-950/20 border border-{c}-100 dark:border-{c}-900/40 rounded-xl`.
- **Tag pills** — `text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full`.

## Accent-color convention (one color per topic, used site-wide)

| Color | Topic |
|---|---|
| `blue` | Applied AI / deep learning / AI Lab |
| `purple` | Computer vision |
| `amber` | Knowledge representation / Learn |
| `emerald` | Optimization / Blog |
| `rose` | Decentralized / blockchain / family |
| `sky` | Skiing / teaching-courses |
| `orange` | Cloud / AWS |

Icon chip: `w-8 h-8 rounded-lg bg-{c}-100 dark:bg-{c}-950/40 flex items-center justify-center` with a `lucide-react` icon `text-{c}-500`.

## ASCII diagrams (no images)

Never use `<img>`/`![]()`. Use the local `Diagram` helper in
[about/research/page.tsx](../apps/web/src/app/about/research/page.tsx) — a
monospace `<pre>` in a bordered figure. Pass plain ASCII (use `- | + > v ^`,
avoid box-drawing chars inside JSX template literals to keep alignment safe).
For MDX course content use the `<Diagram>` MDX component instead (see CLAUDE.md).

> Note: in `.tsx` pages, ASCII art must be a string child `{`...`}`, not raw JSX,
> or RSC will strip it. The `Diagram` helper already takes `children: string`.

## Timeline pattern

See "The arc" in [about/page.tsx](../apps/web/src/app/about/page.tsx): a relative
container, an absolute vertical line at `left-[38px]`, rows of
`year (w-10, mono) · dot · {title + desc}`.

## Animation

Hero ambient motion lives in [globals.css](../apps/web/src/app/globals.css):
`.hero-aurora` + `.dot-grid-drift`. CSS-only, disabled under
`prefers-reduced-motion`. Keep new motion subtle and CSS-only — avoid JS
animation libraries.

## Labs (the trust engine)

Hands-on, build-this-one-thing tutorials — the work-first centerpiece. Distinct
from Courses (multi-module, deep). Content: single MDX files in
`apps/web/content/labs/`, rendered with `courseComponents` (so `<Steps>`,
`<Step>`, `<CodeFile>`, `<Callout>`, `<Diagram>` all work). Lib: `getLabs()`,
`getLab(slug)`, `isLabAvailable()` in [content.ts](../apps/web/src/lib/content.ts).
Pages: `/labs` (index, Available vs Roadmap) and `/labs/[slug]`. Coming-soon labs
are non-clickable and 404 on direct access — never ship a thin lab page.

Lab frontmatter:

```yaml
---
title: "Build X in 30 minutes"
slug: "build-x"
summary: "One sentence on what they'll build."
outcome: "The concrete thing they walk away having built."
level: "Beginner | Intermediate | Advanced"
durationMin: 30
tools: ["Python", "FastMCP"]
tags: ["MCP", "AI Agents"]
status: "published | draft | coming-soon"   # only "published" is live
updatedAt: "2026-06-23"
---
```

Code in labs must run as-is (no placeholder `...`). Keep them short and
outcome-first; depth belongs in Courses.

## Conventions

- Server components by default; add `"use client"` only when interactivity needs it.
- Always provide dark-mode classes (`dark:`).
- Icons: `lucide-react`. Internal links: `next/link`. External: `<a target="_blank" rel="noopener noreferrer">`.
- Run `pnpm --filter web typecheck` after edits.
