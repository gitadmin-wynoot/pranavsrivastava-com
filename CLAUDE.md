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
