# The AI Content Factory

*Last updated: 2026-06-16 — captured from live architecture discussions*

This document records the agreed design for the agent-driven content and learning system inside this monorepo. It is a living document — update it when decisions change.

---

## What this is

This is not just a website. It is a **content factory** powered by a network of AI agents that continuously monitors the world, learns what has changed, and proposes trusted course updates, blog posts, project ideas, and other outputs — all subject to human review before anything is published.

The factory runs on your local machine (WSL2 on your PC) and publishes through GitHub pull requests. You approve. Vercel deploys.

```
World (web, docs, releases, papers)
       │
       ▼
Orchestrator Agent (daily trigger, WSL2)
       │
       ├──► MCP Curriculum Agent       (owns: courses/mcp/)
       ├──► AI Agents Curriculum Agent (owns: courses/ai-agents/)
       ├──► Cloud & APIs Agent         (owns: courses/cloud-apis/)
       └──► (new agents added as new tracks are opened)
                    │
                    ▼
         Draft PR on GitHub
                    │
                    ▼
         You review and approve
                    │
                    ▼
         Vercel deploys → pranavsrivastava.com
```

---

## Core principles

**One agent per domain.** Each specialist agent is a subject matter expert for one course track. It knows its sources, understands its audience, and writes in a consistent voice for that domain.

**Skill files define how, not what.** MCP tools give agents access to files, the web, and code runners. Skill files tell them *how* to use those tools — the tone, the structure, the standards. If output quality is poor, you fix the skill file.

**Human approval is non-negotiable.** Agents produce drafts and open GitHub pull requests. They never push to `main`. They never deploy. A human reads, edits if needed, and merges.

**Observable by design.** Every agent run logs its inputs, tool calls, decisions, token cost, and outcome to Langfuse. Nothing runs in the dark.

**Local-first.** Agents run on your PC behind WSL2. MCP servers that touch files or run code are stdio-only and never exposed over public HTTP. Data stays on your machine unless you explicitly publish it.

---

## The two machines and how they work together

You develop on your **Mac**. The agents run on your **PC behind WSL2**. Git is the bridge.

```
Mac (development)
  ├── VS Code / Claude Code CLI
  ├── Writing MDX content
  ├── Reviewing draft PRs from agents
  ├── Pushing approved content to GitHub
  └── Running the website in dev mode

PC / WSL2 (agent runtime)
  ├── Docker (Qdrant, Langfuse, PostgreSQL, code runner sandboxes)
  ├── LangGraph agent processes
  ├── MCP servers (stdio, local only)
  ├── Scheduled cron triggers (Orchestrator Agent)
  └── Cloned from the same GitHub repo
```

You push changes from Mac → GitHub. On the PC, `git pull` brings those changes in. Agents on the PC write drafts → open PRs → you review on Mac and merge. Vercel picks up the merge and deploys.

**First-time setup on PC/WSL2:**
1. `git clone https://github.com/gitadmin-wynoot/pranavsrivastava-com.git`
2. Install Docker Desktop for Windows (or Docker Engine in WSL2)
3. `cd infra/docker && docker compose up -d` (starts Qdrant, Langfuse, PostgreSQL)
4. `pip install -r agents/requirements.txt`
5. Copy `.env.example` to `.env.local` and fill in your keys
6. Done — agents can run

---

## Orchestrator Agent

The orchestrator is the daily trigger. It runs on a cron schedule (WSL2 cron or a simple systemd timer).

**What it does each day:**
1. Loads all source registries (one per specialist agent)
2. Fetches updates from trusted sources
3. Scores each update by importance and relevance
4. Assigns updates to the right specialist agent
5. Waits for each specialist to produce a draft
6. Consolidates results into a daily summary
7. Logs the full run to Langfuse

The orchestrator does not write course content itself. It is a dispatcher, not a writer.

**Where it lives:** `agents/orchestrator/`

---

## Specialist Agents

Each specialist agent is responsible for one course track. It is a subject matter expert — trained (via skill files) to understand the nuance of its domain.

### Currently planned agents

| Agent | Owns | Sources (examples) |
|---|---|---|
| `mcp-curriculum-agent` | `courses/mcp/` | modelcontextprotocol.io, MCP GitHub, Anthropic blog |
| `ai-agents-curriculum-agent` | `courses/ai-agents/` | LangGraph docs, CrewAI releases, AI papers |
| `cloud-apis-agent` | `courses/cloud-apis/` | AWS What's New, Azure updates, Google Cloud blog |

### What each specialist does when triggered

1. Receives a list of updates from the Orchestrator
2. Loads its source registry and skill files
3. Searches existing course content (vector search — "do we already cover this?")
4. Decides: update an existing module, add a new module, add a lab, or ignore
5. Writes the draft content following skill file instructions
6. Validates the draft (accuracy, tone, runnable examples)
7. Runs the public/private boundary check (no secrets, no private paths)
8. Adds a changelog entry
9. Opens a draft GitHub PR with full context

**Where they live:** `agents/mcp-curriculum/`, `agents/ai-agents-curriculum/`, etc.

---

## Skill Files

