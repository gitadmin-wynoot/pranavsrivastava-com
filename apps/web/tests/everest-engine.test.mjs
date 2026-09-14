import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Execute the actual engine with the workspace compiler; no extra test dependency.
// `package.json` wires this up as `pnpm test:everest` alongside everest-mcp.test.mjs.
const source = readFileSync(new URL("../src/components/projects/everest/engine.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const engine = {};
new Function("exports", compiled.outputText)(engine);
const { createRandom, DEFAULT_ARCHITECTURE, normalizeArchitecture, simulate } = engine;

test("createRandom is deterministic per seed, produces [0,1) values, and diverges across seeds", () => {
  const a = createRandom(7); const b = createRandom(7); const c = createRandom(8);
  const seqA = Array.from({ length: 20 }, () => a());
  const seqB = Array.from({ length: 20 }, () => b());
  const seqC = Array.from({ length: 20 }, () => c());
  assert.deepEqual(seqA, seqB);
  assert.notDeepEqual(seqA, seqC);
  for (const value of seqA) assert.ok(value >= 0 && value < 1, `${value} out of range`);
});

test("normalizeArchitecture clamps out-of-range numeric fields into their documented bounds", () => {
  const a = normalizeArchitecture({ agentCount: 999, parallelism: -5, retries: 40, queueSize: -10, tokenBudget: 1 });
  assert.equal(a.agentCount, 8);
  assert.equal(a.parallelism, 1);
  assert.equal(a.retries, 5);
  assert.equal(a.queueSize, 0);
  assert.equal(a.tokenBudget, 1000);
});

test("normalizeArchitecture falls back invalid enum and non-boolean fields to safe defaults", () => {
  const a = normalizeArchitecture({ modelTier: "huge", toolPermissions: "root", retryStrategy: "yolo", adaptation: "magic", cacheEnabled: "yes", humanApproval: null });
  assert.equal(a.modelTier, "medium");
  assert.equal(a.toolPermissions, "least-privilege");
  assert.equal(a.retryStrategy, "backoff");
  assert.equal(a.adaptation, "foundation");
  assert.equal(a.cacheEnabled, DEFAULT_ARCHITECTURE.cacheEnabled);
  assert.equal(a.humanApproval, DEFAULT_ARCHITECTURE.humanApproval);
});

test("simulate() is a pure, reproducible function of its inputs", () => {
  const first = simulate(DEFAULT_ARCHITECTURE, 123, null, "beginner");
  const second = simulate(DEFAULT_ARCHITECTURE, 123, null, "beginner");
  assert.deepEqual(first, second);
  const third = simulate(DEFAULT_ARCHITECTURE, 124, null, "beginner");
  assert.notDeepEqual(first.p95, third.p95, "a different seed should perturb the jittered result");
});

test("every returned metric stays inside its documented, bounded range across many random architectures", () => {
  const rng = createRandom(99);
  for (let i = 0; i < 40; i++) {
    const arch = normalizeArchitecture({
      modelTier: ["small", "medium", "large"][Math.floor(rng() * 3)],
      agentCount: Math.ceil(rng() * 8), concurrency: Math.ceil(rng() * 64), parallelism: Math.ceil(rng() * 8),
      retries: Math.floor(rng() * 6), requestsPerSecond: Math.ceil(rng() * 100), contextTokens: Math.ceil(rng() * 32000),
      tokenBudget: 4000 + Math.ceil(rng() * 100000), costBudget: 1 + rng() * 99,
    });
    const incident = rng() < 0.3 ? null : ["mcp-timeout", "agent-loop", "traffic-surge", "cost-runaway"][Math.floor(rng() * 4)];
    const m = simulate(arch, Math.floor(rng() * 1e9), incident, "engineer");
    assert.ok(m.p50 > 0 && m.p95 >= m.p50, `p50/p95 ordering violated: ${m.p50} / ${m.p95}`);
    assert.ok(m.reliability >= 0 && m.reliability <= 100);
    assert.ok(m.quality >= 0 && m.quality <= 100);
    assert.ok(m.safety >= 0 && m.safety <= 100);
    assert.ok(m.costPerRequest >= 0);
    assert.ok(Number.isFinite(m.p95) && Number.isFinite(m.tokens));
    assert.equal(m.slo.passed, m.slo.latency && m.slo.reliability && m.slo.cost && m.slo.quality && m.slo.safety);
  }
});

test("the request trace is a well-formed waterfall covering every simulated stage", () => {
  const m = simulate(DEFAULT_ARCHITECTURE, 5, null, "beginner");
  const ids = m.traces.map((span) => span.id);
  assert.deepEqual(ids, ["queue", "router", "retrieval", "model", "weather", "route", "logistics", "validation"]);
  for (const span of m.traces) {
    assert.ok(span.start >= 0, `${span.id} has a negative start`);
    assert.ok(span.duration >= 0, `${span.id} has a negative duration`);
  }
  assert.ok(m.traces.some((span) => span.name === m.bottleneck), "the reported bottleneck must be one of the sampled spans");
});

test("an unmitigated traffic surge misses both the latency and success objectives", () => {
  const m = simulate(DEFAULT_ARCHITECTURE, 42, "traffic-surge", "beginner");
  assert.equal(m.slo.latency, false, `expected p95 (${m.p95} ms) to miss the 3s objective under a 4x surge with default capacity`);
  assert.equal(m.slo.passed, false);
  assert.ok(m.queueDepth > 0, "a 4x surge against unchanged capacity should visibly queue");
});

test("recovery controls measurably improve reliability during a weather MCP timeout", () => {
  const fragile = normalizeArchitecture({ circuitBreakerEnabled: false, fallbackEnabled: false, retries: 5, retryStrategy: "immediate" });
  const resilient = normalizeArchitecture({ circuitBreakerEnabled: true, fallbackEnabled: true, freshnessValidation: true, retries: 1, retryStrategy: "backoff" });
  const before = simulate(fragile, 10, "mcp-timeout", "beginner");
  const after = simulate(resilient, 10, "mcp-timeout", "beginner");
  assert.ok(after.reliability > before.reliability, `circuit breaker + fallback (${after.reliability}) should beat immediate retries (${before.reliability})`);
});

test("a permission boundary plus approval fully contains a prompt-injection attempt; removing it does not", () => {
  const contained = normalizeArchitecture({ toolPermissions: "least-privilege", humanApproval: true, validateToolOutputs: true });
  const exposed = normalizeArchitecture({ toolPermissions: "unrestricted", humanApproval: false, validateToolOutputs: false });
  const safe = simulate(contained, 3, "prompt-injection", "beginner");
  const unsafe = simulate(exposed, 3, "prompt-injection", "beginner");
  assert.equal(safe.safety, 100);
  assert.ok(unsafe.safety < safe.safety, `unrestricted permissions (${unsafe.safety}) should score below an enforced boundary (${safe.safety})`);
});

test("an idempotency key prevents the safety penalty a duplicate reservation retry would otherwise cause", () => {
  const withKey = normalizeArchitecture({ idempotencyEnabled: true, retries: 1 });
  const withoutKey = normalizeArchitecture({ idempotencyEnabled: false, retries: 1 });
  const deduped = simulate(withKey, 6, "duplicate-action", "beginner");
  const duplicated = simulate(withoutKey, 6, "duplicate-action", "beginner");
  assert.ok(duplicated.safety < deduped.safety, `a retried mutation without an idempotency key (${duplicated.safety}) must score below one with a key (${deduped.safety})`);
});

test("an exhausted token budget is flagged and reduces reliability rather than silently overspending", () => {
  const starved = normalizeArchitecture({ tokenBudget: 1000, contextTokens: 32000, agentCount: 8 });
  const m = simulate(starved, 11, null, "beginner");
  assert.equal(m.budgetExhausted, true);
  assert.ok(m.reliability < 99.45, "a bounded budget should visibly retain fewer requests than the healthy baseline");
});
