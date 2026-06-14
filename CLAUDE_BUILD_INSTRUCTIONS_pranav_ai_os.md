# Claude Build Instructions: Pranav Srivastava Personal AI OS + Portfolio Platform

## 0. Purpose of this file

You are Claude. Your task is to help build a complete, maintainable, future-facing personal website and AI lab platform for **Pranav Srivastava** at:

```text
pranavsrivastava.com
```

This should not be a simple portfolio website. It should be the foundation of a personal **AI OS**, **Second Brain**, **AI Lab**, **course platform**, **project showcase**, and **consulting trust engine**.

The platform should help Pranav:

1. Build his long-term personal brand.
2. Showcase his work in AI, cloud, APIs, automation, and software architecture.
3. Publish small live AI projects under subdomains or project pages.
4. Track latest developments in AI and convert them into experiments.
5. Maintain a structured Second Brain of ideas, research, projects, courses, and tutorials.
6. Create a system that can later use agents, MCP servers, model-independent LLM routing, observability, and automation.
7. Build public credibility for consulting opportunities.
8. Keep the system modular enough to evolve over years.

This should be designed as a serious, clean, trustworthy personal engineering platform — not a gimmicky AI demo site.

---

## 1. Brand ecosystem

Pranav has three relevant brands/domains:

### 1.1 Personal domain

```text
pranavsrivastava.com
```

This is the main authority brand.

Purpose:

- Personal brand
- Portfolio
- AI Lab
- Writing
- Courses
- Public projects
- Consulting credibility
- Historical record of thinking and building
- Second Brain public surface

This should be the main website we build first.

### 1.2 Qubitsy

```text
qubitsy.com
```

Qubitsy is a registered proprietary/company-style identity.

Purpose:

- Consulting studio
- R&D studio
- Client work
- AI/cloud/API engineering services
- Possible future quantum/future-tech experiments
- Business-facing credibility

Qubitsy should not be the main personal brand yet. It should be referenced from the personal site as the consulting/R&D studio through which Pranav can deliver professional work.

Suggested positioning:

```text
Qubitsy is Pranav's AI, Cloud and API engineering studio focused on practical automation, modern software platforms, and future-facing R&D.
```

### 1.3 Wynoot

```text
wynoot.com
```

Wynoot is a SaaS/product brand.

Purpose:

- Product for small businesses, solopreneurs, creators, coaches, and service providers
- Website/product platform
- Calendar/booking/automation features
- Product-specific roadmap and customer story

Wynoot should remain product-focused and separate from Pranav's AI lab experiments.

### 1.4 Recommended brand hierarchy

Use this hierarchy across the website:

```text
Pranav Srivastava
AI, Cloud & API Architect
Founder of Qubitsy
Builder of Wynoot
Creator of a personal AI Lab / AI OS / Second Brain platform
```

The personal domain is the trust layer.
Qubitsy is the consulting/commercial studio.
Wynoot is the product.

---

## 2. Main product vision

Build `pranavsrivastava.com` as a living personal AI platform with two layers:

### 2.1 Public layer

For visitors, recruiters, potential consulting clients, collaborators, and learners.

Public sections:

```text
Home
About
Consulting
AI Lab
Projects
Writing
Courses
Second Brain
Companies & Products
Contact
```

The public layer should feel:

- Trustworthy
- Clear
- Thoughtful
- Practical
- Slightly future-facing
- Human and warm
- Not overhyped
- Not too corporate
- Not too abstract

It should communicate that Pranav is a hands-on software architect who learns, builds, documents, and thinks deeply.

### 2.2 Private/admin layer

For Pranav only, protected behind authentication.

Private sections can be implemented as placeholders initially, but the architecture should support them later.

Private sections:

```text
/admin
/admin/ideas
/admin/agents
/admin/projects
/admin/courses
/admin/observability
/admin/model-usage
/admin/second-brain
```

The private layer should become the cockpit for:

- AI Radar
- Idea backlog
- Agent runs
- Project factory
- Course generation pipeline
- Observability
- Token usage
- Model costs
- MCP integrations

---

## 3. Core concept: AI OS + Second Brain

The system should be based on this loop:

```text
Discover → Understand → Propose → Build → Test → Publish → Observe → Improve
```

This is the heart of the platform.

### 3.1 Discover

The system should eventually monitor:

- AI model releases
- MCP ecosystem updates
- Agent frameworks
- Cloud/AI announcements
- Open-source projects
- Research papers
- Developer tooling
- API/platform trends
- Automation ideas
- New project possibilities

