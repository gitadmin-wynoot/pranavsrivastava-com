# pranav-ai-os

Personal AI OS, portfolio, AI lab, second brain, and course platform for [Pranav Srivastava](https://pranavsrivastava.com).

This is a monorepo. Every part of the platform lives here — the public website, the AI agents that feed it content, the MCP servers that give those agents context, and the shared packages they all use.

---

## What's in this repo

```
pranav-ai-os/
├── apps/
│   └── web/                  # pranavsrivastava.com — Next.js 15, TypeScript, Tailwind
│
├── packages/                 # Shared code (built incrementally)
│   ├── llm-gateway/          # LLM-agnostic abstraction: Claude, Gemini, GPT, Ollama
│   ├── shared-types/         # TypeScript types shared across apps and agents
│   └── ui/                   # Shared UI components (future)
│
├── agents/                   # Python agents (run locally or on a schedule)
│   ├── research-agent/       # Scans AI news, papers, releases — feeds AI Radar
│   ├── writer-agent/         # Drafts blog posts and course outlines from research
│   ├── cloud-agent/          # Monitors cloud/AWS updates
│   └── coding-agent/         # Scaffolds mini-project repos from ideas
│
├── mcp-servers/              # MCP servers (run locally via stdio)
│   ├── mcp-ideas/            # Tool: read/write idea backlog
│   ├── mcp-files/            # Tool: controlled access to content folder
│   └── mcp-observability/    # Tool: query agent run history and costs
│
├── infra/
│   └── docker/               # docker-compose for local stack (LiteLLM + Langfuse)
│
├── docs/
│   ├── architecture/         # System diagrams and design notes
│   ├── decisions/            # Architecture Decision Records (ADRs)
│   ├── runbooks/             # How to run/deploy each part
│   └── security/             # Agent safety rules and access boundaries
│
├── VISION.md                 # Where this platform is headed and why
├── CLAUDE.md                 # Instructions for Claude Code working in this repo
└── .env.example              # Environment variable template (no real secrets here)
```

---

## Running locally

**Prerequisites:** Node 20+, pnpm, Docker Desktop (for the local AI stack)

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env template and fill in your keys
cp .env.example apps/web/.env.local

# 3. Start the website
pnpm dev
# Opens at http://localhost:3000

# 4. (Optional) Start local AI stack — LiteLLM + Langfuse
cd infra/docker && docker compose up -d
```

---

## Deploying the website

The website (`apps/web`) is deployed to Vercel.

- **Automatic:** Push to `main` → Vercel deploys automatically via GitHub integration
- **Manual:** `cd apps/web && pnpm build && vercel deploy --prod`

Set these environment variables in your Vercel project dashboard (not in the repo):
- `NEXT_PUBLIC_SITE_URL`
- Any LLM API keys used by server-side routes

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Website | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Content | MDX + gray-matter (file-based, git-tracked) |
| Agent orchestration | Python, LangGraph |
| LLM gateway | LiteLLM (provider-agnostic: Claude, Gemini, GPT, Ollama) |
| MCP servers | Python MCP SDK |
| Observability | Langfuse (self-hosted via Docker) |
| Monorepo | pnpm workspaces + Turborepo |
| Deployment | Vercel (website) + GitHub Actions (CI) |

---

## Content model

Blog posts, courses, and projects live as MDX files in `apps/web/content/`. Agents can write new files here; they become live on the next git push.

```
apps/web/content/
├── blog/            # .mdx files, one per post
├── courses/         # .mdx files, one per course
└── projects/        # .mdx files, one per project
```

Each MDX file has a YAML frontmatter block with metadata (title, date, tags, status, etc.) and the content body below.

---

## Phases

See [VISION.md](./VISION.md) for the full roadmap. Short version:

1. **Phase 1 (now):** Public website live — portfolio, blog, courses, AI Lab
2. **Phase 2:** MDX content engine, agents writing first drafts
3. **Phase 3:** AI Radar — agents surface AI news as structured ideas
4. **Phase 4:** LLM gateway + Langfuse observability
5. **Phase 5:** Local MCP servers connected to Claude Code
6. **Phase 6:** Project factory — idea → repo → tutorial → course lesson
7. **Phase 7:** Full AI OS cockpit with auth, vector search, persistent state
