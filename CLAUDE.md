# CLAUDE.md — Developer guide for Claude Code

This file tells Claude Code how to work in this repo. Read it before making changes.

## Project identity

This is Pranav Srivastava's personal AI OS, portfolio, AI lab, second brain, and course platform.

The public website is `apps/web` → deployed at pranavsrivastava.com via Vercel.
Agents live in `agents/` and run locally (Python + LangGraph).
MCP servers live in `mcp-servers/` and connect via stdio.

See [VISION.md](./VISION.md) for the full strategic picture.

---

## Development principles

- **Prefer working over clever.** Simple, readable code that runs beats elegant code that doesn't.
- **Do not hardcode one LLM provider.** All AI calls go through `packages/llm-gateway`.
- **Content is files.** Blog posts, courses, and projects are MDX in `apps/web/content/`. No CMS unless truly needed.
- **Never commit secrets.** Use `.env.local` for real keys. Only `.env.example` goes in git.
- **No public shell/tool access.** MCP servers that touch the filesystem or run commands are local-only.
- **Add observability hooks.** Any agent or AI call should log to Langfuse. Use the telemetry helpers.
- **Build for long-term trust, not hype.** This site represents Pranav professionally.
- **TypeScript everywhere in `apps/` and `packages/`.** Python for `agents/` and `mcp-servers/`.

---

## Brand principles

- **pranavsrivastava.com** — personal authority brand, portfolio, lab, writing, courses.
- **Qubitsy** — consulting and R&D studio. Referenced from /consulting and /companies.
- **Wynoot** — SaaS product brand. Referenced from /companies.
- Keep all three connected but clearly distinct. Do not mix their identities.

---

## Tone for copy and content

- Practical, thoughtful, humble, builder-oriented.
- "I am exploring...", "I built this to...", "Here is what I learned..."
- Avoid: "world-class", "revolutionary", "cutting-edge AI ecosystem", "10x"
- The reader should feel: this person knows what they are doing and explains it clearly.

---

## Commands

```bash
# Install all dependencies
pnpm install

# Run the website in dev mode
pnpm dev                    # runs all apps via turbo
cd apps/web && pnpm dev     # run only the website

# Build
pnpm build

# Lint
pnpm lint

# Type check
pnpm typecheck
```

---

## File locations

| What | Where |
|------|-------|
| Website source | `apps/web/src/` |
| Website content (MDX) | `apps/web/content/` |
| Shared TypeScript types | `packages/shared-types/` |
| LLM gateway | `packages/llm-gateway/` |
| Python agents | `agents/` |
| MCP servers | `mcp-servers/` |
| Local Docker stack | `infra/docker/docker-compose.yml` |
| Architecture docs | `docs/architecture/` |
| Security rules | `docs/security/` |

---

## Safety rules for agents and tools

- Agent actions that deploy, post publicly, or modify production require human approval.
- MCP servers with shell access run locally only, never over public HTTP.
- All agent runs log to Langfuse with: agent name, model, tokens, cost, tool calls, status.
- Budget limits must be set before any long-running agent task.
- IAM roles for agents must use least privilege.

---

## Course content style — LMS format

Courses must follow an LMS (Learning Management System) style, not blog style. Every chapter must be structured and scannable. Use the JSX components registered in `courseComponents` in `apps/web/src/components/mdx/course-components.tsx`.

### Chapter structure (every chapter must have all five)

```mdx
<ChapterHeader number={N} title="Chapter Title" time={minutes} />

<LearningObjectives>
- Bullet 1 — specific, measurable
- Bullet 2
</LearningObjectives>

[Chapter content — prose, code, callouts, diagrams]

<ChapterSummary>
- Key point 1
- Key point 2
</ChapterSummary>

<Checkpoint>
1. Question testing comprehension?
2. Question requiring application?
</Checkpoint>
```

### Available components

| Component | Use for |
|---|---|
| `<ChapterHeader number={N} title="..." time={N} />` | Chapter heading with number and time estimate |
| `<LearningObjectives>` | What learner will achieve — bullet list children |
| `<Callout type="tip|info|warning|important|note">` | Highlighted callout boxes |
| `<Diagram title="..." caption="...">` | Replaces images — use ASCII art in `{...}` template literal |
| `<ChapterSummary>` | End-of-chapter bullet summary |
| `<Checkpoint>` | 2-3 comprehension questions as ordered list |
| `<KeyTerm definition="...">term</KeyTerm>` | Inline highlighted key terms |
| `<CodeFile filename="server.py">` | Code block with filename label |
| `<Steps>` / `<Step number={N} title="...">` | Numbered procedure steps with connector line |

### Diagram convention — never use broken image paths

Do not use `![alt text](/images/path.png)`. Always use `<Diagram>` with ASCII art:

```mdx
<Diagram title="Architecture Overview" caption="Optional caption text">
{`
  ┌──────────┐     protocol     ┌──────────┐
  │  Client  │────────────────►│  Server  │
  └──────────┘                  └──────────┘`}
</Diagram>
```

Use box-drawing characters: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ╌ ╍` and arrows `→ ← ↑ ↓ ▼ ▲ ►`.

### Tone for course content

- Explain the "why" before the "how" — context before code
- Use tables for comparisons (when to use X vs Y)
- Name things correctly on first use, avoid jargon without definition
- Code examples must run as-is (no placeholder `...` that breaks copy-paste)
- Every chapter stands alone — a reader should be able to jump to Chapter 5

---

## Content writing conventions

MDX frontmatter for blog posts:

```yaml
---
title: "Post title"
slug: "post-slug"
summary: "One sentence summary."
category: "AI Systems | Cloud | APIs | Builder Notes | Product"
tags: ["tag1", "tag2"]
published: true
publishedAt: "2026-06-14"
---
```

MDX frontmatter for courses:

```yaml
---
title: "Course title"
slug: "course-slug"
summary: "What students will learn."
level: "Beginner | Intermediate | Advanced"
status: "draft | published"
tags: ["tag1", "tag2"]
---
```

MDX frontmatter for projects:

```yaml
---
title: "Project title"
slug: "project-slug"
summary: "One line on what it does."
status: "idea | building | live | archived"
category: "AI Agents | MCP | Cloud | API | Tool"
tags: ["tag1", "tag2"]
liveUrl: ""
githubUrl: ""
featured: false
createdAt: "2026-06-14"
---
```