### 3.2 Understand

It should summarize and categorize updates by:

- Topic
- Usefulness
- Difficulty
- Buildability
- Relevance to Pranav
- Demo potential
- Consulting relevance
- Course/tutorial potential

### 3.3 Propose

It should generate structured mini-project ideas.

Example idea shape:

```json
{
  "title": "Build a private MCP server for project notes",
  "category": "MCP",
  "difficulty": "medium",
  "why_now": "Remote MCP and tool-connected agents are becoming important",
  "project_size": "2-day demo",
  "public_demo_possible": true,
  "course_possible": true,
  "consulting_relevance": "Shows capability in agent-tool architecture"
}
```

### 3.4 Build

Selected ideas should eventually become:

- A live demo
- A GitHub repo
- A tutorial
- A course lesson
- A short write-up
- A video outline
- A social post idea

### 3.5 Test

Generated projects should have:

- Basic tests
- Linting
- Type checks
- README
- Deployment instructions
- Security notes

### 3.6 Publish

Projects should be published as:

```text
pranavsrivastava.com/projects/<project-slug>
```

or optionally as:

```text
<project>.pranavsrivastava.com
```

### 3.7 Observe

Track:

- Project status
- Build status
- Deployment status
- Agent runs
- Model used
- Tokens used
- Cost
- Latency
- Errors
- Tool calls
- Human approvals

### 3.8 Improve

Each project should be revisitable and improve over time.

---

## 4. Recommended initial technology stack

Use a modern but maintainable stack.

### 4.1 Frontend

Preferred:

```text
Next.js 15
TypeScript
Tailwind CSS
MDX
shadcn/ui or a clean custom component system
```

The user is comfortable with Next.js and TypeScript.

### 4.2 Content

Use file-based content first.

Recommended:

```text
MDX for writing, courses, and project pages
JSON/YAML metadata for structured data
Local content folders committed to Git
```

This keeps things simple, portable, and AI-friendly.

### 4.3 Backend/API

Start simple:

```text
Next.js API routes/server actions
```

Later extensible to:

```text
AWS Lambda
ECS Fargate
API Gateway
DynamoDB/Postgres
```

### 4.4 Database

For MVP, file-based content is enough.

For future private/admin features:

```text
Postgres preferred for relational app state
DynamoDB acceptable for event logs/usage if using AWS heavily
SQLite acceptable for local development
```

Suggested future data stores:

```text
Postgres / Supabase / RDS → ideas, projects, courses, agent runs
S3 → images, course assets, generated files
Qdrant / pgvector → vector search / second brain
Redis → session/cache/queues
```

### 4.5 LLM gateway

Do not hardcode to a single LLM.

Create an abstraction layer so the system can use:

```text
OpenAI
Claude
Gemini
Bedrock
Ollama/local models
Future providers
```

Suggested package/folder:

```text
packages/llm-gateway
```

Design it so the rest of the app calls:

```ts
llmGateway.generate({ modelPolicy, messages, tools, metadata })
```

rather than calling a provider directly.

### 4.6 Agent orchestration

Initial recommendation:

```text
LangGraph-style architecture for agent workflows
MCP for tools/context
LiteLLM-compatible model abstraction if useful
Langfuse or similar for observability later
```

Important: In MVP, do not overbuild real autonomous agents. Prepare the structure and add simple deterministic workflows first.

### 4.7 MCP

MCP should be planned as the tool/context layer.

Potential MCP servers:

```text
mcp-files          → controlled file access
mcp-github         → selected repos only
mcp-course         → course content and assets
mcp-ideas          → idea backlog
mcp-deploy         → deployment trigger with human approval
mcp-observability  → traces, runs, costs
mcp-shell          → local only, never public
```

For MVP, create placeholder architecture and documentation. Implement one simple local MCP server only if practical.

### 4.8 Observability

Plan for:

```text
Agent runs
Tool calls
Model usage
Token consumption
Cost
Latency
Errors
Approval status
```

Create a UI placeholder for:

```text
/admin/observability
/admin/model-usage
```

MVP can use mock/local JSON data.

---

## 5. Local development environment

Pranav will use:

```text
Windows 11 PC
WSL2 Ubuntu
Docker Desktop
VS Code Remote WSL
D: drive for models/datasets/backups
MacBook laptops for other work
```

Recommended layout:

### 5.1 Active code inside WSL2

```bash
~/projects/pranav-ai-os
```

Do not put active Node/Python projects directly in `/mnt/d` if avoidable, because mounted Windows drives can be slower for many small files.

