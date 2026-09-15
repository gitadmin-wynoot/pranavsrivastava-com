"use client";

import { useId, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowRight, Backpack, BookOpen, Check, CheckCheck, ChevronDown, Clock3, CloudSun, Flag, FlaskConical, GitBranch, Lightbulb, LockKeyhole, Map, Radio, RotateCcw, ShieldCheck, Sparkles, Users, Wrench } from "lucide-react";
import type { Quest } from "./live-learning";
import type { Architecture, Metrics } from "./types";
import s from "./live-quest-panel.module.css";

export type LiveQuestPanelProps = {
  quest: Quest;
  architecture: Architecture;
  metrics: Metrics;
  before: Metrics | null;
  selectedOptionId: string | null;
  onChoose: (optionId: string) => void;
  onComplete: (firstTry: boolean) => void;
  onInspect: () => void;
  onTryAgain: () => void;
  completed: boolean;
  reducedMotion: boolean;
};

const MODEL_NAMES: Record<Architecture["modelTier"], string> = { small: "Quick", medium: "All-round", large: "Deep" };
const seconds = (milliseconds: number) => `${(milliseconds / 1000).toFixed(1)} s`;
const score = (value: number) => `${Math.round(value)}%`;
const simulatedCost = (value: number) => `${(value * 100).toFixed(2)}¢`;
const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value));

function SherpaFace({ thinking }: { thinking: boolean }) {
  return <svg viewBox="0 0 56 56" fill="none" aria-hidden="true">
    <circle cx="28" cy="28" r="27" fill="#244550" />
    <path d="M10 56c0-12 8-19 18-19s18 7 18 19" fill="#A3E3CF" />
    <path d="M22 39l6 8 6-8" fill="#D6F1E5" />
    <ellipse cx="28" cy="26" rx="14" ry="16" fill="#E8B38D" />
    <path d="M13 22c0-12 6-18 15-18s15 6 15 18" fill="#EB957B" />
    <path d="M12 22h32v5H12z" fill="#FFD0A5" />
    <path d="M23 5h10l-2 13h-6z" fill="#F5B499" />
    <circle cx="23" cy="29" r="1.5" fill="#173140" />
    <circle cx="33" cy="29" r="1.5" fill="#173140" />
    <path d={thinking ? "M25 35h6" : "M24 34q4 5 8 0"} stroke="#764F40" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M17 47l-2 9m24-9 2 9" stroke="#4E9F92" strokeWidth="3" />
  </svg>;
}

function MetricComparison({ current, before, showBefore, experiment }: { current: Metrics; before: Metrics | null; showBefore: boolean; experiment: Quest["experiment"] }) {
  const values = experiment === "security"
    ? [{ label: "Safety", value: current.safety, old: before?.safety, format: score, higherIsBetter: true }, { label: "Answers", value: current.quality, old: before?.quality, format: score, higherIsBetter: true }, { label: "Wait", value: current.p95, old: before?.p95, format: seconds, higherIsBetter: false }]
    : experiment === "queue" || experiment === "recovery"
      ? [{ label: "Wait", value: current.p95, old: before?.p95, format: seconds, higherIsBetter: false }, { label: "Working", value: current.reliability, old: before?.reliability, format: score, higherIsBetter: true }, { label: "Waiting", value: current.queueDepth, old: before?.queueDepth, format: (n: number) => String(Math.round(n)), higherIsBetter: false }]
      : [{ label: "Wait", value: current.p95, old: before?.p95, format: seconds, higherIsBetter: false }, { label: "Answers", value: current.quality, old: before?.quality, format: score, higherIsBetter: true }, { label: "Cost / task", value: current.costPerRequest, old: before?.costPerRequest, format: simulatedCost, higherIsBetter: false }];
  return <div className={s.comparison} aria-label={showBefore && before ? "Before and after your choice" : "Current experiment readings"}>
    <div className={s.comparisonHeader}><span>{showBefore && before ? "Before → your choice" : "At the start"}</span><small>Simulation readings</small></div>
    <div className={s.metrics}>{values.map(({ label, value, old, format, higherIsBetter }) => {
      const changed = showBefore && old !== undefined && Math.abs(value - old) > 0.000001;
      const improved = changed && (higherIsBetter ? value > old! : value < old!);
      return <div key={label} className={s.metric}>
        <span>{label}</span>
        {showBefore && old !== undefined ? <small>{format(old)} <ArrowRight size={10} aria-hidden="true" /></small> : <small>Current</small>}
        <strong data-change={changed ? improved ? "better" : "tradeoff" : "same"}>{format(value)}</strong>
      </div>;
    })}</div>
  </div>;
}

