import type { Architecture, Difficulty, Metrics, TraceSpan } from "./types";

export const DEFAULT_ARCHITECTURE: Architecture = {
  modelTier: "medium", routingEnabled: false, agentCount: 4, concurrency: 16, parallelism: 1,
  requestsPerSecond: 8, contextTokens: 6000, retrievalTopK: 4, cacheEnabled: false,
  semanticCacheEnabled: false, promptCacheEnabled: false, cacheTtlSeconds: 300,
  freshnessValidation: false, toolTimeoutMs: 8000, modelTimeoutMs: 12000,
  retries: 2, retryStrategy: "immediate", circuitBreakerEnabled: false, queueSize: 100,
  rateLimit: 40, fallbackEnabled: false, mcpRedundancy: false,
  toolPermissions: "least-privilege", humanApproval: true, validateToolOutputs: true,
  idempotencyEnabled: false, maxAgentSteps: 20, loopDetection: false,
  tokenBudget: 32000, costBudget: 10, rolloutPercent: 5, adaptation: "foundation",
};

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, Number.isFinite(value) ? value : low));
const round = (value: number, digits = 0) => Number(value.toFixed(digits));

/** A small seeded PRNG shared by the simulation and the live-expedition ticker, so a seed replays identically everywhere. */
export function createRandom(seed: number) {
  let state = (Number.isFinite(seed) ? seed : 42) >>> 0;
  return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
}

/** Safe boundaries also apply to architecture state restored from browser storage. */
export function normalizeArchitecture(input: Partial<Architecture>): Architecture {
  const a = { ...DEFAULT_ARCHITECTURE, ...input };
  const limits: Partial<Record<keyof Architecture, [number, number]>> = {
    agentCount: [1, 8], concurrency: [1, 64], parallelism: [1, 8], requestsPerSecond: [1, 100],
    contextTokens: [500, 32000], retrievalTopK: [0, 12], cacheTtlSeconds: [0, 3600],
    toolTimeoutMs: [0, 30000], modelTimeoutMs: [0, 60000], retries: [0, 5], queueSize: [0, 1000],
    rateLimit: [1, 100], maxAgentSteps: [1, 40], tokenBudget: [1000, 128000], costBudget: [.1, 100], rolloutPercent: [5, 100],
  };
  for (const [key, range] of Object.entries(limits)) {
    const k = key as keyof Architecture;
    Object.assign(a, { [k]: round(clamp(Number(a[k]), range[0], range[1])) });
  }
  a.costBudget = clamp(Number(input.costBudget ?? DEFAULT_ARCHITECTURE.costBudget), .1, 100);
  for (const [key, value] of Object.entries(DEFAULT_ARCHITECTURE)) {
    if (typeof value === "boolean") Object.assign(a, { [key]: typeof a[key as keyof Architecture] === "boolean" ? a[key as keyof Architecture] : value });
  }
  if (!["small", "medium", "large"].includes(a.modelTier)) a.modelTier = "medium";
  if (!["foundation", "lora", "full-finetune"].includes(a.adaptation)) a.adaptation = "foundation";
  if (!["read-only", "least-privilege", "unrestricted"].includes(a.toolPermissions)) a.toolPermissions = "least-privilege";
  if (!["immediate", "backoff"].includes(a.retryStrategy)) a.retryStrategy = "backoff";
  return a;
}

/** A seeded, relative teaching model, not measurements or provider pricing.
 * A snapshot represents 1,000 requests at the selected arrival rate. Independent
 * weather/route/logistics calls share a parallel work pool; final validation stays ordered.
 * Queues absorb a finite burst and cannot increase sustainable throughput.
 */
