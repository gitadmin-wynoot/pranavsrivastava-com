import { SCENARIOS, STAGES } from "./content";
import type { DecisionRecord, ExpeditionReport, Metrics, ReportInput, ReportSection } from "./types";

const money = (n: number) => `$${n.toFixed(4)}`;
const seconds = (n: number) => `${(n / 1000).toFixed(2)} s`;
const clock = (n: number) => { const s = Math.max(0, Math.floor(n)); return `T+${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
const delta = (before: Metrics, after: Metrics) => `p95 ${seconds(before.p95)} → ${seconds(after.p95)}; success ${before.reliability.toFixed(2)}% → ${after.reliability.toFixed(2)}%; quality ${before.quality} → ${after.quality}; safety ${before.safety} → ${after.safety}; cost/request ${money(before.costPerRequest)} → ${money(after.costPerRequest)}.`;
const gain = (d: DecisionRecord) => (d.before.p95 - d.after.p95) / 500 + (d.after.reliability - d.before.reliability) * 2 + (d.after.quality - d.before.quality) + (d.after.safety - d.before.safety) * 2 + (d.before.costPerRequest - d.after.costPerRequest) * 1000;
const metricsText = (m: Metrics) => [
  `| Measure | Simulated result |`, `| --- | --- |`,
  `| Requests attempted / completed | ${m.attempted} / ${m.completed} |`,
  `| Success / admission rejections | ${m.reliability.toFixed(2)}% / ${m.rejected} |`,
  `| p50 / p95 latency | ${seconds(m.p50)} / ${seconds(m.p95)} |`,
  `| Throughput / arrival rate | ${m.throughput} / ${m.requestsPerSecond} requests/s |`,
  `| Queue depth | ${m.queueDepth} |`,
  `| Quality / system safety | ${m.quality}/100 / ${m.safety}/100 |`,
  `| Cost/request / cohort spend | ${money(m.costPerRequest)} / $${m.totalCost.toFixed(3)} |`,
  `| Tokens/request / agent steps | ${m.tokens} / ${m.steps} |`,
  `| Tool failure rate / cache hit rate | ${m.toolFailureRate}% / ${m.cacheHitRate}% |`,
].join("\n");

function packageReport(title: string, summary: string, sections: ReportSection[]): ExpeditionReport {
  return { title, summary, sections, markdown: `# ${title}\n\n${summary}\n\n${sections.map(s => `## ${s.title}\n\n${s.body}`).join("\n\n")}\n\n---\n\nAll metrics are deterministic educational estimates, not measurements of a live AI system. This Everest metaphor is not expedition safety guidance.\n` };
}

function recommendations(input: ReportInput): string[] {
  const a = input.architecture;
  const items: string[] = [];
  if (!a.routingEnabled) items.push("Evaluate complexity routing so simple tasks use the faster model path while complex tasks retain the selected tier.");
  if (a.parallelism < 3) items.push("Overlap independent weather, route and inventory calls, then keep the final policy check ordered after their results.");
  if (a.contextTokens > 6000 || a.retrievalTopK > 6) items.push("Reduce retained context and tune retrieval to a small, relevant top-k; keep the evidence and provenance required by the task.");
  if (!a.circuitBreakerEnabled || a.retryStrategy === "immediate") items.push("Assign dependency deadlines and bounded backoff, and open a circuit after repeated failure so workers can serve other work.");
  if (!a.fallbackEnabled) items.push("Evaluate a fallback path with its own quality and freshness requirements; return a qualified failure where the available evidence is insufficient.");
  if (!a.freshnessValidation || a.cacheTtlSeconds > 60) items.push("Apply source freshness checks and a short validity window to changing data; invalidate cached tool catalogues when their contract changes.");
  if (a.toolPermissions === "unrestricted" || !a.humanApproval || !a.validateToolOutputs) items.push("Enforce role scopes and input/output validation outside the model, with approval bound to each exact high-impact request.");
  if (!a.idempotencyEnabled) items.push("Give each mutating operation a stable idempotency key and persist its result atomically before acknowledging it.");
  if (a.agentCount > 4 || !a.loopDetection) items.push("Remove agent roles without distinct evidence, detect repeated actions and define a terminal condition with step and token budgets.");
  if (input.metrics.queueDepth > 0) items.push("Load-test downstream capacity and bound queue age; record shed requests explicitly instead of hiding overload behind long waits.");
  if (input.metrics.budgetExhausted) items.push("Reduce repeated model work before raising the budget; verify that lower spend still completes the requested tasks.");
  items.push("Add every failed scenario and tool contract to the regression evaluation set, including the degraded model route.");
  items.push("Compare a small canary with the previous version and expand only after latency, tool correctness and policy checks pass together.");
  items.push("Replay this seed after each architecture change and inspect the longest trace span, not only the headline model latency.");
  return items.slice(0, 6);
}