### 5.2 Heavy storage on D drive

```text
D:\AI\models
D:\AI\datasets
D:\AI\backups
D:\AI\course-assets
D:\AI\docker-volumes
```

Use D drive for large files, models, datasets, archives, generated media, and backups.

---

## 6. Recommended monorepo structure

Create a monorepo like this:

```text
pranav-ai-os/
  README.md
  CLAUDE.md
  package.json
  pnpm-workspace.yaml
  turbo.json
  .env.example
  .gitignore

  apps/
    web/                    # Main pranavsrivastava.com website
    admin/                  # Optional future private dashboard, can be combined with web initially

  content/
    writing/
    projects/
    courses/
    second-brain/
    lab-notes/

  agents/
    research-agent/
    cloud-agent/
    api-agent/
    coding-agent/
    writer-agent/

  mcp-servers/
    mcp-files/
    mcp-ideas/
    mcp-course/
    mcp-observability/

  packages/
    ui/
    config/
    content-core/
    llm-gateway/
    agent-core/
    prompts/
    skills/
    evals/
    telemetry/
    shared-types/

  infra/
    docker/
    terraform/
    k8s/

  docs/
    architecture/
    decisions/
    runbooks/
    security/
```

If this is too much for the first implementation, create the folders but keep many as placeholders with README files.

---

## 7. Website information architecture

Build these pages first.

### 7.1 Home page

Route:

```text
/
```

Purpose:

- Introduce Pranav clearly.
- Show what he does.
- Link to AI Lab, consulting, projects, writing, and courses.
- Make visitors understand he is a practical AI/cloud/API architect.

Suggested hero message:

```text
I build practical AI, cloud and API systems — and document the journey from idea to working product.
```

Supporting message:

```text
This site is my public workshop: a portfolio, AI lab, second brain, and learning space where I explore agentic systems, automation, APIs, cloud architecture, and small live experiments.
```

CTA examples:

```text
Explore AI Lab
View Projects
Work With Me
Read Notes
```

### 7.2 About

Route:

```text
/about
```

Include:

- Indian origin, Netherlands-based software engineer/architect
- 14+ years experience
- Cloud, APIs, telco, SaaS, AI/automation
- Founder/builder context: Qubitsy and Wynoot
- Human side: learning, travel, storytelling, systems thinking
- Tone should be humble and grounded, not guru-like

### 7.3 Consulting

Route:

```text
/consulting
```

Position Pranav for consulting.

Services:

```text
AI architecture and agentic workflow design
Cloud architecture and AWS serverless systems
API platform design and integrations
MCP/server/tooling architecture
Automation and internal productivity systems
SaaS product architecture
Technical discovery and workshops
```

Mention Qubitsy as the consulting/R&D studio.

CTA:

```text
Book a discovery call
Send an email
View case studies/projects
```

### 7.4 AI Lab

Route:

```text
/ai-lab
```

Purpose:

- Public hub for experiments.
- Show current explorations.
- Show live mini projects.
- Show AI Radar-style updates eventually.

Sections:

```text
Current experiments
Live demos
Research notes
Build logs
Upcoming ideas
```

### 7.5 Projects

Routes:

```text
/projects
/projects/[slug]
```

Each project should have:

```text
Title
Short summary
Problem
What I built
Tech stack
Architecture
What I learned
Live demo link
GitHub link
Related writing/course
Status: idea / building / live / archived
```

### 7.6 Writing

Routes:

```text
/writing
/writing/[slug]
```

Writing categories:

```text
AI systems
Cloud architecture
APIs
Automation
Builder notes
Product thinking
Second brain notes
```

### 7.7 Courses

Routes:

```text
/courses
/courses/[slug]
/courses/[slug]/[lesson]
```

The course system should support:

```text
Step-by-step lessons
Images
Diagrams
Code snippets
Downloadable assets
Future video scripts
Progress structure
```

Initial courses can be placeholders:

```text
Building a Personal AI OS
MCP for Builders
AI Agents for Practical Automation
Cloud Architecture for AI Apps
```

### 7.8 Second Brain

Route:

```text
/second-brain
```

Public version should show curated notes, not private data.

Sections:

```text
Ideas
Reading notes
System designs
Learning maps
Build logs
Patterns
```

### 7.9 Companies & Products

Route:

```text
/companies
```

Show:

```text
Qubitsy → consulting/R&D studio
Wynoot → SaaS product
Maps and Metaphors → optional creative/travel/storytelling work if desired later
```

Keep it clean.