export function simulate(input: Architecture, seed = 42, incidentId: string | null = null, difficulty: Difficulty = "beginner"): Metrics {
  const a = normalizeArchitecture(input);
  const random = createRandom(seed);
  const jitter = .97 + random() * .06;
  const severity = difficulty === "architect" ? 1.35 : difficulty === "engineer" ? 1.15 : 1;
  const explanations: string[] = [];
  const is = (...ids: string[]) => incidentId !== null && ids.includes(incidentId);
  const cacheHitRate = clamp((a.cacheEnabled ? 32 : 0) + (a.semanticCacheEnabled ? 15 : 0), 0, 65);
  const cacheMiss = 1 - cacheHitRate / 100;
  const modelBase = { small: 320, medium: 650, large: 1150 }[a.modelTier];
  const price = { small: .00000014, medium: .00000048, large: .0000012 }[a.modelTier];
  let context = a.contextTokens;
  if (is("context-overload") && (!a.freshnessValidation || a.retrievalTopK > 6)) context = Math.min(32000, context * 2);
  let steps = 3 + Math.max(0, a.agentCount - 3);
  if (is("agent-loop")) steps = a.loopDetection ? 5 : a.maxAgentSteps;
  steps = Math.min(a.maxAgentSteps, steps);
  let modelMs = modelBase * (1 + context / 12000) * (a.routingEnabled ? .67 : 1) * (a.promptCacheEnabled ? .83 : 1) * jitter;
  let coordinationMs = Math.max(0, a.agentCount - 2) * 65 + Math.max(0, a.agentCount - 4) ** 2 * 65;
  if (is("agent-loop")) coordinationMs += Math.max(0, steps - 5) * modelMs;
  let weatherMs = 420 * jitter;
  let routeMs = 220 + a.retrievalTopK * 17;
  const logisticsMs = 180;
  let retrievalMs = a.retrievalTopK ? 90 + a.retrievalTopK * 22 : 0;
  let reliability = 99.45 + (a.retryStrategy === "backoff" ? Math.min(a.retries, 2) * .13 : 0);
  let quality = { small: 84, medium: 91, large: 96 }[a.modelTier] + (a.routingEnabled ? 2 : 0);
  quality += a.retrievalTopK >= 2 && a.retrievalTopK <= 6 ? 2 : -5;
  quality -= Math.max(0, context - 10000) / 4000;
  quality += a.adaptation === "lora" ? 1 : a.adaptation === "full-finetune" ? 2 : 0;
  let safety = a.toolPermissions === "unrestricted" ? 92 : 100;
  if (!a.validateToolOutputs) safety -= 3;
  if (!a.humanApproval) safety -= 3;
  let failureRate = .45;
  let circuitOpen = false;
  let degraded = false;
  let retryMultiplier = 1 + a.retries * .018;
  let loadMultiplier = is("traffic-surge", "queue-overload") ? 4 * severity : 1;
  let capacityFactor = 1;
  let weatherStatus: TraceSpan["status"] = "ok";
  let routeStatus: TraceSpan["status"] = "ok";

  if (is("mcp-timeout", "slow-dependency", "cascading-failure")) {
    const failing = !is("slow-dependency");
    const observed = (failing ? 15000 : 5400) * severity;
    const deadline = a.toolTimeoutMs === 0 ? observed : Math.min(observed, a.toolTimeoutMs);
    circuitOpen = failing && a.circuitBreakerEnabled;
    degraded = (circuitOpen || deadline < observed) && (a.fallbackEnabled || a.mcpRedundancy);
    weatherMs = a.mcpRedundancy ? 620 : circuitOpen ? 120 : deadline;
    if (!circuitOpen && !a.mcpRedundancy) weatherMs *= 1 + a.retries * (a.retryStrategy === "backoff" ? .23 : .8);
    failureRate = a.mcpRedundancy ? .8 : degraded ? 1.6 : failing ? 34 : deadline < observed ? 20 : .8;
    reliability -= a.mcpRedundancy ? .3 : degraded ? .35 : failing ? 33 : deadline < observed ? 19 : 0;
    if (degraded && !a.mcpRedundancy) quality -= a.freshnessValidation ? 2 : 8;
    retryMultiplier += circuitOpen || a.mcpRedundancy ? .02 : a.retries * (a.retryStrategy === "backoff" ? .12 : .7);
    weatherStatus = circuitOpen ? "blocked" : failing && !a.mcpRedundancy ? "error" : "slow";
    if (is("cascading-failure") && !circuitOpen) { capacityFactor = .45; loadMultiplier = 1.6; }
    explanations.push(circuitOpen ? "The circuit breaker stops repeated calls to the failed weather service. The trace includes one sampled rejected call; other requests use the fallback or fail safely." : "Weather tool waiting occupies workers. A larger model does not repair this dependency.");
    if (a.mcpRedundancy) explanations.push("A second weather server serves the request. This assumes independent server failures; a shared upstream would still be a failure domain.");
    else if (degraded) explanations.push("Fallback preserves responses with reduced confidence. Freshness validation decides whether cached evidence can support the requested action.");
  }
  if (is("provider-rate-limit")) {
    const shaped = a.retryStrategy === "backoff" && a.rateLimit <= 20;
    reliability -= shaped ? .25 : 15 * severity;
    modelMs *= shaped ? 1.25 : 2.3 + a.retries * .8;
    capacityFactor *= shaped ? .9 : .55;
    retryMultiplier += shaped ? .08 : a.retries * .5;
    if (a.routingEnabled && a.fallbackEnabled) { reliability += shaped ? .15 : 10; modelMs *= .78; }
    explanations.push(shaped ? "Admission control and bounded backoff reduce 429 amplification; retry waits still add latency." : "Immediate retries return to a throttled provider and consume the same limited quota.");
  }
  if (is("provider-outage")) {
    degraded = a.fallbackEnabled;
    reliability = a.fallbackEnabled ? 99.2 : 3;
    modelMs = a.fallbackEnabled ? 870 : Math.min(a.modelTimeoutMs || 20000, 20000) * (1 + a.retries * .5);
    quality -= a.fallbackEnabled ? 6 : 50;
    explanations.push(a.fallbackEnabled ? "An independent fallback provider restores availability, but its lower capability changes answer quality. Re-run evals for the degraded path." : "All requests depend on the unavailable provider. Queueing can defer work but cannot complete it during this outage.");
  }
  if (is("agent-loop")) {
    const stopped = a.loopDetection || a.maxAgentSteps <= 8;
    reliability -= stopped ? .4 : 16;
    explanations.push(stopped ? "Repeated delegation is stopped by duplicate-action detection or the step budget. A bounded refusal is preferable to an endless run." : "The planner keeps delegating the same unresolved task; steps, tokens and occupied worker time accumulate.");
  }
  if (is("wrong-retrieval")) {
    const checked = a.freshnessValidation && a.retrievalTopK >= 2 && a.retrievalTopK <= 6;
    quality -= checked ? 1 : 25;
    retrievalMs += checked ? 140 : 0;
    routeStatus = checked ? "ok" : "error";
    explanations.push(checked ? "Source age and relevance checks reject the stale route note and retrieve a current citation." : "The model received a wrong route note. Increasing model size cannot make that evidence trustworthy.");
  }
  if (is("prompt-injection", "unauthorized-tool")) {
    const boundary = a.toolPermissions !== "unrestricted";
    safety = boundary && a.humanApproval && a.validateToolOutputs ? 100 : boundary ? 92 : a.humanApproval ? 84 : 35;
    if (boundary) explanations.push("The external note requests a protected action, but per-tool authorisation rejects it. Retrieved text has no authority to change policy.");
    else explanations.push("The permission boundary allows an excessive capability. Agent consensus cannot authorise a protected action; enforce policy in the host and server.");
  }
  if (is("invalid-arguments", "malformed-output")) {
    safety = a.validateToolOutputs ? safety : safety - 34;
    quality -= a.validateToolOutputs ? 0 : 20;
    reliability -= a.validateToolOutputs ? .3 : 8;
    routeStatus = a.validateToolOutputs ? "blocked" : "error";
    explanations.push(a.validateToolOutputs ? "The schema validator rejects the malformed value before execution. The agent receives a structured error and can correct its call." : "Unvalidated model arguments or tool output cross the boundary and corrupt the next decision.");
  }
  if (is("duplicate-action")) {
    const duplicate = !a.idempotencyEnabled && a.retries > 0;
    safety -= duplicate ? 24 : 0;
    quality -= duplicate ? 12 : 0;
    explanations.push(a.idempotencyEnabled ? "The retry reuses an idempotency key, so the server returns the existing reservation without reserving twice." : a.retries === 0 ? "No retry means no duplicate in this run, but a lost acknowledgement remains ambiguous. An idempotency key is the durable fix." : "The first reservation succeeded before its response was lost. The retry reserves inventory again because no idempotency key identifies the original operation.");
  }
  if (is("stale-cache", "stale-catalogue")) {
    const fresh = a.freshnessValidation && a.cacheTtlSeconds <= 60;
    const affected = is("stale-catalogue") || a.cacheEnabled || a.semanticCacheEnabled;
    if (affected && !fresh) { quality -= 22; routeStatus = "cached"; }
    if (fresh) retrievalMs += 110;
    explanations.push(!affected ? "The cache is bypassed, so this request fetches current data at the normal dependency cost." : fresh ? "A short freshness budget forces refresh when the source changes. The refreshed catalogue is checked before choosing a tool." : "A fast cache hit returns outdated data or capabilities. Low latency alone does not establish correctness.");
  }
  if (is("missing-tool")) {
    degraded = a.fallbackEnabled;
    reliability -= a.fallbackEnabled ? .4 : 28;
    quality -= a.fallbackEnabled ? 4 : 12;
    routeStatus = "blocked";
    explanations.push(a.fallbackEnabled ? "Capability discovery reports the tool missing; the orchestrator chooses an available read-only workflow and explains its limitation." : "The requested tool is absent from the server catalogue. Repeating its name cannot create the capability.");
  }
  if (is("conflicting-agents")) {
    const resolved = a.humanApproval && a.validateToolOutputs;
    quality -= resolved ? 0 : 18;
    safety -= resolved ? 0 : 20;
    coordinationMs += resolved ? 450 : 260 * a.agentCount;
    explanations.push(resolved ? "The lead agent compares source freshness and confidence, then escalates a policy conflict for review." : "Extra opinions do not settle a policy conflict. The orchestrator needs a deterministic decision rule and escalation path.");
  }
  if (is("cost-runaway")) {
    retryMultiplier *= 1.3;
    explanations.push("Repeated work increases inference spend even while tools respond successfully. Cost budgets are part of the completion contract.");
  }
  if (is("context-overload")) explanations.push("Context processing grows with tokens. Relevant retrieval and a smaller retained history reduce both cost and prefill time.");
  if (is("traffic-surge", "queue-overload")) explanations.push("Arrivals rise fourfold. A bounded queue absorbs some waiting; cache hits and adequate downstream capacity determine whether it drains. Rejected requests still count against end-to-end success.");

  if (a.modelTimeoutMs > 0 && modelMs > a.modelTimeoutMs) {
    modelMs = a.modelTimeoutMs;
    reliability -= a.fallbackEnabled ? 1 : 18;
    degraded ||= a.fallbackEnabled;
    explanations.push("The model deadline cancels slow inference. A deadline protects workers, but one that is too short also cancels useful responses.");
  }
  if (a.toolTimeoutMs > 0 && a.toolTimeoutMs < 420 && !is("mcp-timeout", "slow-dependency", "cascading-failure")) {
    weatherMs = a.toolTimeoutMs; reliability -= 12; weatherStatus = "error";
    explanations.push("The tool timeout is shorter than healthy weather service latency, causing avoidable cancellations.");
  }
  if (a.maxAgentSteps < 3) { quality -= 18; reliability -= 10; explanations.push("The step limit stops the workflow before retrieval, tool work and final validation can all finish."); }
  const independent = [weatherMs, routeMs, logisticsMs];
  const lanes = Array.from({ length: Math.min(3, a.parallelism, a.agentCount) }, () => 0);
  for (const duration of independent) { const lane = lanes.indexOf(Math.min(...lanes)); lanes[lane] += duration; }
  const toolMs = Math.max(...lanes);
  const approvalMs = a.humanApproval && is("prompt-injection", "unauthorized-tool", "conflicting-agents") ? 450 : 0;
  const processingMs = 30 + retrievalMs + modelMs + coordinationMs + toolMs + 190 + approvalMs;
  const averageServiceMs = processingMs * cacheMiss + 100 * (1 - cacheMiss);
  const rawCapacity = Math.min(a.concurrency * 1000 / averageServiceMs, 28 / cacheMiss) * capacityFactor;
  const arrivals = a.requestsPerSecond * loadMultiplier;
  const admitted = Math.min(arrivals, a.rateLimit);
  const overflow = Math.max(0, admitted - rawCapacity);
  const queueDepth = Math.min(a.queueSize, Math.ceil(overflow * 8));
  const queueWait = queueDepth / Math.max(rawCapacity, .1) * 1000;
  const rejectedFraction = clamp((arrivals - admitted + Math.max(0, overflow - a.queueSize / 8)) / arrivals, 0, 1);
  reliability *= 1 - rejectedFraction;
  let p50 = averageServiceMs + queueWait * .35;
  let p95 = processingMs * (1.2 + random() * .05) + queueWait;
  const requestedTokens = Math.ceil((context + 700) * Math.max(1, steps * .42) * retryMultiplier * (a.routingEnabled ? .85 : 1) * (a.promptCacheEnabled ? .88 : 1));
  const tokens = Math.min(requestedTokens, a.tokenBudget);
  const uncappedCost = tokens * price * cacheMiss + .00016 * a.retrievalTopK + .00012 * a.agentCount * retryMultiplier;
  const budgetExhausted = requestedTokens > a.tokenBudget || uncappedCost * 1000 > a.costBudget;
  const costPerRequest = Math.min(uncappedCost, a.costBudget / 1000);
  if (budgetExhausted) {
    const retained = Math.min(1, a.tokenBudget / requestedTokens, a.costBudget / (uncappedCost * 1000));
    reliability *= Math.max(.1, retained); quality -= (1 - retained) * 18;
    explanations.push("A token or run-cost budget stops work before further spend. Spending remains bounded, while some requests end with an explicit incomplete result.");
  }
  p50 = round(clamp(p50, 80, 240000)); p95 = round(clamp(Math.max(p50, p95), 100, 300000));
  reliability = round(clamp(reliability, 0, 100), 2); quality = round(clamp(quality, 0, 100), 1); safety = round(clamp(safety, 0, 100), 1);
  const traces: TraceSpan[] = [];
  const add = (id: string, name: string, stageId: TraceSpan["stageId"], start: number, duration: number, status: TraceSpan["status"], detail: string) => traces.push({ id, name, stageId, start: round(start), duration: round(duration), status, detail });
  let cursor = 0;
  add("queue", "Gateway queue", "icefall", cursor, queueWait, queueDepth ? "slow" : "ok", `${queueDepth} requests waiting; ${round(arrivals, 1)} arrivals/s, ${round(rawCapacity, 1)} sustainable requests/s.`); cursor += queueWait;
  add("router", "Gateway / model router", "base", cursor, 30, "ok", a.routingEnabled ? "Simple tasks take the fast route; complex tasks retain the selected model tier." : `All model tasks use the ${a.modelTier} tier.`); cursor += 30;
  add("retrieval", "Retrieve route evidence", "camp1", cursor, retrievalMs, routeStatus, `${a.retrievalTopK} chunks; ${context} context tokens; ${a.freshnessValidation ? "source checks enabled" : "source freshness unchecked"}.`); cursor += retrievalMs;
  add("model", "Lead Sherpa / model", "camp2", cursor, modelMs + coordinationMs, modelMs > 2500 ? "slow" : "ok", `${a.agentCount} agents, ${steps} steps; the model consumes tokens separately from the tool dependency.`); cursor += modelMs + coordinationMs;
  const offsets = Array.from({ length: lanes.length }, () => cursor);
  for (const [i, name] of ["Weather MCP · get_current_weather", "Route MCP · get_route_status", "Logistics MCP · check_inventory"].entries()) {
    const lane = offsets.indexOf(Math.min(...offsets));
    add(["weather", "route", "logistics"][i], name, "camp3", offsets[lane], independent[i], i === 0 ? weatherStatus : i === 1 ? routeStatus : "ok", i === 0 ? `Timeout ${a.toolTimeoutMs || "disabled"} ms; ${a.retries} retries with ${a.retryStrategy}; circuit ${circuitOpen ? "open" : "closed"}.` : "Read-only request with sanitised arguments. Independent work may run concurrently.");
    offsets[lane] += independent[i];
  }
  cursor = Math.max(...offsets);
  add("validation", "Policy / output validation", "camp4", cursor, 190 + approvalMs, safety < 95 ? "error" : "ok", `${a.toolPermissions} permissions; schema checks ${a.validateToolOutputs ? "on" : "off"}; high-impact approval ${a.humanApproval ? "required" : "disabled"}.`);
  const bottleneckSpan = [...traces].sort((x, y) => y.duration - x.duration)[0];
  explanations.push(`The longest sampled span is ${bottleneckSpan.name} (${bottleneckSpan.duration} ms). The waterfall is one cache-miss request; p50 and p95 describe the simulated cohort.`);
  if (a.parallelism > 1) explanations.push("Independent weather, route and inventory calls overlap; the final policy check still waits for their results.");
  if (a.agentCount > 4) explanations.push("Additional agents add model handoffs and coordination without improving this task's quality.");
  if (cacheHitRate > 0) explanations.push(`${cacheHitRate}% of requests bypass repeated work through data or semantic cache hits. Prompt caching reduces input processing but does not reuse the final answer.`);
  const slo = { latency: p95 < 3000, reliability: reliability >= 99, cost: costPerRequest < .01 && !budgetExhausted, quality: quality >= 90, safety: safety === 100, passed: false };
  slo.passed = slo.latency && slo.reliability && slo.cost && slo.quality && slo.safety;
  return { p50, p95, throughput: round(Math.min(admitted, rawCapacity) * reliability / 100, 1), reliability,
    costPerRequest: round(costPerRequest, 6), quality, safety, queueDepth, tokens, cacheHitRate,
    toolFailureRate: round(clamp(failureRate, 0, 100), 2), errorRate: round(100 - reliability, 2), attempted: 1000,
    completed: Math.round(reliability * 10), rejected: Math.round(rejectedFraction * 1000), requestsPerSecond: round(arrivals, 1), steps,
    totalCost: round(costPerRequest * 1000, 3), bottleneck: bottleneckSpan.name, circuitOpen, degraded, budgetExhausted, explanations, traces, slo };
}
