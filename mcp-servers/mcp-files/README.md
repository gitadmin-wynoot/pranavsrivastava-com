# mcp-files

**Status:** Planned (Phase 5)
**Language:** Python
**Transport:** stdio (local only)

## Purpose

Controlled file access MCP server. Gives AI tools (Claude Code, agents) read and write access to specific allowed paths only.

This is the primary way agents write blog post drafts, course outlines, and project notes.

## Allowed paths (whitelist)

```
apps/web/content/blog/     ← agent can write draft MDX posts
apps/web/content/courses/  ← agent can write course outlines
apps/web/content/projects/ ← agent can write project notes
```

No access to anything outside these paths.

## Tools exposed

| Tool | Access | Description |
|------|--------|-------------|
| `read_file` | whitelisted paths | Read any file in allowed paths |
| `list_files` | whitelisted paths | List files in a directory |
| `write_file` | whitelisted paths | Write a file (creates if missing) |
| `append_to_file` | whitelisted paths | Append content to a file |

## Security

- Strict path whitelist — any path outside the allowed list is rejected
- No shell execution
- No access to `.env` files, credentials, or system paths
- All tool calls logged with path, operation, and byte count
- stdio only — never exposed over HTTP

## Why this matters

Agents should not have direct filesystem access. This server is the controlled interface through which they interact with content. If an agent tries to read a file outside the whitelist, the tool returns an error and the attempt is logged.