Skill files are the most important thing in this system. They are what separates useful agent output from generic AI text.

A skill file is a markdown document that tells an agent exactly how to approach a specific type of task. It is not code. It is a written instruction — like a style guide crossed with a job description.

### What a skill file contains

- **Purpose** — one sentence on what task this covers
- **When to use it** — under what conditions this skill applies
- **Step-by-step approach** — how to think through the task
- **Output format** — exactly what structure the output must have
- **Tone guide** — how to write (with examples of good and bad phrasing)
- **What to avoid** — common mistakes, things to never do
- **Quality checklist** — a final check before producing output

### Where they live

```
agents/
  shared/
    skills/
      write-course-module.md       ← used by all curriculum agents
      validate-lesson.md           ← used by all curriculum agents
      public-private-check.md      ← used by all agents
  mcp-curriculum/
    skills/
      evaluate-mcp-update.md       ← MCP-specific update scoring
      update-mcp-curriculum.md     ← maps an update to the right course location
      create-mcp-lab.md            ← lab structure for MCP examples
  ai-agents-curriculum/
    skills/
      evaluate-agents-update.md
      update-agents-curriculum.md
      create-agents-lab.md
  orchestrator/
    skills/
      triage-updates.md
      delegate-to-specialist.md
      create-daily-summary.md
```

### The distinction between skill files and MCP tools

| MCP Tool | Skill File |
|---|---|
| Gives the agent a capability (what it CAN do) | Tells the agent how to use that capability (HOW it does it) |
| `read_file()` — reads a file | "When reading a module, first check the frontmatter, then the LearningObjectives block..." |
| `search_web()` — fetches a URL | "When researching, prefer official docs over blog posts. Score sources by trust level..." |
| `open_pr()` — creates a GitHub PR | "PR title must start with [Draft] and include the affected module name..." |

If agent output is poor, you fix the skill file — not the code.

---

## MCP Servers

These are local Python servers that give agents access to tools. All run via stdio (not HTTP). All are local-only.

### Shared infrastructure (used by all agents)

| Server | Purpose | Path |
|---|---|---|
| `mcp-course-content` | Read and write MDX modules, manifests, changelogs | `mcp-servers/course-content/` |
| `mcp-docs-research` | Fetch and parse content from curated source registry | `mcp-servers/docs-research/` |
| `mcp-code-runner` | Run example code in Docker-isolated sandbox | `mcp-servers/code-runner/` |
| `mcp-vector-memory` | Search existing content and agent history by meaning | `mcp-servers/vector-memory/` |
| `mcp-observability` | Log runs, costs, and decisions to Langfuse | `mcp-servers/observability/` |
| GitHub MCP (official) | Create branches, commits, draft PRs | installed via npx, no build needed |

### The code runner — how isolation works

The `mcp-code-runner` server uses Docker to run agent-generated code safely:

```
Agent requests: run this Python snippet
      │
      ▼
mcp-code-runner creates a temp workspace: /tmp/sandbox-abc123/
      │
      ▼
Runs: docker run --rm --network none
              -v /tmp/sandbox-abc123:/workspace
              --read-only --tmpfs /tmp
              python:3.12-slim
              python /workspace/code.py
      │
      ▼
Returns: stdout + stderr + exit code
Temp workspace deleted after run
```

No network. No access to your home folder, SSH keys, or any credentials. Container deleted after every run. This is how you safely run agent-generated code locally.

---

## Memory Architecture

Agents need to remember things across runs. Different types of memory are stored differently.

```
Tier 1 — In-context (automatic, disappears after run)
  The current conversation with the LLM.
  Managed by LangGraph messages state.
  No setup needed.

Tier 2 — Session checkpoints (SQLite, automatic)
  Saves agent state mid-run so it can pause and resume.
  Path: ~/.local/share/pranav-ai/checkpoints/
  Managed by LangGraph MemorySaver (SQLite backend).

Tier 3 — Long-term decisions (SQLite)
  What updates were reviewed, what was approved, what was ignored.
  Prevents proposing the same thing twice.
  Path: ~/.local/share/pranav-ai/memory/decisions.db

Tier 4 — Semantic memory (Qdrant, Docker)
  Embeddings of all course content, source summaries, past run outputs.
  Used to answer: "do we already cover this topic?"
  Endpoint: localhost:6333 (local Docker, WSL2)

Tier 5 — Run logs (JSONL, append-only)
  One file per agent run. Full audit trail.
  Every tool call, every decision, every output.
  Path: ~/.local/share/pranav-ai/runs/YYYY-MM-DD/
```

---

## Local Docker Stack (WSL2)

Add to `infra/docker/docker-compose.yml`:

| Service | Purpose | Port |
|---|---|---|
| PostgreSQL | Langfuse data + agent state | 5432 |
| Langfuse | Observability dashboard (web UI) | 3000 |
| Qdrant | Vector memory for all agents | 6333 |

The code runner uses the Docker socket already available in WSL2 — no extra setup needed.

---

## Source Registries

Each specialist agent has a curated list of trusted sources it checks for updates.

**File location:** `config/sources/mcp-sources.json`, `config/sources/ai-agents-sources.json`, etc.

