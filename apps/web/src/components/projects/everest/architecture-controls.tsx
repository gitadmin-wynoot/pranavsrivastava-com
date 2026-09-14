"use client";

import type { Architecture } from "./types";
import s from "./everest-simulator.module.css";

type Props = { architecture: Architecture; onChange: (patch: Partial<Architecture>, reason: string) => void };
type NumberKey = { [K in keyof Architecture]: Architecture[K] extends number ? K : never }[keyof Architecture];
type BooleanKey = { [K in keyof Architecture]: Architecture[K] extends boolean ? K : never }[keyof Architecture];

export function ArchitectureControls({ architecture: a, onChange }: Props) {
  function range(key: NumberKey, label: string, min: number, max: number, step: number, help: string, unit = "") {
    return <label className={s.rangeField} key={key}><span>{label}<output>{a[key].toLocaleString()}{unit}</output></span><input type="range" min={min} max={max} step={step} value={a[key]} onChange={e => onChange({ [key]: Number(e.target.value) }, `${label}: ${e.target.value}${unit}. ${help}`)} aria-label={label} /><small>{help}</small></label>;
  }
  function toggle(key: BooleanKey, label: string, help: string) {
    return <label className={s.toggleField} key={key}><span><strong>{label}</strong><small>{help}</small></span><input type="checkbox" checked={a[key]} onChange={e => onChange({ [key]: e.target.checked }, `${label} ${e.target.checked ? "enabled" : "disabled"}. ${help}`)} /></label>;
  }
  return <div className={s.labControls}>
    <p className={s.muted}>Change a setting and watch the same 1,000 requests traverse the mountain. Values are teaching estimates, not benchmarks.</p>
    <details open><summary>01 / Models & agents</summary>
      <label className={s.selectField}>Model tier<select value={a.modelTier} onChange={e => onChange({ modelTier: e.target.value as Architecture["modelTier"] }, "Model tier changes reasoning quality, latency and inference cost.")}><option value="small">Small / fast</option><option value="medium">Medium / balanced</option><option value="large">Large / reasoning</option></select><small>A larger model costs more and takes longer on each call.</small></label>
      {toggle("routingEnabled", "Complexity-aware routing", "Send simple work to a fast model; reserve reasoning capacity for difficult tasks.")}
      {range("agentCount", "Agents", 1, 8, 1, "Specialists help, but each adds coordination and calls.")}
      {range("parallelism", "Parallel tasks", 1, 8, 1, "Independent tools run together; dependent steps still wait.")}
      {range("maxAgentSteps", "Agent step limit", 3, 40, 1, "Bound repeated planning and tool calls.")}
      {toggle("loopDetection", "Loop detection", "Stop repeated delegation when no new evidence arrives.")}
    </details>
    <details><summary>02 / Context & retrieval</summary>
      {range("contextTokens", "Context tokens", 1000, 32000, 1000, "A heavy backpack costs time and can bury relevant evidence.")}
      {range("retrievalTopK", "Retrieved chunks / top-k", 1, 12, 1, "Too few chunks miss evidence; too many add noise.")}
      {toggle("cacheEnabled", "Response cache", "Reuse a result when the request and freshness policy allow it.")}
      {toggle("semanticCacheEnabled", "Semantic cache", "Reuse similar requests; validate that the meaning really matches.")}
      {toggle("promptCacheEnabled", "Prompt cache", "Reuse common model input prefixes to reduce processing work.")}
      {range("cacheTtlSeconds", "Cache lifetime", 30, 600, 30, "Longer lifetimes improve reuse but risk stale evidence.", " s")}
      {toggle("freshnessValidation", "Freshness checks", "Reject stale external evidence and downgrade confidence.")}
    </details>
    <details><summary>03 / Traffic & capacity</summary>
      {range("requestsPerSecond", "Arrival rate", 1, 100, 1, "Demand beyond service capacity creates waiting requests.", " /s")}
      {range("concurrency", "Concurrent workers", 2, 64, 2, "Workers help until a downstream resource becomes the limit.")}
      {range("queueSize", "Queue capacity", 10, 500, 10, "A bounded queue absorbs bursts; a large queue adds waiting time.")}
      {range("rateLimit", "Admission limit", 2, 100, 2, "Excess arrivals are rejected, protecting workers but reducing completion.", " /s")}
    </details>
    <details><summary>04 / Failure & recovery</summary>
      {range("toolTimeoutMs", "Tool timeout", 500, 10000, 500, "Stop a stalled dependency before it occupies all workers.", " ms")}
      {range("modelTimeoutMs", "Model timeout", 1000, 30000, 1000, "Bound model waits; too short can reject useful reasoning.", " ms")}
      {range("retries", "Retry attempts", 0, 5, 1, "Retries help transient errors but amplify sustained failure.")}
      <label className={s.selectField}>Retry strategy<select value={a.retryStrategy} onChange={e => onChange({ retryStrategy: e.target.value as Architecture["retryStrategy"] }, "Backoff spaces retry attempts so a failing service has time to recover.")}><option value="immediate">Immediate</option><option value="backoff">Exponential backoff + jitter</option></select></label>
      {toggle("circuitBreakerEnabled", "Circuit breaker", "Temporarily close a repeatedly failing route.")}
      {toggle("fallbackEnabled", "Fallback model / path", "Preserve useful service with an explicit quality downgrade.")}
      {toggle("mcpRedundancy", "MCP server redundancy", "Use a separate fixture dependency when the primary fails.")}
    </details>
    <details><summary>05 / Policy & budgets</summary>
      <label className={s.selectField}>Tool permissions<select value={a.toolPermissions} onChange={e => onChange({ toolPermissions: e.target.value as Architecture["toolPermissions"] }, "Tool authority is enforced by policy outside model reasoning.")}><option value="read-only">Read only</option><option value="least-privilege">Least privilege</option><option value="unrestricted">Unrestricted / demonstrate risk</option></select></label>
      {toggle("humanApproval", "Human approval", "Pause high-impact operations for an explicit decision.")}
      {toggle("validateToolOutputs", "Schema validation", "Reject malformed arguments and tool results.")}
      {toggle("idempotencyEnabled", "Idempotency keys", "A retry of the same mutation must not apply it twice.")}
      {range("tokenBudget", "Token budget / request", 4000, 100000, 4000, "Stop runaway generation before it consumes the whole budget.")}
      {range("costBudget", "Cost budget / 1,000 requests", 5, 100, 5, "This is simulated AI cost, not a bill or provider price.", " USD")}
    </details>
  </div>;
}
