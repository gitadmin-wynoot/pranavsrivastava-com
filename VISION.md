# Vision: Personal AI OS

## What this is

This platform is not a portfolio website. It is a **personal AI operating system** — a living system that learns from the AI ecosystem, proposes ideas, builds small experiments, publishes them, and improves over time.

The public face is pranavsrivastava.com. The engine underneath is a network of agents, MCP servers, and structured knowledge that runs locally and eventually in the cloud.

---

## The core loop

Every part of this system serves one loop:

```
Discover → Understand → Propose → Build → Test → Publish → Observe → Improve
```

**Discover:** Research agents scan AI releases, papers, tools, GitHub, HN, newsletters.

**Understand:** Agents summarize updates, categorize by topic, assess difficulty and usefulness.

**Propose:** The system generates structured mini-project ideas with difficulty, build time, and demo potential.

**Build:** Selected ideas become repos, live demos, tutorials, or course lessons.

**Test:** Linting, type checking, README, deployment notes.

**Publish:** Goes live at pranavsrivastava.com/projects or as a blog post, course lesson, or standalone subdomain.

**Observe:** Every agent run, model call, tool use, and token spend is logged. Dashboards show what's working.

**Improve:** Each project, post, and course is revisitable. Nothing is "done forever."

---

## The three brands

| Brand | Domain | Purpose |
|-------|--------|---------|
| Pranav Srivastava | pranavsrivastava.com | Personal authority brand. Portfolio, AI Lab, Second Brain, courses, writing, consulting trust. |
| Qubitsy | qubitsy.com | Consulting and R&D studio. AI, cloud, API engineering for clients. |
| Wynoot | wynoot.com | SaaS product for small businesses and creators. Booking, automation, websites. |

The personal domain is the trust layer. Qubitsy is the commercial vehicle. Wynoot is the product.

---

## What the AI OS eventually does

### AI Radar
Monitors the AI ecosystem. Turns AI news and releases into structured ideas that Pranav can act on. Shows what's new, what's buildable, and what's worth turning into a demo or course.

### Second Brain
A structured knowledge graph of ideas, research notes, system designs, learning maps, and build logs. Public curated surface at /second-brain. Private full state in the admin.

### Project Factory
Idea → project brief → repo scaffold → build log → tutorial draft → course lesson → video outline. One experiment becomes many public outputs.

### Course Platform
Step-by-step courses with lessons, images, code, and future video scripts. Initially MDX-based. Eventually with structured progress, assets, and downloadable content.

### Agent Cockpit (private)
A private dashboard showing:
- Agent run history
- Token consumption per model and per provider
- Cost tracking
- Tool call logs
- Approval queues for dangerous actions
- Idea backlog and project status

---

## Technology philosophy

**LLM-independent.** The system never depends on one provider. Today it might use Claude. Tomorrow Gemini. Later a local Llama model. The LLM gateway abstraction (`packages/llm-gateway`) ensures the rest of the system doesn't care.

**Local-first for sensitive work.** MCP servers with file access, shell access, and deployment triggers run locally only. Never exposed to the public internet. Tailscale or Cloudflare Access for remote access if needed.

**Observable by design.** Every model call logs tokens, cost, latency, and tool calls to Langfuse. Nothing runs in the dark.

**Human approval for consequential actions.** Agents cannot deploy, post publicly, or modify production state without explicit human approval. The agent cockpit shows pending approvals.

**Content in git.** Blog posts, courses, and projects are MDX files committed to this repo. Agents write to this repo. Humans review and push. Vercel deploys.

**Incrementally automatable.** The system starts with manual content. Agents are added gradually. Nothing breaks if an agent is down — the site still works from static content.

---

## Phased roadmap

### Phase 1 — Public foundation (now)
- Portfolio website live at pranavsrivastava.com
- Blog, courses, AI Lab, consulting pages
- Seeded with first content pieces
- Deployed via Vercel + GitHub

### Phase 2 — Content engine
- MDX content system fully wired
- Tags, categories, RSS feed, sitemap
- Pranav publishes consistently

### Phase 3 — AI Radar MVP
- Research agent surfaces AI news weekly
- Ideas are structured and stored
- Public AI Radar page shows recent insights
- Mock admin/ideas dashboard

### Phase 4 — LLM gateway + observability
- `packages/llm-gateway` wraps LiteLLM
- Provider config via environment
- Langfuse logging for all agent runs
- Model usage dashboard in admin

### Phase 5 — MCP local tools
- `mcp-ideas` server: read/write idea backlog
- `mcp-files` server: controlled content access
- Connected to Claude Code via stdio
- All MCP activity logged

### Phase 6 — Project factory
- Idea → project brief (structured JSON)
- Brief → repo scaffold (GitHub API)
- Build log → tutorial draft (writer agent)
- Tutorial → course lesson/video outline

### Phase 7 — Full AI OS
- Authenticated admin at /admin
- Postgres for persistent state
- Vector DB (pgvector or Qdrant) for second brain search
- Real-time agent cockpit
- Remote MCP via Cloudflare Access or Tailscale
- Cloud deployment with human approval gate

---

## Security principles (non-negotiable)

- No secrets in git. Ever.
- No public shell or deployment MCP server.
- No production deploys without human approval.
- No broad IAM permissions for agents.
- All agent actions logged with full context.
- All expensive model calls have budget limits.
- Private second brain data never surfaces publicly.
- Local MCP servers only accessible via stdio or private network.