function ContextExperiment({ architecture, cached }: { architecture: Architecture; cached: boolean }) {
  if (cached) return <div className={s.cacheScene}>
    <div className={s.cacheNote}><CloudSun size={26} aria-hidden="true" /><span><strong>Saved weather answer</strong><small>{architecture.freshnessValidation ? "Check the source date before reuse" : "Source date is not being checked"}</small></span><span className={s.cacheCheck} data-checked={architecture.freshnessValidation}>{architecture.freshnessValidation ? <Check size={15} aria-hidden="true" /> : "?"}</span></div>
    <div className={s.recoveryChips}><span><Clock3 size={11} aria-hidden="true" /> Reuse limit: {architecture.cacheTtlSeconds >= 60 ? `${architecture.cacheTtlSeconds / 60} min` : `${architecture.cacheTtlSeconds}s`}</span><span>{architecture.semanticCacheEnabled ? "Similar answers too" : "Exact saved answers"}</span></div>
    <p>{architecture.freshnessValidation ? "Check if the saved evidence still fits. Refresh it when it is too old." : "Reusing an old answer is fast. Its weather may have changed."}</p>
  </div>;
  const heavy = architecture.contextTokens > 10000;
  const slips = Math.round(clamp(architecture.contextTokens / 1800, 14));
  return <div className={s.backpackScene}>
    <div className={s.paperPile} aria-hidden="true">{Array.from({ length: Math.max(3, slips) }, (_, index) => <span key={index} style={{ "--paper-index": index } as CSSProperties} data-noise={index >= Math.max(2, architecture.retrievalTopK)}>{index < architecture.retrievalTopK ? "Route note" : "Extra note"}</span>)}</div>
    <div className={s.backpack} data-heavy={heavy}><Backpack size={58} strokeWidth={1.25} aria-hidden="true" /><span>{(architecture.contextTokens / 1000).toFixed(1)}k</span></div>
    <div className={s.miniCaption}><strong>{heavy ? "That is a lot to carry." : "A lighter thinking pack."}</strong><span>{architecture.retrievalTopK} retrieved notes · {architecture.contextTokens.toLocaleString()} pieces of text</span></div>
  </div>;
}

function ParallelExperiment({ architecture, metrics, looping }: { architecture: Architecture; metrics: Metrics; looping: boolean }) {
  if (looping) return <div className={s.loopScene}>
    <div className={s.loopSteps}><span>Plan</span><ArrowRight size={12} aria-hidden="true" /><span>Search</span><ArrowRight size={12} aria-hidden="true" /><span>No new facts</span></div>
    <div className={s.loopReturn} data-stopped={architecture.loopDetection}><RotateCcw size={17} aria-hidden="true" /><strong>{architecture.loopDetection ? "Repeated action spotted. Stop here." : "The same search starts again…"}</strong></div>
    <div className={s.recoveryChips}><span>{metrics.steps} steps used</span><span>Limit: {architecture.maxAgentSteps} steps</span></div>
    <p>{metrics.tokens.toLocaleString()} tokens used. {architecture.loopDetection ? "The team can say what it still does not know." : "More laps need more text and waiting."}</p>
  </div>;
  const toolSpans = metrics.traces.filter((span) => ["weather", "route", "logistics"].includes(span.id));
  const firstStart = toolSpans.length ? Math.min(...toolSpans.map((span) => span.start)) : 0;
  const end = toolSpans.length ? Math.max(...toolSpans.map((span) => span.start + span.duration)) - firstStart : 1;
  const labels = ["Weather", "Route", "Supplies"];
  return <div className={s.raceScene}>
    <div className={s.sceneTitle}><Users size={15} aria-hidden="true" /><strong>{architecture.parallelism > 1 ? "Independent jobs can overlap." : "One job waits for the next."}</strong></div>
    {labels.map((label, index) => {
      const span = toolSpans[index];
      const left = span ? ((span.start - firstStart) / end) * 85 : architecture.parallelism > 1 ? 0 : index * 27;
      const width = span ? Math.max(10, span.duration / end * 85) : 24;
      return <div className={s.raceRow} key={label}><span>{label}</span><div className={s.raceTrack}><div className={s.racer} style={{ left: `${left}%`, width: `${width}%`, "--race-index": index } as CSSProperties}><span aria-hidden="true" /></div></div></div>;
    })}
    <div className={s.raceAxis}><span>Start together?</span><span>Finish <Flag size={10} aria-hidden="true" /></span></div>
    <p>{architecture.parallelism} job{architecture.parallelism === 1 ? "" : "s"} at once · {architecture.agentCount} agents on the team</p>
  </div>;
}