### 7.10 Contact

Route:

```text
/contact
```

Include:

- Email link
- LinkedIn
- GitHub
- Optional contact form
- Consulting CTA

---

## 8. Admin/dashboard routes for future

Create protected/private placeholder pages if practical.

Routes:

```text
/admin
/admin/ideas
/admin/projects
/admin/courses
/admin/agents
/admin/observability
/admin/model-usage
/admin/settings
```

For MVP, they can show mock data and a note:

```text
Private AI OS cockpit. Authentication and live agent workflows will be added in later phases.
```

Do not expose secrets or sensitive data.

---

## 9. Content model

Use structured content.

### 9.1 Project metadata example

```yaml
title: "AI Radar"
slug: "ai-radar"
summary: "A personal AI watcher that turns AI updates into buildable project ideas."
status: "building"
category: "AI Agents"
tags:
  - AI
  - Agents
  - MCP
  - Automation
liveUrl: ""
githubUrl: ""
createdAt: "2026-06-14"
updatedAt: "2026-06-14"
featured: true
```

### 9.2 Writing metadata example

```yaml
title: "Why I am building a personal AI OS"
slug: "why-personal-ai-os"
summary: "A note on building a practical system for learning, experimenting and publishing in the AI era."
category: "Builder Notes"
tags:
  - AI OS
  - Second Brain
  - Agents
published: true
createdAt: "2026-06-14"
```

### 9.3 Course metadata example

```yaml
title: "Building a Personal AI OS"
slug: "building-personal-ai-os"
summary: "A practical course on designing a personal AI lab with agents, MCP, observability and live projects."
level: "Beginner to Intermediate"
status: "draft"
lessons:
  - intro
  - architecture
  - llm-gateway
  - mcp-basics
  - observability
  - project-factory
```

---

## 10. First flagship project: AI Radar

Build the first demo/project around:

```text
AI Radar
```

Purpose:

```text
A personal AI watcher that collects AI trends, converts them into structured insights, and proposes small buildable projects for Pranav's AI Lab.
```

For MVP, it can use static/mock data.

Public page:

```text
/projects/ai-radar
```

AI Lab card:

```text
AI Radar — tracking AI updates and turning them into experiments.
```

Admin mock page:

```text
/admin/ideas
```

Mock idea fields:

```text
Title
Category
Why now
Difficulty
Build time
Demo potential
Course potential
Status
```

Example mock ideas:

```text
1. Private MCP server for personal project notes
2. AI cost observability dashboard
3. Agentic API testing harness
4. Local LLM coding sandbox
5. Course generator from build logs
```

---

## 11. Design direction

The website should look modern, clean, and trustworthy.

Visual style:

```text
Minimal but not empty
Soft dark/light support if possible
Readable typography
Subtle gradients or grid patterns
Engineering-lab feel
Warm human voice
No excessive animations
No generic AI neon overload
```

Possible aesthetic:

```text
Personal architect notebook + AI lab dashboard
```

Use simple language.
Avoid phrases that sound too fake or overhyped.

Good tone:

```text
I am exploring...
I am building...
This is a working note...
This is an experiment...
Here is what I learned...
```

Avoid tone:

```text
World-class revolutionary AI ecosystem changing the future forever
```

---

## 12. Security principles

This system will eventually include agents, tools, MCP servers, model APIs, and deployments. Security should be designed from day one.

Rules:

```text
No secrets committed to Git
Use .env.example only
No public shell MCP server
No production deployment without human approval
No broad AWS admin access for agents
No private personal data in public Second Brain
All agent actions should be logged
All expensive model calls should have budgets
Use least privilege for every tool
```

If remote MCP is added later:

```text
Use OAuth or private network access
Prefer Cloudflare Access/Tailscale for personal use
Do not expose local PC directly to the public internet
Never expose shell tools publicly
```

---

## 13. Observability requirements

Add a future-ready observability model.

Track fields like:

```ts
type AgentRun = {
  id: string;
  agentName: string;
  task: string;
  status: "queued" | "running" | "success" | "failed" | "needs_approval";
  modelProvider?: string;
  modelName?: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
  latencyMs?: number;
  toolCalls?: ToolCall[];
  error?: string;
  createdAt: string;
  completedAt?: string;
};
```

For MVP, create mock dashboards.

Dashboard cards:

```text
Total runs
Successful runs
Failed runs
Total tokens
Estimated cost
Most used model
Most active agent
Recent tool calls
```

---

## 14. Agent and skill architecture

Prepare folders for agents and skills.

