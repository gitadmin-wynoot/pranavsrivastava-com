# llm-gateway

**Status:** Planned (Phase 4)
**Language:** TypeScript (for the web app) + Python proxy (LiteLLM)

## Purpose

The LLM abstraction layer. Everything that calls a language model in this project goes through this package.

The goal: change provider (Claude → Gemini → GPT → Ollama) by changing one config value, not by rewriting code.

## How it works

### TypeScript package (for Next.js API routes)

```typescript
import { llmGateway } from '@pranav/llm-gateway'

const result = await llmGateway.generate({
  modelPolicy: 'default',  // resolved from env config
  messages: [
    { role: 'user', content: 'Hello' }
  ],
  metadata: {
    agentName: 'research-agent',
    task: 'summarise-ai-news',
  }
})
```

### Python proxy (LiteLLM — for agents)

Run locally with Docker:

```bash
cd infra/docker
docker compose up litellm -d
```

The proxy runs on `http://localhost:4000` and routes to whichever provider is configured.

```python
from litellm import completion

# Uses whatever the LITELLM_BASE_URL and LITELLM_API_KEY env vars point to
response = completion(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Hello"}]
)
```

## Model policies

```typescript
type ModelPolicy =
  | 'default'       // cheapest model that handles the task
  | 'fast'          // optimised for latency
  | 'powerful'      // best quality, higher cost
  | 'local'         // local Ollama model only
```

## Observability

All calls through this gateway are automatically logged to Langfuse with:
- Provider and model name
- Input and output token counts
- Estimated cost
- Latency
- Agent name and task (from metadata)