function ProtocolExperiment({ architecture, duplicate }: { architecture: Architecture; duplicate: boolean }) {
  if (duplicate) return <div className={s.ticketScene}>
    <div className={s.ticketCalls}><span><Radio size={14} aria-hidden="true" /> First call <strong>Ticket A</strong></span><span><RotateCcw size={14} aria-hidden="true" /> Retry <strong>Ticket {architecture.idempotencyEnabled ? "A" : "B"}</strong></span></div>
    <ArrowDown size={14} aria-hidden="true" />
    <div className={s.ticketSupply}><Backpack size={28} aria-hidden="true" /><span><strong>{architecture.idempotencyEnabled ? "One reservation" : "Duplicate reservation"}</strong><small>{architecture.idempotencyEnabled ? "Recognise the job. Return the first result." : "A new ticket looks like a new job."}</small></span></div>
    <p>{architecture.retries} retr{architecture.retries === 1 ? "y" : "ies"} allowed · {architecture.idempotencyEnabled ? "Same logical job, same key" : "No key to recognise repeated work"}</p>
  </div>;
  return <div className={s.protocolScene}>
    <div className={s.protocolMain}><span><Users size={16} aria-hidden="true" /> Agent</span><ArrowRight size={12} aria-hidden="true" /><span className={s.protocolClient}><Radio size={16} aria-hidden="true" /> MCP client</span></div>
    <div className={s.protocolBranches} aria-hidden="true"><i /><i /><i /></div>
    <div className={s.protocolServers}>{[{ name: "Weather", action: "Get forecast", Icon: CloudSun }, { name: "Route", action: "Read a note", Icon: Map }, { name: "Supplies", action: "Reserve kit", Icon: Backpack }].map(({ name, action, Icon }) => <div key={name}><Icon size={16} aria-hidden="true" /><strong>{name}</strong><small>server</small><span>{action}</span></div>)}</div>
    <p><ShieldCheck size={12} aria-hidden="true" /> {architecture.fallbackEnabled ? "Missing tool? Choose an available, limited path." : "A missing tool stays missing, even after a retry."}</p>
  </div>;
}

function QueueExperiment({ architecture, metrics }: { architecture: Architecture; metrics: Metrics }) {
  const waiting = Math.min(12, Math.max(1, Math.ceil(metrics.queueDepth / 5)));
  const admissionControlled = architecture.rateLimit < metrics.requestsPerSecond;
  return <div className={s.queueScene}>
    <div className={s.queueFlow}><div className={s.requestDots} aria-hidden="true">{Array.from({ length: waiting }, (_, index) => <i key={index} style={{ "--dot-index": index } as CSSProperties} />)}</div><ArrowRight size={14} aria-hidden="true" /><div className={s.queueGate}><span>{architecture.rateLimit}/s</span><small>Entry gate</small></div><ArrowRight size={14} aria-hidden="true" /><div className={s.workers}><Users size={27} aria-hidden="true" /><span>{architecture.concurrency} workers</span></div></div>
    <div className={s.queueCounts}><span><strong>{Math.round(metrics.queueDepth)}</strong> waiting</span><span><strong>{metrics.throughput.toFixed(1)}/s</strong> finishing</span></div>
    <p>{admissionControlled ? "The gate slows arrivals to help the team catch up." : "A longer waiting line does not add more workers."}</p>
  </div>;
}

