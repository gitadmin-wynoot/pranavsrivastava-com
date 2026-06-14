# Agent Safety Rules

These rules apply to every agent, MCP server, and AI-connected tool in this system.

---

## Non-negotiable rules

**Never commit secrets.**
API keys, passwords, and credentials must never appear in git. Use `.env.local` for real values. Only `.env.example` (with empty values) goes in the repo.

**No public shell MCP server.**
Any MCP server with shell execution (`subprocess`, `os.system`, etc.) runs locally only via stdio. It must never be exposed over HTTP or accessible from outside the local machine.

**No production deploys without human approval.**
Agents may prepare deployments (build, package, create a PR) but never trigger `git push` to main or `vercel deploy --prod` without explicit human approval in the loop.

**No broad IAM permissions for agents.**
Any AWS role used by an agent has only the permissions it actually needs. No `AdministratorAccess`. No `*` resource policies.

**Log everything.**
Every agent run logs: agent name, task, model, provider, input tokens, output tokens, cost, status, tool calls. Minimum logging target: Langfuse.

---

## Budget rules

Every agent task has a maximum token budget. When the budget is reached:

1. The agent stops.
2. The partial result is saved.
3. A notification is logged (or sent, once that is wired up).
4. Human approval is required to continue.

Default budget: 50,000 tokens per task. Adjust per agent in the agent config.

---

## Data exposure rules

**Private data stays private.**
The Second Brain admin layer, personal notes, client information, and draft content must not surface in public pages or API responses.

**Public MCP = read-only + filtered.**
If any MCP server is ever exposed publicly (via Cloudflare Access or Tailscale), it must be read-only and must never expose personal, financial, or credential data.

---

## Tool call rules

Tools that take actions in the world (write files, send emails, push to GitHub, deploy to cloud) require explicit confirmation in the agent workflow.

The pattern:
```
propose action → log proposed action → await human confirmation → execute → log result
```

Tools that only read (list files, query status, fetch URLs) can run without confirmation, but must still be logged.

---

## Error handling rules

Agents must handle errors gracefully:

- API errors → retry with backoff (max 3 attempts), then fail gracefully
- Tool errors → log error with full context, continue with partial result if possible
- Budget exceeded → stop, save state, request approval
- Unexpected content → log and skip, never crash the whole run

---

## Review checklist for adding new MCP tools

Before adding a new tool to any MCP server:

- [ ] Is this the minimum access needed?
- [ ] Is the output sanitised before returning?
- [ ] Is every call logged?
- [ ] Can this tool cause irreversible damage? If yes, add approval gate.
- [ ] Is this tool accessible over the network? If yes, is auth in place?
