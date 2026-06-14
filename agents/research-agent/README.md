# Research Agent

**Status:** Planned (Phase 3)
**Language:** Python
**Framework:** LangGraph

## Purpose

Scans the AI ecosystem and turns updates into structured, actionable project ideas.

## What it monitors

- AI model releases (Anthropic, OpenAI, Google, open-source)
- MCP ecosystem updates and new servers
- Agent framework releases (LangGraph, AutoGen, etc.)
- Relevant GitHub repos and stars
- HackerNews AI discussions
- Selected research papers (arxiv)
- Developer newsletters (e.g. The Batch, Last Week in AI)

## What it produces

Structured idea records written to `mcp-ideas` MCP server:

```json
{
  "id": "uuid",
  "title": "Build a private MCP server for project notes",
  "source": "Anthropic blog post — 2026-06-14",
  "category": "MCP",
  "difficulty": "medium",
  "whyNow": "Remote MCP and tool-connected agents are becoming important",
  "buildTime": "2-day demo",
  "demoPossible": true,
  "coursePossible": true,
  "consultingRelevance": "Shows capability in agent-tool architecture",
  "status": "idea",
  "createdAt": "2026-06-14T00:00:00Z"
}
```

## Design

- Uses LangGraph for the workflow loop
- LiteLLM for LLM calls (provider-agnostic)
- Langfuse for run observability and cost tracking
- Writes output via `mcp-ideas` MCP server
- Runs on a schedule (daily or weekly) — not continuously

## Safety rules

- Read-only access to web sources
- Writes only to the ideas backlog (via MCP), not to content/blog
- Budget limit: $X per run. Stops and alerts if exceeded.
- All runs logged to Langfuse with full trace

## Setup (future)

```bash
cd agents/research-agent
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```
