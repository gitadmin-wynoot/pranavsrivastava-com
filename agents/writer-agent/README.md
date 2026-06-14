# Writer Agent

**Status:** Planned (Phase 6)
**Language:** Python
**Framework:** LangGraph

## Purpose

Turns research notes and build logs into draft blog posts, course outlines, and video scripts.

This agent does not publish. It drafts. Pranav reviews and edits before anything goes live.

## Inputs

- Idea records from `mcp-ideas` MCP server
- Build logs and notes from `mcp-files` MCP server
- Specific topic or project provided as prompt

## Outputs

- Draft MDX blog post written to `apps/web/content/blog/`
- Draft course outline written to `apps/web/content/courses/`
- Video script outline (plain text)

All drafts have `published: false` in frontmatter until manually reviewed.

## Safety rules

- Writes only to draft files (`published: false`)
- Never publishes directly — human approval required
- All runs logged to Langfuse
- Budget limit per task: $X
