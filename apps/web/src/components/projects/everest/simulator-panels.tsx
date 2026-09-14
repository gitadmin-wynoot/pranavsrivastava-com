"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Copy, Download, Printer, X } from "lucide-react";
import { GLOSSARY, STAGES } from "./content";
import type { Architecture, ExpeditionReport, HistoryEvent, Metrics, StageId } from "./types";
import s from "./everest-simulator.module.css";

export function Modal({ title, children, onClose, report = false }: { title: string; children: ReactNode; onClose: () => void; report?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={`${s.dialog} ${report ? s.reportDialog : ""}`} aria-labelledby={titleId} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className={s.dialogHeader}><div><span className={s.eyebrow}>EVEREST / FIELD NOTES</span><h2 id={titleId}>{title}</h2></div><button className={s.iconButton} onClick={onClose} aria-label="Close panel"><X size={20} /></button></div>
    {children}
  </dialog>;
}

export function MetricBar({ metrics: m, onInspect }: { metrics: Metrics; onInspect: () => void }) {
  const values = [
    ["Latency / p95", `${(m.p95 / 1000).toFixed(2)} s`, m.slo.latency, "95% of requests finish at or below this latency. Target <3 seconds."],
    ["Reliability", `${m.reliability.toFixed(1)}%`, m.slo.reliability, "Share of attempted requests completed. Target ≥99%."],
    ["Simulated AI cost", `$${m.costPerRequest.toFixed(4)}`, m.slo.cost, "Average simulated cost per request. Target <$0.01 and within run budget."],
    ["Quality", `${Math.round(m.quality)}/100`, m.slo.quality, "Rule-based task correctness estimate. Target ≥90."],
    ["System safety", `${Math.round(m.safety)}/100`, m.slo.safety, "Policy, permission and validation behaviour in this software simulation. Target 100."],
  ] as const;
  return <div className={s.metricBar} aria-label="Live simulated metrics">{values.map(([label, value, pass, help]) => <button key={label} className={s.metric} onClick={onInspect} title={help}><span>{label}</span><strong>{value}</strong><small data-pass={pass}>{pass ? "✓ Within target" : "△ Outside target"}</small></button>)}<button className={s.telemetryLink} onClick={onInspect}><span className={s.liveDot} /> Open telemetry <ArrowRight size={14} /></button></div>;
}

export function Observability({ metrics: m, history, onStage }: { metrics: Metrics; history: HistoryEvent[]; onStage: (id: StageId) => void }) {
  const [spanId, setSpanId] = useState<string | null>(null);
  const span = m.traces.find(t => t.id === spanId);
  const maxEnd = Math.max(1, ...m.traces.map(t => t.start + t.duration));
  return <div className={s.dialogBody}>
    <p className={s.muted}>A trace follows one representative request across the system. Durations are simulated; parallel spans overlap. The cohort p95 includes queueing and failures.</p>
    <div className={s.statsGrid}>{[["p50", `${(m.p50 / 1000).toFixed(2)} s`], ["Throughput", `${m.throughput.toFixed(1)} /s`], ["Queue", `${m.queueDepth} waiting`], ["Tool failures", `${m.toolFailureRate.toFixed(1)}%`], ["Cache hit rate", `${m.cacheHitRate}%`], ["Tokens / request", m.tokens.toLocaleString()]].map(([label,value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
    <h3>Request trace <span className={s.tag}>1,000-request cohort</span></h3>
    <div className={s.waterfall}>{m.traces.map(t => <button key={t.id} className={s.spanRow} onClick={() => setSpanId(t.id)} aria-pressed={spanId === t.id}><span>{t.name}<small>{t.status}</small></span><span className={s.spanTrack}><i data-status={t.status} style={{ marginLeft: `${t.start / maxEnd * 80}%`, width: `${Math.max(2, t.duration / maxEnd * 80)}%` }} /></span><output>{Math.round(t.duration)} ms</output></button>)}</div>
    {span && <div className={s.callout}><strong>{span.name} / {span.status}</strong><p>{span.detail}</p><button className={s.textButton} onClick={() => onStage(span.stageId)}>See this stage on the mountain <ArrowRight size={14} /></button></div>}
    <h3>What changed, and why</h3><div className={s.explanations}>{m.explanations.map((text,i) => <p key={i}>{text}</p>)}</div>
    <div className={s.callout}><strong>{m.slo.passed ? "✓ Expedition contract met" : "△ Expedition contract needs attention"}</strong><p>Success ≥99% · p95 &lt;3 s · quality ≥90 · no policy violations · cost &lt;$0.01 per request and within the run budget.</p><p>Current bottleneck: <strong>{m.bottleneck}</strong>. {m.circuitOpen ? "Circuit OPEN: repeated dependency calls are blocked." : "Circuit CLOSED: requests can use the dependency."} {m.degraded ? "A fallback is serving a degraded response." : "Primary execution path in use."}</p></div>
    <h3>Expedition log</h3><ol className={s.timeline}>{history.slice(-24).reverse().map((event,i) => <li key={`${event.at}-${i}`}><time>T+{String(event.at).padStart(3,"0")}</time><button onClick={() => { const t = m.traces.find(x => x.status !== "ok"); if (t) {setSpanId(t.id); onStage(t.stageId);} else onStage("base"); }}>{event.message}</button></li>)}</ol>
  </div>;
}

export function HelpPanel({ onStage, showTutorial }: { onStage: (id: StageId) => void; showTutorial: () => void }) {
  const [query, setQuery] = useState("");
  const entries = GLOSSARY.filter(g => `${g.term} ${g.meaning}`.toLowerCase().includes(query.toLowerCase()));
  return <div className={s.dialogBody}>
    <p>Every mountain problem maps to a software system problem. Climbers are requests, Sherpas are agents, the radio protocol is MCP, and equipment represents callable tools.</p>
    <div className={s.helpGrid}><div><h3>Move around</h3><p>Drag to orbit. Scroll or pinch to zoom. Right-drag or two-finger drag to pan. Use the map’s camera buttons for keyboard control. Select any camp from the stage navigator for the same lesson available in 3D.</p></div><div><h3>Read the mountain</h3><p>Solid lines show the expedition route. Flow markers show requests. Branches show tool calls. Waiting markers are a queue; warning triangles indicate failure. The X-ray switch reveals the system topology.</p></div></div>
    <button className={s.secondaryButton} onClick={showTutorial}>Replay the 20-second orientation</button>
    <h3>Glossary / {GLOSSARY.length} field notes</h3>
    <label className={s.searchField}>Find a concept<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try MCP, latency, LoRA…" /></label>
    <div className={s.glossary}>{entries.map(g => <article key={g.term}><h4>{g.term}</h4><p>{g.meaning}</p><small>{g.analogy}</small><button className={s.textButton} onClick={() => onStage(g.stageId)}>See at {STAGES.find(t => t.id === g.stageId)?.name} <ArrowRight size={13} /></button></article>)}{!entries.length && <p>No matching concept. Try another word.</p>}</div>
    <h3>About this simulation</h3><p>Results come from a deterministic teaching model, not real provider benchmarks. Identical architecture, scenario, difficulty and seed produce the same workload results. The MCP demo connects real protocol clients and fixture servers with fictional data.</p>
    <p className={s.safetyNote}>This experience uses a simplified Everest expedition as a metaphor for production AI systems. It is not mountaineering, medical, survival, or expedition safety guidance.</p>
  </div>;
}

export function ReportPanel({ report }: { report: ExpeditionReport }) {
  const [copyState, setCopyState] = useState("");
  async function copy() { try { await navigator.clipboard.writeText(report.markdown); setCopyState("Copied Markdown"); } catch { setCopyState("Clipboard unavailable. Use Download Markdown."); } }
  function download() {
    const url = URL.createObjectURL(new Blob([report.markdown], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "everest-production-debrief.md"; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={s.dialogBody}><div className={s.reportActions}><button className={s.secondaryButton} onClick={copy}><Copy size={15} /> Copy Markdown</button><button className={s.secondaryButton} onClick={download}><Download size={15} /> Download</button><button className={s.secondaryButton} onClick={() => window.print()}><Printer size={15} /> Print / PDF</button></div><p role="status" className={s.muted}>{copyState}</p><article className={s.report}><p className={s.reportLead}>{report.summary}</p>{report.sections.map((section,i) => <section key={i}><h3>{String(i + 1).padStart(2,"0")} / {section.title}</h3><div className={s.reportProse}>{section.body}</div></section>)}</article></div>;
}

export function TrainingStation({ architecture, onChange, onEvent }: { architecture: Architecture; onChange: (patch: Partial<Architecture>, reason: string) => void; onEvent: (text: string) => void }) {
  const [reviews, setReviews] = useState(0);
  const [adapter, setAdapter] = useState("Route specialist");
  return <div className={s.station}>
    <span className={s.eyebrow}>Before runtime / adaptation workshop</span>
    <div className={s.modelCore}><strong>FOUNDATION MODEL</strong><span>General reasoning · frozen weights</span>{architecture.adaptation === "lora" && <b>+ {adapter} adapter</b>}</div>
    <label className={s.selectField}>Specialist adapter<select value={adapter} onChange={e => { setAdapter(e.target.value); onChange({ adaptation: "lora" }, `Attached ${e.target.value} LoRA adapter in the offline adaptation workshop.`); }}><option>Route specialist</option><option>Expedition terminology</option><option>Support domain</option></select></label>
    <button className={s.secondaryButton} onClick={() => onChange({ adaptation: architecture.adaptation === "lora" ? "foundation" : "lora" }, architecture.adaptation === "lora" ? "Removed the specialist adapter; use the foundation model." : `Attached ${adapter} LoRA adapter. The large core remains frozen.`)}>{architecture.adaptation === "lora" ? "Detach adapter" : "Attach LoRA adapter"}</button>
    <p>LoRA trains a small set of additional parameters while the base model stays frozen. It is optional adaptation, performed before deployment or separately from serving requests.</p>
    <details><summary>Human preferences / RLHF</summary><p>A reviewer compares two candidate model answers. Which behaviour should the training process prefer?</p><div className={s.choiceList}><button onClick={() => { setReviews(n => n + 1); onEvent("Offline preference recorded: request a policy review. RLHF shapes behaviour but grants no runtime authority."); }}>Pause and request a policy review</button><button onClick={() => { setReviews(n => n + 1); onEvent("Offline preference recorded: continue without review. Preference quality matters; runtime policy still blocks unauthorised actions."); }}>Continue without policy review</button></div><p aria-live="polite">{reviews} comparison{reviews === 1 ? "" : "s"} reviewed. Human feedback shapes post-training behaviour. RLHF is not a runtime safety switch; permissions, validation and evaluation still apply.</p></details>
  </div>;
}

export function EvaluationStation({ architecture, onChange }: { architecture: Architecture; onChange: (patch: Partial<Architecture>, reason: string) => void }) {
  const [decision, setDecision] = useState("");
  return <div className={s.station}><span className={s.eyebrow}>Release gate / a fixed evaluation set</span><h3>Better answers. Worse tool calls.</h3><p>A candidate prompt improves accuracy but regresses on tool correctness. Compare the same evaluation tasks before changing traffic.</p><table className={s.evalTable}><thead><tr><th>Eval</th><th>Previous</th><th>Candidate</th></tr></thead><tbody>{[["Accuracy",91,95],["System safety",98,97],["Tool correctness",94,82],["Latency (s)",2.1,2.4]].map(([label,old,next]) => <tr key={label}><td>{label}</td><td>{old}</td><td>{next}{label === "Tool correctness" ? " △" : ""}</td></tr>)}</tbody></table><div className={s.choiceList}><button onClick={() => {setDecision("Release held. Fix the tool schema regression and repeat the evaluation before widening traffic."); onChange({ rolloutPercent: 5, validateToolOutputs: true }, "Held release after tool correctness fell from 94 to 82. Kept a 5% isolated canary and schema validation.");}}><Check size={15} /> Hold release and repair the regression</button><button onClick={() => {setDecision("The rollout exposes more requests to the known regression. Compare cohort errors and roll back."); onChange({ rolloutPercent: 100 }, "Rolled candidate to 100% despite a known tool correctness regression.");}}>Roll out the candidate to everyone</button></div><p role="status">{decision}</p><label className={s.selectField}>Canary traffic<select value={architecture.rolloutPercent} onChange={e => onChange({ rolloutPercent: Number(e.target.value) }, `Changed canary traffic to ${e.target.value}%; compare regression exposure before widening.`)}>{[5,20,50,100].map(n => <option key={n} value={n}>{n}% of requests</option>)}</select></label><p>{architecture.rolloutPercent > 5 ? "△ Candidate errors are rising. More requests are exposed to the tool correctness regression." : "5% canary confines the candidate to a small cohort. The main route remains on the previous version."}</p><button className={s.secondaryButton} onClick={() => {onChange({ rolloutPercent: 5 }, "Rolled back the broad release to the isolated 5% canary after regression detection."); setDecision("Broad rollout rolled back. Keep the small canary isolated while repairing the candidate.");}}>Roll back broad release</button></div>;
}