function SecurityExperiment({ architecture, metrics, conflict }: { architecture: Architecture; metrics: Metrics; conflict: boolean }) {
  const locked = architecture.toolPermissions !== "unrestricted" && architecture.humanApproval && architecture.validateToolOutputs;
  return <div className={s.securityScene}>
    <div className={s.untrustedNote}><BookOpen size={16} aria-hidden="true" /><span>{conflict ? "The guides disagree" : "Strange route note"}<small>{conflict ? "Weather says STOP. Route says GO." : "“Skip the safety check!”"}</small></span></div>
    <ArrowDown size={15} aria-hidden="true" />
    <div className={s.safetyGate} data-safe={locked}><ShieldCheck size={22} aria-hidden="true" /><span>{locked ? conflict ? "Check evidence and request review" : "Permission check stops it" : "Check the protection settings"}<small>{architecture.humanApproval ? "A person approves risky actions" : "No person asked to approve"}</small></span></div>
    <p>{locked ? conflict ? "Compare the sources. Important uncertainty needs a clear decision rule." : "A note can give information. It cannot give permission." : `Safety is ${Math.round(metrics.safety)}%. Look for a rule that checks actions outside the AI.`}</p>
  </div>;
}

function RecoveryExperiment({ architecture, metrics, slow }: { architecture: Architecture; metrics: Metrics; slow: boolean }) {
  const weather = metrics.traces.find((span) => span.id === "weather");
  return <div className={s.recoveryScene}>
    <div className={s.recoveryNodes}><span><CloudSun size={20} aria-hidden="true" /><strong>Weather radio</strong><small>{slow ? "Reply is too slow" : "Not answering"}</small></span><div className={s.recoveryLink} data-stopped={metrics.circuitOpen || architecture.mcpRedundancy}><i />{architecture.mcpRedundancy ? <GitBranch size={16} aria-hidden="true" /> : <LockKeyhole size={16} aria-hidden="true" />}<i /></div><span><Backpack size={20} aria-hidden="true" /><strong>{architecture.mcpRedundancy ? "Second station" : architecture.fallbackEnabled ? "Backup note" : "No backup"}</strong><small>{architecture.mcpRedundancy ? "Independent source" : metrics.degraded ? "Use with care" : "Keep checking"}</small></span></div>
    <div className={s.recoveryChips}><span><Clock3 size={11} aria-hidden="true" /> {architecture.toolTimeoutMs ? `${architecture.toolTimeoutMs / 1000}s wait limit` : "No wait limit"}</span><span>{architecture.retries} retr{architecture.retries === 1 ? "y" : "ies"}</span></div>
    <p>{slow ? `Weather span: ${seconds(weather?.duration ?? 0)}. ${architecture.mcpRedundancy ? "The other station shortens the slow path." : "This is the tool wait, separate from the model."}` : metrics.circuitOpen ? "The breaker pauses repeat calls. The team can use a safe backup." : "Repeated calls to a broken radio can hold up the whole team."}</p>
  </div>;
}

