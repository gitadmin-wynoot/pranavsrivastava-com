# mcp-ideas

**Status:** Planned (Phase 5)
**Language:** Python
**Transport:** stdio (local only)

## Purpose

MCP server for reading and writing the idea backlog. This is how agents communicate their research findings to the system, and how Pranav reviews and manages what gets built next.

## Tools exposed

| Tool | Description |
|------|-------------|
| `list_ideas` | List all ideas with optional status filter |
| `get_idea` | Get a specific idea by ID |
| `add_idea` | Add a new idea (used by research agent) |
| `update_idea_status` | Update status: idea → approved → building → done |
| `get_ideas_by_category` | Filter ideas by category |

## Data storage

Ideas are stored as JSON files in a local directory. Simple, readable, portable.

```
mcp-servers/mcp-ideas/data/
  ideas/
    <id>.json
  index.json
```

## Security

- Read tools: no restrictions
- Write tools (`add_idea`, `update_idea_status`): only callable by agents with the correct local client
- No network exposure — stdio only
- All tool calls logged

## Setup (future)

```bash
cd mcp-servers/mcp-ideas
python -m venv .venv
source .venv/bin/activate
pip install mcp
python server.py
```

Connect in Claude Code:
```json
{
  "mcpServers": {
    "ideas": {
      "command": "python",
      "args": ["mcp-servers/mcp-ideas/server.py"]
    }
  }
}
```