**Source entry format:**
```json
{
  "name": "MCP Official Docs",
  "url": "https://modelcontextprotocol.io/changelog",
  "type": "docs",
  "trust_level": "official",
  "check_frequency": "daily",
  "active": true
}
```

Trust levels: `official → high → medium → low`

Only `official` and `high` trust sources trigger automatic content proposals. `medium` sources surface as suggestions for manual review. `low` sources are logged but never trigger agent actions.

---

## Course Content Structure

Courses are multi-module, not single files. This lets agents update individual modules without touching the whole course.

```
apps/web/content/courses/
  mcp/
    course.manifest.json       ← course metadata, module list, version
    changelog.md               ← agent writes here on every run
    modules/
      01-what-is-mcp.mdx
      02-architecture.mdx
      03-your-first-server.mdx
      04-file-tools.mdx
      05-database-tools.mdx
      06-web-and-api-tools.mdx
      07-security.mdx
      08-hands-on-project.mdx
    labs/
      build-first-server/
      filesystem-server/
      remote-mcp-with-auth/
    examples/
      python/
      typescript/
  ai-agents/
    (same structure)
  cloud-apis/
    (same structure)
```

The website serves these as a module-by-module view — sidebar navigation, one module per page, Udemy-style. Route: `/courses/mcp/[module]`.

---

## Output Channels

The factory is not limited to the website. Agent-produced drafts can feed multiple channels, all subject to human review.

| Output | Channel | Format |
|---|---|---|
| Course modules | pranavsrivastava.com/courses | MDX |
| Blog posts | pranavsrivastava.com/blog | MDX |
| Project write-ups | pranavsrivastava.com/projects | MDX |
| Audio scripts | TTS pipeline (to be defined) | Plain text |
| Newsletter | Beehiiv / Substack (future) | HTML / Markdown |
| Video scripts | YouTube / educational content (future) | Structured Markdown |
| Social posts | LinkedIn, X (future) | Short text |

Nothing is auto-published. Every output channel has a human review step. The agents produce the draft; you decide what goes live and where.

---

## Human Approval Gates

The agent may:
- Create draft course modules
- Create draft labs and examples
- Add changelog entries
- Open draft GitHub pull requests
- Suggest roadmap changes
- Produce content for any output channel

The agent may never:
- Push to `main` directly
- Deploy to production
- Publish to any public channel automatically
- Expose a shell or file system over public HTTP
- Rewrite large course sections without review
- Send emails or post to social media

Every irreversible action requires a human to approve it first.

---

## Changelog Format

Every course update logged by an agent must follow this format in `courses/[track]/changelog.md`:

```markdown
## YYYY-MM-DD

### Change
What was updated and why.

### Source
URL or reference that triggered this update.

### Course impact
Which modules were affected. What changed for the learner.

### Files changed
List of files modified or created.

### Validation
Did example code run? Were sources checked? What was the risk level?

### Human review status
[ ] Pending / [x] Approved — @pranav — YYYY-MM-DD
```

---

## Build Phases

### Phase 1 — MCP agent working end to end
- [ ] GitHub remote connected, repo synced
- [ ] Docker stack extended (Qdrant + Langfuse)
- [ ] MCP course split into multi-module structure
- [ ] Website updated for module-by-module view
- [ ] Source registry created (MCP sources)
- [ ] Skill files written (MCP curriculum set)
- [ ] `mcp-course-content` server built
- [ ] `mcp-docs-research` server built
- [ ] `mcp-code-runner` server built (Docker-isolated)
- [ ] MCP Curriculum Agent built (LangGraph)
- [ ] Langfuse wired into agent
- [ ] Official GitHub MCP configured
- [ ] Manual agent run → draft PR opened → human reviews

### Phase 2 — Orchestrator + multi-agent
- [ ] Orchestrator Agent built
- [ ] AI Agents Curriculum Agent added
- [ ] Vector memory wired (Qdrant)
- [ ] Weekly scheduled trigger (WSL2 cron)
- [ ] Observability dashboard reviewed and tuned
- [ ] Code example validation working

### Phase 3 — Full factory
- [ ] Cloud & APIs Curriculum Agent
- [ ] Audio script output channel
- [ ] Newsletter draft channel
- [ ] Multi-agent review (agents critique each other's drafts)
- [ ] Course versioning
- [ ] Public learning dashboard

---

## What good output looks like

When the factory is healthy, a typical weekly cycle produces:

- 1–3 draft PRs, each covering a meaningful update to a course module
- A changelog entry explaining why the update matters
- At least one runnable code example, validated in the sandbox
- A Langfuse trace showing what the agent did, how long it took, what it cost
- A clear PR description that makes human review take under 10 minutes

The goal is not volume. The goal is one trusted, useful, well-written update per week per course track.

---

## Quality standard

Every piece of content this system produces — whether a course module, a lab, a blog post, or an audio script — must read like it was written by a thoughtful human who actually knows the subject.

Not like documentation. Not like a summary. Like a teacher who has done this work themselves and is explaining it clearly to someone who has not.

The skill files carry this standard. When output drifts from it, the skill files are updated, not the code.