### 14.1 Agents

Initial agents:

```text
Research Agent
Cloud Architect Agent
API/Integration Agent
Coding Agent
Writer/Course Agent
Observability Agent
Security Reviewer Agent
```

Each agent folder should eventually contain:

```text
agent.md
role.md
tools.md
output-schema.json
examples.md
eval.md
```

### 14.2 Skills

Skills are reusable capabilities/instructions.

Suggested skills:

```text
skills/ai-research
skills/cloud-architecture
skills/mcp-server-design
skills/api-design
skills/course-writing
skills/code-review
skills/observability
skills/deployment
skills/security-review
```

Each skill should eventually contain:

```text
SKILL.md
examples/
templates/
checklists/
```

This gives the project long-term structure and lets future coding agents use the system more reliably.

---

## 15. Deployment strategy

### 15.1 First deployment

Use the simplest reliable option.

Recommended:

```text
Vercel for pranavsrivastava.com
GitHub for source control
Environment variables in Vercel
```

Alternative:

```text
AWS Amplify / CloudFront / S3 / Lambda
```

Because Pranav already uses AWS heavily, AWS is fine later, but for first launch, speed matters.

### 15.2 Subdomains

Possible subdomains:

```text
ai-radar.pranavsrivastava.com
mcp-lab.pranavsrivastava.com
agents.pranavsrivastava.com
courses.pranavsrivastava.com
```

Do not create too many subdomains initially. Prefer project pages first.

### 15.3 CI/CD

Add GitHub Actions later for:

```text
lint
typecheck
test
build
security checks
```

---

## 16. MVP scope

Build a useful first version, not the entire dream at once.

### Must-have for MVP

```text
Next.js app
Clean homepage
About page
Consulting page
AI Lab page
Projects list and project detail page
Writing list and article page
Courses list and course detail placeholder
Second Brain page
Companies page linking Qubitsy and Wynoot
Contact page
Content system using MDX/metadata
First project: AI Radar
Mock admin dashboard
Good README
Good architecture docs
```

### Nice-to-have for MVP

```text
Dark mode
Search
Tags/categories
RSS feed
Sitemap
Basic analytics
Mock model usage dashboard
Mock agent run dashboard
```

### Not required for MVP

```text
Real autonomous agents
Real MCP deployment
Real OAuth
Real vector DB
Real Kubernetes
Real multi-provider LLM execution
Real course video generation
```

These should be planned, documented, and scaffolded only.

---

## 17. Phased roadmap

### Phase 1: Public foundation

Build:

```text
Portfolio website
AI Lab
Projects
Writing
Courses placeholder
Second Brain placeholder
Consulting page
Companies page
```

Goal:

```text
A credible public website that can go live quickly.
```

### Phase 2: Structured content engine

Build:

```text
MDX content system
Project metadata
Writing metadata
Course metadata
Tags/search
RSS/sitemap
```

Goal:

```text
Pranav can publish consistently.
```

### Phase 3: AI Radar MVP

Build:

```text
Mock AI idea backlog
Manual AI update entries
Idea scoring model
Public AI Radar project page
Admin idea dashboard
```

Goal:

```text
The AI OS starts looking real.
```

### Phase 4: LLM gateway + observability

Build:

```text
LLM gateway abstraction
Provider config
Usage logging schema
Mock/real token tracking
Model usage dashboard
```

Goal:

```text
The system is model-independent and observable.
```

### Phase 5: MCP local tools

Build:

```text
Local MCP server for content/files/ideas
MCP docs
Tool safety boundaries
Local-only setup instructions
```

Goal:

```text
Pranav can connect AI tools to his local/project context.
```

### Phase 6: Project factory

Build:

```text
Idea → project brief
Project brief → repo scaffold
Build log → tutorial draft
Tutorial → course lesson/video outline
```

Goal:

```text
One experiment becomes many public outputs.
```

### Phase 7: Cloud/private AI cockpit

Build:

```text
Authenticated admin
Remote-safe MCP or API tools
Persistent DB
Vector search
Cloud deployment workflows
```

Goal:

```text
A real personal AI OS.
```

---

## 18. Example copy for homepage

Use or adapt this copy.

### Hero

```text
I build practical AI, cloud and API systems — and document the journey from idea to working product.
```

### Subhero

```text
This is my public workshop: a portfolio, AI lab, second brain and learning space where I explore agentic systems, automation, APIs, cloud architecture and small live experiments.
```

### Intro section