function securityReview(input: ReportInput): string {
  const a = input.architecture;
  return `The run used ${a.toolPermissions} tool permissions. ${a.toolPermissions === "unrestricted" ? "This leaves an excessive capability boundary: an agent can request actions unrelated to its role." : "Role restrictions keep inspection separate from authorised mutations."} Tool schema validation was ${a.validateToolOutputs ? "enabled, so malformed data can be rejected at the execution boundary" : "disabled, leaving malformed model arguments and external responses insufficiently checked"}. Human approval was ${a.humanApproval ? "required for high-impact actions; approval must refer to the exact tool and arguments" : "disabled in the architecture model, creating a policy risk for high-impact actions"}. ${a.idempotencyEnabled ? "Stable operation identifiers protect mutations against duplicate effects after a lost acknowledgement." : "Mutating retries still need stable idempotency keys to prevent duplicate reservations."} The safety score describes simulated software behaviour. It is not a measure of mountaineering safety.`;
}

/** Reports use captured events and before/after snapshots; they never invent timing. */
export function generateReport(input: ReportInput): ExpeditionReport {
  const { architecture: a, metrics: m, decisions, history } = input;
  const scenario = SCENARIOS.find(s => s.id === input.incidentId);
  const failed = Object.entries(m.slo).filter(([key, value]) => key !== "passed" && !value).map(([key]) => key);
  const summary = `The simulated expedition completed ${m.completed} of ${m.attempted} attempted requests with p95 latency of ${seconds(m.p95)} and average cost of ${money(m.costPerRequest)}. ${m.slo.passed ? "It met all five expedition objectives under these conditions." : `The remaining contract failures are ${failed.join(", ")}.`} ${m.bottleneck} was the longest span in the sampled trace. ${m.degraded ? "A degraded path preserved some service, so its quality and source freshness need separate review." : "The run's outcome reflects the selected model, workflow and dependency policies."}`;
  const ranked = [...decisions].sort((x, y) => gain(y) - gain(x));
  const best = ranked[0];
  const weakest = ranked.at(-1);
  const next = recommendations(input);
  const incidents = [...new Set([input.incidentId, ...history.map(h => h.incidentId), ...decisions.map(d => d.incidentId)].filter(Boolean))].map(id => SCENARIOS.find(s => s.id === id)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const timeline = history.length ? [...history].sort((x, y) => x.at - y.at).map(h => `- ${clock(h.at)} — ${h.message}`).join("\n") : "No incident timeline events were recorded. The metrics above describe the current architecture snapshot; no recovery duration is inferred.";
  const visited = [...new Set(decisions.map(d => d.stageId))];
  const concepts = STAGES.filter(s => visited.includes(s.id)).map(s => s.concept);
  const highlighted = [...m.traces].sort((x, y) => y.duration - x.duration)[0];
  const architectureText = `The system uses a ${a.modelTier} model with ${a.routingEnabled ? "complexity-aware routing" : "one model tier for every model task"} and ${a.adaptation === "foundation" ? "no additional domain adapter" : a.adaptation === "lora" ? "a separately trained LoRA adapter" : "a separately fine-tuned model"}. ${a.agentCount} agents coordinate with parallelism ${a.parallelism}, a ${a.maxAgentSteps}-step limit and ${a.loopDetection ? "duplicate-action detection" : "no duplicate-action detector"}. Retrieval adds up to ${a.retrievalTopK} chunks to a ${a.contextTokens}-token context. Weather, Route Knowledge, Logistics and Rescue represent separate MCP services. Read tools inspect conditions, routes and inventory; mutations reserve supplies or request a reviewed high-impact action. Data cache is ${a.cacheEnabled ? "on" : "off"}, semantic cache is ${a.semanticCacheEnabled ? "on" : "off"}, and prompt cache is ${a.promptCacheEnabled ? "on" : "off"}. Fallback is ${a.fallbackEnabled ? "available" : "disabled"}; weather-server redundancy is ${a.mcpRedundancy ? "enabled" : "disabled"}.`;
  const rootCause = incidents.length ? incidents.map(s => `**${s.title}.** The observed symptoms were ${s.symptoms.join("; ").toLowerCase()}. ${s.rootCause} ${s.prevention}`).join("\n\n") : `No incident was selected in the recorded run. The longest sampled stage was ${m.bottleneck}. ${m.queueDepth ? "Waiting requests indicate that arrival rate exceeded the effective service capacity in the burst window." : "No queue accumulated under this workload."}`;
  const worked: string[] = [];
  if (m.slo.reliability) worked.push(`The architecture preserved ${m.reliability.toFixed(2)}% completion, meeting the success objective.`);
  if (m.slo.latency) worked.push(`The p95 of ${seconds(m.p95)} remained within the three-second objective.`);
  if (m.circuitOpen) worked.push("The circuit breaker prevented repeated calls from consuming the failed dependency path.");
  if (a.parallelism > 1) worked.push("Independent tool checks overlapped while the final validation remained ordered.");
  if (m.cacheHitRate) worked.push(`Cache hits avoided repeated work for ${m.cacheHitRate}% of the simulated cohort.`);
  if (m.slo.safety) worked.push("The configured permission, validation and approval boundaries preserved the simulated safety objective.");
  if (!worked.length) worked.push("The run exposed concrete contract failures and retained a trace and decision history that can guide the next iteration.");
  const strongest = best ? `The most beneficial recorded decision was “${best.label}”. ${best.explanation} ${delta(best.before, best.after)} This ranking combines latency, completion, quality, safety and cost changes; it is a teaching aid, not an independent production score.` : "No learner decision was recorded, so there is no evidence-based strongest decision to rank.";
  const weak = weakest ? `The weakest relative recorded decision was “${weakest.label}”. ${delta(weakest.before, weakest.after)} ${gain(weakest) >= 0 ? "It did not worsen the combined teaching score, but offered the smallest gain among recorded actions." : "The before-and-after result shows the trade-off that needs review."}` : "No decision comparison is available yet.";
  const sections: ReportSection[] = [
    { title: "1. Executive summary", body: summary },
    { title: "2. Architecture used", body: architectureText },
    { title: "3. Workload and conditions", body: `This ${input.mode} run uses seed ${input.seed} at ${input.difficulty} difficulty. The cohort contains ${m.attempted} attempted requests, ${m.requestsPerSecond} arrivals per second, ${a.concurrency} concurrent workers, an admission limit of ${a.rateLimit}/s and a queue bound of ${a.queueSize}. ${scenario ? `The active incident is “${scenario.title}”: ${scenario.system}` : "The current snapshot has no active incident."} The rollout setting is ${a.rolloutPercent}% and describes release exposure; it does not change the intrinsic model scores.` },
    { title: "4. Metrics and expedition contract", body: `${metricsText(m)}\n\nTargets: success ≥99%; p95 <3 seconds; quality ≥90; safety 100; average cost <$0.01 with no budget termination. ${m.slo.passed ? "All targets passed." : `Targets requiring work: ${failed.join(", ")}.`}` },
    { title: "5. Incident timeline", body: timeline },
    { title: "6. Decisions and their consequences", body: decisions.length ? decisions.map(d => `**${clock(d.at)} · ${d.label}.** ${d.explanation} Immediate effect: ${delta(d.before, d.after)} Continuing effect: the configuration remains active for later stages until another decision changes it; compare the same incident and seed before attributing a later outcome to this action.`).join("\n\n") : "No architecture decisions were recorded. Change a control or choose a stage action to create a before-and-after comparison." },
    { title: "7. Root cause analysis", body: `${rootCause}\n\n${m.explanations.slice(0, 3).join(" ")}` },
    { title: "8. What worked well", body: `${worked.join(" ")}\n\n${strongest}` },
    { title: "9. What could improve", body: `${weak}\n\n${next.slice(0, 3).join(" ")}` },
    { title: "10. Production lessons", body: `A waiting climber maps to a queued request; a slow radio call maps to dependency latency; a closed route maps to a circuit breaker; an approved alternative maps to graceful degradation. ${incidents.length ? incidents.map(s => `${s.title}: ${s.lesson}`).join(" ") : "The mountain shows that model speed alone cannot explain end-to-end performance."} Each lesson depends on inspecting the full path, not a single model gauge.` },
    { title: "11. Security and safety review", body: securityReview(input) },
    { title: "12. Cost review", body: `The cohort spent $${m.totalCost.toFixed(3)} in simulated inference and service costs, averaging ${money(m.costPerRequest)} per attempted request. The model tier, ${m.tokens} tokens per request, ${m.steps} agent steps, ${a.retries} configured retries and ${m.cacheHitRate}% cache hit rate drive the estimate. Retrieval and tool coordination also contribute. ${m.budgetExhausted ? "A token or cohort-cost guard stopped some work. A low final spend therefore does not establish an efficient successful architecture." : `The run remained inside the ${a.tokenBudget}-token request limit and $${a.costBudget.toFixed(2)} cohort budget.`} Training and adaptation costs are outside this runtime model.` },
    { title: "13. Recommended next architecture", body: next.map((item, index) => `${index + 1}. ${item}`).join("\n") },
    { title: "14. Learning summary", body: concepts.length ? `Recorded stage decisions covered ${concepts.join("; ")}. ${incidents.length ? `Incident work added ${[...new Set(incidents.flatMap(s => s.concepts))].join(", ")}.` : "Revisit incident drills to test these choices under failure."}` : "The current sandbox run demonstrates model, context, workflow and dependency trade-offs. Completing guided stage decisions will add an explicit curriculum record here." },
    { title: "15. Explain my architecture", body: `“I built a model-assisted workflow with ${a.agentCount} agents and ${a.routingEnabled ? "complexity routing" : `a ${a.modelTier} model tier`}. It retrieves relevant evidence, accesses weather, route and inventory tools through MCP, and ${a.parallelism > 1 ? "overlaps independent checks" : "runs tool checks in sequence"}. The application enforces ${a.toolPermissions} permissions and ${a.humanApproval ? "requires high-impact approval" : "still needs a stronger high-impact approval boundary"}. I measured completion, tail latency, quality, safety and spend under a repeatable workload. The next change is to ${next[0].charAt(0).toLowerCase()}${next[0].slice(1)}”` },
    { title: "16. System map", body: `\`\`\`text\nRequests → Gateway / ${a.routingEnabled ? "complexity router" : "single-tier router"} → Bounded queue\n  → Context / ${a.retrievalTopK}-chunk retrieval → Lead agent\n      ${a.parallelism > 1 ? "├" : "→"} Weather MCP → conditions\n      ${a.parallelism > 1 ? "├" : "→"} Route MCP → route evidence\n      ${a.parallelism > 1 ? "└" : "→"} Logistics MCP → inventory\n  → Schema / role policy → ${a.humanApproval ? "Approval for high-impact tools" : "Approval disabled in architecture"}\n  → Final response / ${a.fallbackEnabled ? "qualified fallback" : "explicit failure"}\nCache: ${m.cacheHitRate}% hits; circuit: ${m.circuitOpen ? "OPEN" : "CLOSED"}\n\`\`\`\n\nExternal documents, MCP responses and model output remain separate trust boundaries. The host and tool execution layer enforce authorisation.` },
    { title: "17. Trace highlight", body: `${highlighted ? `The longest sampled span was **${highlighted.name}**, starting at ${highlighted.start} ms and lasting ${highlighted.duration} ms. ${highlighted.detail}` : "No trace spans were captured."}\n\n${m.traces.map(t => `- ${t.name}: start ${t.start} ms, duration ${t.duration} ms, status ${t.status}.`).join("\n")}\n\nThis is one simulated cache-miss trace. Parallel durations overlap, so adding all spans would overstate elapsed time. Its duration need not equal a cohort percentile.` },
    { title: "18. Final takeaway", body: m.slo.passed ? "The architecture met the teaching contract under this seed and incident state. Keep the passing configuration as a comparison, then test a different failure domain and verify the degraded path. A resilient design expects dependencies to fail and makes the resulting behaviour visible." : `The run identified specific limits in ${failed.join(", ")}. Use the recorded trace and decisions to repair the limiting path, replay the same conditions and recheck every objective. A useful production review explains both what completed and what the system could not promise.` },
  ];
  return packageReport("Everest AI Expedition — Production Readiness Debrief", summary, sections);
}

export function generateIncidentReport(input: ReportInput): ExpeditionReport {
  const scenario = SCENARIOS.find(s => s.id === input.incidentId);
  if (!scenario) return generateReport(input);
  const relevant = input.decisions.filter(d => d.incidentId === scenario.id);
  const recent = relevant.at(-1);
  const m = input.metrics;
  const summary = `${scenario.title}: ${scenario.system} The final simulated snapshot completed ${m.completed}/${m.attempted} requests with p95 ${seconds(m.p95)}, quality ${m.quality} and safety ${m.safety}. ${m.slo.passed ? "All expedition objectives were met after the recorded actions." : "At least one expedition objective remains unmet; this is not a claim of full recovery."}`;
  const sections: ReportSection[] = [
    { title: "Incident", body: `${scenario.system} ${scenario.mountain}` },
    { title: "Customer and expedition impact", body: `${m.attempted - m.completed} of ${m.attempted} attempted requests did not complete successfully in the final cohort. ${m.rejected} were rejected at admission. p95 was ${seconds(m.p95)} and ${m.queueDepth} requests were waiting in the burst estimate. ${m.degraded ? "The fallback changed response capability or confidence." : "The selected primary workflow determined the result."}\n\n${metricsText(m)}` },
    { title: "Timeline", body: input.history.length ? [...input.history].sort((a, b) => a.at - b.at).map(h => `- ${clock(h.at)} — ${h.message}`).join("\n") : "No timestamped events were recorded; a recovery duration cannot be established from this snapshot." },
    { title: "Signals", body: `${scenario.symptoms.map(s => `- ${s}`).join("\n")}\n\nPotential distraction: ${scenario.misleadingSignal} The longest sampled span was ${m.bottleneck}.` },
    { title: "Root cause", body: scenario.rootCause },
    { title: "Contributing factors", body: `${m.explanations.join(" ")} The configured workflow has ${input.architecture.agentCount} agents, parallelism ${input.architecture.parallelism}, ${input.architecture.retries} ${input.architecture.retryStrategy} retries and a ${input.architecture.toolTimeoutMs || "disabled"} ms tool timeout.` },
    { title: "Recovery action", body: relevant.length ? relevant.map(d => `**${d.label}.** ${d.explanation} ${delta(d.before, d.after)}`).join("\n\n") : "No mitigation decision is recorded for this incident. The snapshot describes the current response, not a demonstrated recovery." },
    { title: "Why the action worked or failed", body: recent ? `${recent.explanation} ${delta(recent.before, recent.after)} ${recent.after.slo.passed ? "The resulting configuration satisfies all five teaching objectives under these conditions." : "Inspect the remaining SLO failures before calling the incident resolved."}` : "Without a recorded before-and-after action, no causal recovery claim is made. Use the signals and prevention guidance to select a mitigation and replay the same seed." },
    { title: "Prevention", body: `${scenario.prevention}\n\n${recommendations(input).slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join("\n")}` },
    { title: "Architecture principle", body: `${scenario.lesson} ${securityReview(input)}` },
    { title: "Everest analogy", body: `${scenario.mountain} This corresponds to ${scenario.system.charAt(0).toLowerCase()}${scenario.system.slice(1)}` },
    { title: "One sentence to remember", body: scenario.lesson },
  ];
  return packageReport(`Everest Incident Postmortem — ${scenario.title}`, summary, sections);
}