function EvaluationExperiment({ architecture, metrics, quest }: { architecture: Architecture; metrics: Metrics; quest: Quest }) {
  if (quest.stageIndex === 9) return <div className={s.promiseScene}>
    <div className={s.sceneTitle}><Flag size={15} aria-hidden="true" /><strong>{quest.incidentId === "provider-outage" ? "The backup's promise" : "Check the whole promise"}</strong></div>
    <div className={s.promiseChecks}>{([['Finishes', metrics.slo.reliability], ['Speed', metrics.slo.latency], ['Cost', metrics.slo.cost], ['Answers', metrics.slo.quality], ['Safety', metrics.slo.safety]] as const).map(([label, passed]) => <span key={label} data-passed={passed}>{passed ? <Check size={12} aria-hidden="true" /> : <span className={s.promiseDot} aria-hidden="true" />}{label}</span>)}</div>
    <p>{quest.incidentId === "provider-outage" ? architecture.fallbackEnabled ? "The backup restores service. Compare its answer quality too." : "The only provider is down. A longer wait cannot repair it." : `${Object.entries(metrics.slo).filter(([key, passed]) => key !== "passed" && passed).length} of 5 targets met. One good number cannot explain the whole trip.`}</p>
  </div>;
  const rolloutDots = Math.max(1, Math.round(architecture.rolloutPercent / 5));
  return <div className={s.canaryScene}>
    <div className={s.sceneTitle}><FlaskConical size={16} aria-hidden="true" /><strong>Who tries the new version?</strong></div>
    <div className={s.canaryDots} aria-hidden="true">{Array.from({ length: 20 }, (_, index) => <i key={index} data-new={index < rolloutDots}><Users size={11} /></i>)}</div>
    <div className={s.canaryLegend}><span><i /> New version: {architecture.rolloutPercent}%</span><span><i /> Existing version</span></div>
    <p>{metrics.slo.passed ? "The checks pass. Keep measuring as the group grows." : "Check useful answers, speed and safety before inviting everyone."}</p>
  </div>;
}

function ModelExperiment({ architecture, experiment }: { architecture: Architecture; experiment: Quest["experiment"] }) {
  if (experiment === "routing") return <div className={s.routingScene}>
    <div className={s.routingTask}><span>Hello!</span><span>Plan a route</span></div>
    <GitBranch size={25} aria-hidden="true" />
    <div className={s.routingPaths}>{architecture.routingEnabled ? <><span><Sparkles size={17} aria-hidden="true" /><strong>Quick model</strong><small>Simple request</small></span><span><Sparkles size={25} aria-hidden="true" /><strong>Deep model</strong><small>Trickier request</small></span></> : <span><Sparkles size={25} aria-hidden="true" /><strong>{MODEL_NAMES[architecture.modelTier]} model</strong><small>Every request takes this path</small></span>}</div>
    <p>{architecture.routingEnabled ? "Match the size of the job to the help it needs." : "One model handles every kind of job."}</p>
  </div>;
  if (experiment === "training") return <div className={s.trainingScene}>
    <div className={s.practiceCards} aria-hidden="true"><span>Example</span><span>Practice</span><span>Try again</span></div>
    <ArrowDown size={14} aria-hidden="true" />
    <div className={s.trainingModel}><Sparkles size={29} aria-hidden="true" /><strong>{architecture.adaptation === "foundation" ? "General training" : architecture.adaptation === "lora" ? "Focused practice" : "Whole-model training"}</strong></div>
    <p>{architecture.adaptation === "foundation" ? "A foundation model learns broad patterns before this trip." : architecture.adaptation === "lora" ? "A small adapter adds task practice while the base model stays fixed." : "Training updates the model more broadly. It needs more work and testing."}</p>
  </div>;
  return <div className={s.modelScene}>
    <div className={s.modelSizes}>{(["small", "medium", "large"] as const).map((tier, index) => <div key={tier} data-selected={architecture.modelTier === tier}><div className={s.modelTower} style={{ "--tower-height": `${31 + index * 16}px` } as CSSProperties}><Sparkles size={16 + index * 4} aria-hidden="true" /></div><strong>{MODEL_NAMES[tier]}</strong><small>{tier}</small></div>)}</div>
    <p>Using the <strong>{MODEL_NAMES[architecture.modelTier].toLowerCase()}</strong> model. Look at both answer quality and waiting time.</p>
  </div>;
}