```text
I am Pranav Srivastava, a Netherlands-based software engineer and architect with 14+ years of experience across APIs, cloud platforms, integrations and product engineering. I use this space to build in public, test ideas, write notes, publish tutorials and turn emerging AI concepts into practical systems.
```

### AI Lab section

```text
The AI Lab is where I turn new ideas into small working projects. Some experiments are tiny. Some become tutorials. Some may become products. The goal is simple: keep learning, keep building, and keep the work visible.
```

### Consulting section

```text
Through Qubitsy, I help teams think through AI workflows, cloud architecture, API platforms, automation and product engineering. My focus is practical: clear systems, maintainable architecture and measurable outcomes.
```

---

## 19. Initial content items to create

Create sample content for these.

### 19.1 Projects

```text
AI Radar
Personal MCP Lab
Agent Observability Dashboard
Course Builder from Build Logs
Wynoot Architecture Notes
```

### 19.2 Writing

```text
Why I am building a personal AI OS
What MCP means for practical builders
Why observability matters for AI agents
The difference between a portfolio and a living lab
How I think about personal brand, Qubitsy and Wynoot
```

### 19.3 Courses

```text
Building a Personal AI OS
MCP for Practical Builders
AI Agents with Observability
Cloud Architecture for AI Experiments
```

---

## 20. Acceptance criteria

The first generated version should:

1. Run locally with simple commands.
2. Have a clean README.
3. Use TypeScript properly.
4. Have clear folder structure.
5. Have reusable components.
6. Have file-based content.
7. Have at least one complete project page.
8. Have at least one writing article.
9. Have at least one course placeholder.
10. Have an AI Lab page.
11. Have a consulting page referencing Qubitsy.
12. Have a companies/products page referencing Qubitsy and Wynoot.
13. Have a future architecture document.
14. Have security notes.
15. Avoid overengineering the MVP.
16. Be easy to deploy.
17. Look professional enough for a consultant profile.
18. Feel personal enough to build trust.

---

## 21. Commands expected

Use `pnpm` if possible.

Expected commands:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
```

If using a different package manager, explain why.

---

## 22. Files Claude should create early

Create these early:

```text
README.md
CLAUDE.md
.env.example
docs/architecture/overview.md
docs/security/agent-safety.md
docs/roadmap.md
content/projects/ai-radar.mdx
content/writing/why-personal-ai-os.mdx
content/courses/building-personal-ai-os/index.mdx
```

---

## 23. CLAUDE.md instructions for ongoing development

Create a `CLAUDE.md` in the repo with these rules:

```md
# CLAUDE.md

## Project identity

This project is Pranav Srivastava's personal AI OS, portfolio, AI lab, second brain and course platform.

## Development principles

- Keep the system modular.
- Prefer simple working implementation over heavy architecture.
- Do not hardcode one LLM provider.
- Keep content portable and file-based unless a database is truly needed.
- Never commit secrets.
- Do not create public shell/tool access.
- Add observability hooks for future agent workflows.
- Build for long-term trust, not hype.
- Use clear TypeScript types.
- Keep UI clean, readable and professional.

## Brand principles

- pranavsrivastava.com is the main personal authority brand.
- Qubitsy is the consulting/R&D studio.
- Wynoot is the product brand.
- Keep all three connected but not mixed.

## Tone

Practical, thoughtful, humble, builder-oriented.
Avoid exaggerated AI hype.

## Safety

Any agent, MCP, deployment or shell capability must be designed with least privilege and human approval.
```

---

## 24. Important implementation advice

Do not try to implement every future feature immediately.

The correct first version is:

```text
A beautiful, structured, content-rich personal site with strong scaffolding for AI OS features.
```

Not:

```text
A fragile, half-working autonomous agent system with too many moving parts.
```

The site should go live early and then evolve.

Build the foundation like a house that can later become a lab, not like a lab that cannot yet be lived in.

---

## 25. Final instruction to Claude

Please build this from scratch as a maintainable Next.js/TypeScript project.

Start by creating the monorepo/project structure, then implement the public website first. Add content-driven pages, sample content, clean design, and placeholder admin/AI OS pages. Document the future architecture clearly.

Prioritize:

```text
1. Clean structure
2. Professional public website
3. Strong content system
4. AI Lab and project showcase
5. Clear roadmap for agents/MCP/observability
6. Safety and maintainability
```

Do not overbuild autonomous agents in the first pass. Scaffold them thoughtfully.

The end result should feel like the beginning of a serious personal AI operating system — public enough to build trust, private enough to become powerful, and simple enough to keep improving.