function ExperimentVisual({ quest, architecture, metrics }: Pick<LiveQuestPanelProps, "quest" | "architecture" | "metrics">) {
  switch (quest.experiment) {
    case "context": return <ContextExperiment architecture={architecture} cached={quest.incidentId === "stale-cache"} />;
    case "parallel": return <ParallelExperiment architecture={architecture} metrics={metrics} looping={quest.incidentId === "agent-loop"} />;
    case "protocol": return <ProtocolExperiment architecture={architecture} duplicate={quest.incidentId === "duplicate-action"} />;
    case "queue": return <QueueExperiment architecture={architecture} metrics={metrics} />;
    case "security": return <SecurityExperiment architecture={architecture} metrics={metrics} conflict={quest.incidentId === "conflicting-agents"} />;
    case "recovery": return <RecoveryExperiment architecture={architecture} metrics={metrics} slow={quest.incidentId === "slow-dependency"} />;
    case "evaluation": return <EvaluationExperiment architecture={architecture} metrics={metrics} quest={quest} />;
    default: return <ModelExperiment architecture={architecture} experiment={quest.experiment} />;
  }
}

function QuestPanelBody({ quest, architecture, metrics, before, selectedOptionId, onChoose, onComplete, onInspect, onTryAgain, completed, reducedMotion }: LiveQuestPanelProps) {
  const uid = useId();
  const selected = quest.options.find((option) => option.id === selectedOptionId);
  const [hintOpen, setHintOpen] = useState(false);
  const [recallSelection, setRecallSelection] = useState<number | null>(null);
  const [hadMistake, setHadMistake] = useState(selected?.correct === false);
  const [packed, setPacked] = useState(false);
  const packedOnce = useRef(false);
  const recallCorrect = recallSelection === quest.recall.answer;
  const canPack = Boolean(selected?.correct && recallCorrect && !completed && !packed);
  const finished = completed || packed;

  function choose(optionId: string) {
    if (finished) return;
    const option = quest.options.find((candidate) => candidate.id === optionId);
    if (!option) return;
    if (!option.correct) setHadMistake(true);
    setRecallSelection(null);
    onChoose(optionId);
  }
  function answer(index: number) {
    if (!selected?.correct || finished) return;
    setRecallSelection(index);
    if (index !== quest.recall.answer) setHadMistake(true);
  }
  function packLesson() {
    if (!canPack || packedOnce.current) return;
    packedOnce.current = true;
    setPacked(true);
    onComplete(!hadMistake);
  }

  return <section className={s.quest} data-motion={reducedMotion ? "reduced" : "full"} aria-labelledby={`${uid}-title`}>
    <div className={s.questTop}><span><Flag size={12} aria-hidden="true" /> Field quest {String(quest.stageIndex + 1).padStart(2, "0")}</span><small>No rush. Try things.</small></div>
    <h2 id={`${uid}-title`} className={s.title}>{quest.title}</h2>
    <div className={s.sherpa}><div className={s.avatar}><SherpaFace thinking={selected?.correct === false} /></div><div><span>Your Sherpa</span><p>{quest.story}</p></div></div>

    <div className={s.stepHeading}><span>01</span><h3>Make a prediction</h3><Lightbulb size={15} aria-hidden="true" /></div>
    <p className={s.mission}>{quest.mission}</p>
    <div className={s.options} role="group" aria-label="Choose an experiment to try">
      {quest.options.map((option, index) => <button key={option.id} type="button" disabled={finished} onClick={() => choose(option.id)} aria-pressed={selectedOptionId === option.id} className={s.option} data-selected={selectedOptionId === option.id}>
        <span className={s.optionLetter}>{selectedOptionId === option.id ? <Check size={13} aria-hidden="true" /> : String.fromCharCode(65 + index)}</span>
        <span><strong>{option.label}</strong><small>{option.description}</small></span><ArrowRight className={s.optionArrow} size={14} aria-hidden="true" />
      </button>)}
    </div>
    <button className={s.hintButton} type="button" onClick={() => setHintOpen((value) => !value)} aria-expanded={hintOpen} aria-controls={`${uid}-hint`}><Lightbulb size={13} aria-hidden="true" />{hintOpen ? "Tuck the hint away" : "A little hint, please"}<ChevronDown size={12} aria-hidden="true" /></button>
    {hintOpen && <p id={`${uid}-hint`} className={s.hint}>{quest.hint}</p>}

    <div className={s.stepHeading}><span>02</span><h3>Watch what changes</h3><FlaskConical size={15} aria-hidden="true" /></div>
    <div className={s.experiment} key={`${quest.id}-${selectedOptionId ?? "start"}`} aria-label={`${quest.concept} experiment`}><ExperimentVisual quest={quest} architecture={architecture} metrics={metrics} /></div>
    <MetricComparison current={metrics} before={before} showBefore={Boolean(selected)} experiment={quest.experiment} />
    {selected ? <div className={s.feedback} data-supported={selected.correct} role="status"><span>{selected.correct ? <CheckCheck size={15} aria-hidden="true" /> : <FlaskConical size={15} aria-hidden="true" />}{selected.correct ? "That plan works here." : "We learned something. Try another plan."}</span><p>{selected.effect}</p>{!selected.correct && <button type="button" className={s.tryAgain} onClick={() => { setRecallSelection(null); onTryAgain(); }}><RotateCcw size={12} aria-hidden="true" /> Reset the experiment</button>}</div> : <p className={s.waiting}>Pick a plan above. These readings will show what your choice changes.</p>}
    <button className={s.inspectButton} type="button" onClick={onInspect}><Wrench size={12} aria-hidden="true" />{quest.experiment === "protocol" ? "Peek inside the radio room" : "Peek under the hood"}<ArrowRight size={12} aria-hidden="true" /></button>

    <div className={s.stepHeading} data-locked={!selected?.correct && !finished}><span>03</span><h3>Keep the discovery</h3>{selected?.correct || finished ? <BookOpen size={15} aria-hidden="true" /> : <LockKeyhole size={14} aria-hidden="true" />}</div>
    {!selected?.correct && !finished ? <p className={s.recallLocked}>Find a plan that works, then answer one small question to pack the lesson.</p> : <div className={s.recall}>
      <p className={s.recallQuestion}>{quest.recall.question}</p>
      <div role="group" aria-label="Check what you discovered" className={s.recallOptions}>{quest.recall.options.map((option, index) => <button key={`${quest.id}-recall-${index}`} type="button" disabled={finished} onClick={() => answer(index)} aria-pressed={recallSelection === index} className={s.recallOption} data-state={recallSelection === index ? recallCorrect ? "correct" : "retry" : "unanswered"}><span>{recallSelection === index && recallCorrect ? <Check size={12} aria-hidden="true" /> : String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
      {recallSelection !== null && <p className={s.recallFeedback} data-correct={recallCorrect} role="status">{recallCorrect ? quest.recall.explanation : "Not quite yet. Look at what changed in the experiment, then try another answer. You can take your time."}</p>}
      {(recallCorrect || finished) && <div className={s.discovery}><Sparkles size={16} aria-hidden="true" /><p>{quest.takeaway}</p></div>}
    </div>}

    <button type="button" className={s.packButton} onClick={packLesson} disabled={!canPack}>{finished ? <CheckCheck size={17} aria-hidden="true" /> : <Backpack size={17} aria-hidden="true" />}<span>{finished ? "Lesson packed!" : "Pack this lesson"}</span>{!finished && <ArrowRight size={16} aria-hidden="true" />}</button>
    <p className={s.packNote}>{finished ? "This discovery is in your expedition passport." : canPack ? "Ready when you are. Take your discovery to the next camp." : "Try a plan and explain what you found to continue."}</p>

    <details className={s.fieldNotes}><summary><BookOpen size={13} aria-hidden="true" /><span>The engineering words</span><ChevronDown size={12} aria-hidden="true" /></summary><dl>{quest.fieldNote.map((note) => <div key={note.term}><dt>{note.term}</dt><dd>{note.meaning}</dd></div>)}</dl><p>Readings are generated by a teaching simulation. “Wait” means a slower request near the end of the group; “Answers” is a quality score, not a guarantee.</p></details>
  </section>;
}

/** Keying the body resets local recall state when the parent advances to another quest. */
export function LiveQuestPanel(props: LiveQuestPanelProps) { return <QuestPanelBody key={props.quest.id} {...props} />; }
export default LiveQuestPanel;
