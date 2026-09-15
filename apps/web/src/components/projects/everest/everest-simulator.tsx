"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, Compass, Eye, FileText, Flame, HelpCircle, Info, Layers, Lightbulb, Mountain, Pause, Play, Radio, RotateCcw, Settings2, Shield, SlidersHorizontal, TriangleAlert, Volume2, VolumeX, X } from "lucide-react";
import { STAGES, SCENARIOS } from "./content";
import { DEFAULT_ARCHITECTURE, normalizeArchitecture, simulate } from "./engine";
import { ACHIEVEMENTS, qualifiedAchievements } from "./achievements";
import { alertTone, arrivalChime, decisionClick, fanfare, initAudio, isMuted, missionFailedTone, radioClick, setMuted, setWindIntensity, startWind, stopWind, successChime } from "./audio";
import { generateIncidentReport, generateReport } from "./reports";
import type { Architecture, Choice, DecisionRecord, Difficulty, HistoryEvent, Metrics, Mode, StageId } from "./types";
import { ArchitectureControls } from "./architecture-controls";
import { MissionBriefing } from "./mission-briefing";
import { ResolutionScreen } from "./resolution-screen";
import { AboutPanel, EvaluationStation, HelpPanel, MetricBar, Modal, Observability, ReportPanel, TrainingStation } from "./simulator-panels";
import s from "./everest-simulator.module.css";

const MountainScene = dynamic(() => import("./mountain-scene"), { ssr: false, loading: () => <div className={s.preparing}><Mountain size={36} /><strong>Preparing expedition…</strong><span>Loading terrain · Establishing camps · Connecting tools</span></div> });
const LiveAdventure = dynamic(() => import("./live-adventure"), { ssr: false, loading: () => <div className={s.preparing}>Preparing your next adventure…</div> });
const ToolInspector = dynamic(() => import("./tool-inspector"), { loading: () => <p className={s.dialogBody}>Connecting the radio tent…</p> });
const STORAGE_KEY = "everest-expedition-v1";
const MODES: { id: Mode; label: string; short: string; text: string; icon: typeof Compass }[] = [
  { id: "guided", label: "Start Guided Expedition", short: "Guided expedition", text: "Your first ascent. Learn by making decisions.", icon: Compass },
  { id: "live", label: "Start Live Expedition", short: "Live expedition", text: "Try ideas, solve team missions, and collect what you learn.", icon: Flame },
  { id: "incidents", label: "Incident Drills", short: "Incident drills", text: "Find the failure. Recover the system.", icon: TriangleAlert },
  { id: "lab", label: "Architecture Lab", short: "Architecture lab", text: "Change the design. Test the trade-offs.", icon: SlidersHorizontal },
  { id: "explore", label: "Explore Mountain", short: "Explore mountain", text: "A free-roaming atlas of production AI.", icon: Mountain },
];
const LAYERS = [["route", "Expedition route"], ["flow", "AI request flow"], ["agents", "Agents / Sherpas"], ["tools", "MCP / tools"], ["latency", "Latency heatmap"], ["failures", "Failures"], ["telemetry", "Telemetry"], ["trust", "Trust boundaries"], ["dependencies", "Dependencies"]];
// The correct answer is always "evidence" on purpose: every incident in this simulator teaches
// the same instinct-check — trust the trace, not a guess about the model or the headcount.
const DIAGNOSIS_OPTIONS = [
  { id: "model", label: "It's the model — it's just not smart or fast enough here." },
  { id: "evidence", label: "Something specific in the trace — a dependency, some evidence, or a policy." },
  { id: "agents", label: "The team just doesn't have enough agents." },
] as const;
type Drawer = "help" | "tools" | "telemetry" | "report" | "about" | null;
type Outcome = "playing" | "won" | "lost";
type Session = { mode: Mode | null; stage: number; architecture: Architecture; seed: number; difficulty: Difficulty; incidentId: string | null; decisions: DecisionRecord[]; history: HistoryEvent[]; visited: StageId[]; liveUsed: string[]; liveFeed: string[]; earned: string[]; outcome: Outcome; outcomeReason: string };
const initialSession: Session = { mode: null, stage: 0, architecture: DEFAULT_ARCHITECTURE, seed: 42, difficulty: "beginner", incidentId: null, decisions: [], history: [{at: 0, message: "Expedition prepared. A seeded cohort of 1,000 requests is ready."}], visited: [], liveUsed: [], liveFeed: [], earned: [], outcome: "playing", outcomeReason: "" };

function readSession(): Session {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > 1500000) return initialSession;
    const saved = JSON.parse(raw);
    if (saved.version !== 1 || !saved.session || typeof saved.session !== "object") return initialSession;
    const v = saved.session;
    const validMetrics = (m: unknown) => !!m && typeof m === "object" && ["p95", "p50", "quality", "safety", "reliability", "costPerRequest", "totalCost", "completed"].every(k => typeof (m as Record<string,unknown>)[k] === "number" && Number.isFinite((m as Record<string,unknown>)[k]));
    const decisions = Array.isArray(v.decisions) ? v.decisions.filter((d: DecisionRecord) => d && typeof d.id === "string" && typeof d.label === "string" && typeof d.explanation === "string" && Number.isFinite(d.at) && STAGES.some(t => t.id === d.stageId) && validMetrics(d.before) && validMetrics(d.after)).slice(-100) : [];
    const history = Array.isArray(v.history) ? v.history.filter((h: HistoryEvent) => h && Number.isFinite(h.at) && typeof h.message === "string").slice(-200) : initialSession.history;
    return { ...initialSession, mode: MODES.some(m => m.id === v.mode) ? v.mode : null, stage: Number.isInteger(v.stage) ? Math.min(9, Math.max(0, v.stage)) : 0, architecture: normalizeArchitecture(v.architecture && typeof v.architecture === "object" ? v.architecture : {}), seed: Number.isFinite(v.seed) ? v.seed >>> 0 : 42, difficulty: ["beginner", "engineer", "architect"].includes(v.difficulty) ? v.difficulty : "beginner", incidentId: SCENARIOS.some(i => i.id === v.incidentId) ? v.incidentId : null, decisions, history, visited: Array.isArray(v.visited) ? v.visited.filter((id:StageId) => STAGES.some(t => t.id === id)) : [], liveUsed: Array.isArray(v.liveUsed) ? v.liveUsed.filter((id: string) => typeof id === "string").slice(-30) : [], liveFeed: Array.isArray(v.liveFeed) ? v.liveFeed.filter((m: string) => typeof m === "string").slice(-6) : [], earned: Array.isArray(v.earned) ? v.earned.filter((id: string) => ACHIEVEMENTS.some((a) => a.id === id)) : [], outcome: ["playing", "won", "lost"].includes(v.outcome) ? v.outcome : "playing", outcomeReason: typeof v.outcomeReason === "string" ? v.outcomeReason.slice(0, 300) : "" };
  } catch { return initialSession; }
}

export function EverestSimulator() {
  const [session, setSession] = useState<Session>(initialSession);
  const [ready, setReady] = useState(false);
  const [xray, setXray] = useState(false);
  const [cutaway, setCutaway] = useState(false);
  const [layers, setLayers] = useState(["route", "flow", "agents", "failures"]);
  const [layerMenu, setLayerMenu] = useState(false);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [focused, setFocused] = useState(false);
  const [tutorial, setTutorial] = useState(false);
  const [notice, setNotice] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [baseline, setBaseline] = useState<Metrics | null>(null);
  const [selectedIncident, setSelectedIncident] = useState("mcp-timeout");
  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisResult, setDiagnosisResult] = useState("");
  const [diagnosisHint, setDiagnosisHint] = useState(false);
  const [muted, setMutedState] = useState(true);
  const [dismissedResolution, setDismissedResolution] = useState(false);
  const { mode, stage: stageIndex, architecture, seed, difficulty, incidentId, decisions, history, visited } = session;
  const stage = STAGES[stageIndex];
  const incident = SCENARIOS.find(i => i.id === incidentId);
  const metrics = useMemo(() => simulate(architecture, seed, incidentId, difficulty), [architecture, seed, incidentId, difficulty]);
  const report = useMemo(() => {
    const input = { architecture, metrics, decisions, history, seed, difficulty, incidentId, mode: mode ?? "explore" };
    return mode === "incidents" && incidentId ? generateIncidentReport(input) : generateReport(input);
  }, [architecture, metrics, decisions, history, seed, difficulty, incidentId, mode]);

  useEffect(() => {
    // Restore only after hydration. Invalid or blocked browser storage is nonfatal.
    const restored = readSession();
    setSession(restored); setReady(true);
    initAudio(); setMutedState(isMuted());
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => { media.removeEventListener("change", update); stopWind(); };
  }, []);
  function toggleMute() { const next = !muted; setMuted(next); setMutedState(next); }
  useEffect(() => {
    if (mode === "live" && !muted && !paused) {
      startWind();
      setWindIntensity(Math.min(1, Math.max(0, (100 - metrics.reliability) / 40)));
    } else stopWind();
  }, [mode, muted, paused, metrics.reliability]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, session })); } catch { /* The simulator remains usable with storage disabled. */ }
  }, [session, ready]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 7500);
    return () => clearTimeout(timer);
  }, [notice]);

  const logEvent = useCallback((message: string) => {
    setSession(v => ({ ...v, history: [...v.history, { at: (v.history.at(-1)?.at ?? 0) + 5, message, incidentId: v.incidentId }].slice(-200), liveFeed: [...v.liveFeed, message].slice(-6) }));
    setNotice(message);
  }, []);
  function updateArchitecture(patch: Partial<Architecture>, reason: string, choice?: Choice) {
    const next = normalizeArchitecture({ ...architecture, ...patch });
    const after = simulate(next, seed, incidentId, difficulty);
    const at = (history.at(-1)?.at ?? 0) + 5;
    const record: DecisionRecord = { id: choice?.id ?? `change-${at}`, stageId: stage.id, label: choice?.label ?? reason.split(".")[0], explanation: reason, at, incidentId, before: metrics, after };
    setSession(v => ({ ...v, architecture: next, decisions: [...v.decisions, record].slice(-100), history: [...v.history, { at, message: record.label, incidentId }].slice(-200), visited: choice ? Array.from(new Set([...v.visited, stage.id])) : v.visited }));
    if (choice) { decisionClick(); setNotice(`${choice.explanation} p95 ${(metrics.p95/1000).toFixed(2)} → ${(after.p95/1000).toFixed(2)} s.`); }
  }
  function dismissTutorial() { setTutorial(false); try { localStorage.setItem("everest-orientation-seen", "1"); } catch { /* optional preference */ } }
  function enterMode(nextMode: Mode) {
    setSession(v => ({...v, mode: nextMode, incidentId: null, stage: nextMode === "guided" || nextMode === "live" ? 0 : v.stage, outcome: "playing", outcomeReason: "", ...(nextMode === "live" ? { seed: (Date.now() >>> 0), liveUsed: [], liveFeed: [] } : {}) }));
    setCutaway(false); setFocused(false); setPanelOpen(true); setDiagnosis(""); setDiagnosisResult(""); setDiagnosisHint(false); setPaused(false); setDismissedResolution(false);
    if (nextMode === "lab") { setXray(true); setLayers(v => Array.from(new Set([...v,"latency","dependencies"]))); }
    try { if (!localStorage.getItem("everest-orientation-seen")) setTutorial(true); } catch { setTutorial(true); }
  }
  const selectStage = useCallback((index: number) => { setSession(v => ({...v, stage:index, mode: v.mode ?? "explore"})); setFocused(true); setCutaway(false); setPanelOpen(true); }, []);
  function selectStageId(id: StageId) { selectStage(Math.max(0, STAGES.findIndex(t => t.id === id))); setDrawer(null); }
  function overview() { setFocused(false); setCutaway(false); setResetKey(n => n+1); }
  function triggerIncident(id: string) {
    const selected = SCENARIOS.find(i => i.id === id);
    if (!selected) return;
    setSession(v => ({ ...v, incidentId: id, stage: STAGES.findIndex(t => t.id === selected.stageId), history: [...v.history, { at: (v.history.at(-1)?.at ?? 0) + 5, message: `Incident triggered: ${selected.title}`, incidentId: id }].slice(-200) }));
    setFocused(false); setXray(true); setPanelOpen(true); setDiagnosis(""); setDiagnosisResult(""); setDiagnosisHint(false); setLayers(v => Array.from(new Set([...v, "failures", "latency", "tools"])));
    alertTone();
    setNotice(selected.mountain);
  }
  function nextStage() {
    if (stageIndex === STAGES.length-1) {setDrawer("report"); return;}
    const index = stageIndex+1;
    selectStage(index);
    if (index === 6) triggerIncident("mcp-timeout");
    else if (index === 7) triggerIncident("prompt-injection");
    else setSession(v => ({...v, incidentId: null}));
  }
  function replay() {
    const restarts = mode === "guided" || mode === "live";
    setSession(v => ({...v, decisions: [], history: [{ at:0, message:"Replayed the same seed, architecture and incident conditions.", incidentId:v.incidentId }], visited: restarts ? [] : v.visited, stage: restarts ? 0 : v.stage, incidentId: restarts ? null : v.incidentId, liveUsed: mode === "live" ? [] : v.liveUsed, liveFeed: mode === "live" ? [] : v.liveFeed}));
    setResetKey(n=>n+1); if (mode === "live") setPaused(false); setNotice(`Same conditions replayed / seed ${seed}. Pin a baseline before changing the architecture to compare results.`);
  }
  const inspectObject = useCallback((kind: string, label: string) => {
    setNotice(`${label} / ${kind}`);
    if (/mcp|tool|radio|permission/i.test(`${kind} ${label}`)) setDrawer("tools");
    else setDrawer("telemetry");
  }, []);
  const latestDecision = [...decisions].reverse().find(d => d.stageId === stage.id && d.incidentId === incidentId);
  const choices = incident ? incident.choices : stage.choices;

  // A small, honest reward loop: check after every relevant change whether a real, checkable
  // architecture fact now qualifies for a badge, and award only what's newly true.
  useEffect(() => {
    if (mode === "live" || mode === null) return;
    const have = new Set(session.earned);
    const qualifying = qualifiedAchievements({ architecture, metrics, decisions, stageIndex });
    const fresh = qualifying.filter((id) => !have.has(id));
    if (!fresh.length) return;
    const unlocked = fresh.map((id) => ACHIEVEMENTS.find((a) => a.id === id)!);
    setSession((v) => ({ ...v, earned: Array.from(new Set([...v.earned, ...fresh])) }));
    successChime();
    setNotice(`New badge${unlocked.length > 1 ? "s" : ""}: ${unlocked.map((a) => `${a.icon} ${a.label}`).join(" · ")}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisions.length, stageIndex, metrics.slo.cost, architecture.retries, architecture.retryStrategy, architecture.fallbackEnabled, architecture.toolPermissions]);

  // Reaching the summit is a win in both narrative modes. Architecture Lab, Incident Drills and
  // Explore stay sandboxes on purpose — there is nothing to win or lose while practicing.
  useEffect(() => {
    if (session.outcome !== "playing") return;
    if (mode === "guided" && stageIndex === STAGES.length - 1 && !incidentId) {
      setSession(v => v.outcome === "playing" ? { ...v, outcome: "won" } : v);
      fanfare();
    }
  }, [mode, stageIndex, incidentId, session.outcome]);
  useEffect(() => { if (session.outcome !== "playing") setDismissedResolution(false); }, [session.outcome]);

  if (mode === "live") return <LiveAdventure onExit={() => { setSession(v => ({ ...v, mode: null })); setTutorial(false); }} />;

  return <div className={s.shell} data-mode={mode ?? "entry"}>
    <div className={s.topbar}>
      <Link href="/projects" className={s.backLink}><ArrowLeft size={15}/><span>Projects</span></Link>
      <button className={s.brand} onClick={() => {setSession(v=>({...v,mode:null})); overview();}} aria-label="Everest entry screen"><Mountain size={23}/><span>EVEREST <small>// AI IN PRODUCTION</small></span></button>
      <div className={s.headerActions}>{mode && <label className={s.modeSelect}><span className={s.srOnly}>Experience mode</span><select value={mode} onChange={e=>enterMode(e.target.value as Mode)}>{MODES.map(m=><option key={m.id} value={m.id}>{m.short}</option>)}</select><ChevronDown size={13}/></label>}<button className={s.iconButton} onClick={toggleMute} aria-label={muted?"Unmute sound effects":"Mute sound effects"} aria-pressed={!muted}>{muted?<VolumeX size={19}/>:<Volume2 size={19}/>}</button><button className={s.iconButton} onClick={()=>setDrawer("about")} aria-label="What is this project?"><Info size={19}/></button><button className={s.iconButton} onClick={()=>setDrawer("help")} aria-label="Help and glossary"><HelpCircle size={19}/></button></div>
    </div>
    <div className={s.world}>
      <MountainScene selectedStage={mode && focused ? stageIndex : null} onSelectStage={selectStage} xray={xray} cutaway={cutaway} layers={layers} metrics={metrics} architecture={architecture} incident={incidentId} paused={paused || !mode} reducedMotion={reducedMotion} resetKey={resetKey} onInspect={inspectObject}/>
      {!mode ? <>
        <div className={s.entryCoordinates}><span>27°59′ N / 86°55′ E</span><span>SOUTH COL / SYSTEM ROUTE</span></div>
        <section className={s.entry}>
          <p className={s.eyebrow}><span className={s.liveDot}/> AN INTERACTIVE AI EXPEDITION</p>
          <h1>EVEREST<span>// AI IN PRODUCTION</span></h1>
          <p className={s.entryTagline}>Climb the mountain.<br/>Operate the system.<br/><span>Survive production.</span></p>
          <p className={s.entryIntro}>Deploy a team of AI Sherpas. Guide workloads from Base Camp to the summit. Learn what it takes to make AI work in the real world.</p>
          <ul className={s.learnList} aria-label="What you'll learn">
            <li>How an AI agent actually connects to tools and data through MCP</li>
            <li>Why a bigger model, more agents, or more retries can make things worse</li>
            <li>How real production systems detect, survive, and recover from failure</li>
            <li>How to read latency, cost, quality, and safety as one trade-off, not four</li>
          </ul>
          <div className={s.modeCards}>{MODES.map((m,i)=><button key={m.id} className={i===0?s.primaryMode:s.modeCard} onClick={()=>enterMode(m.id)}><m.icon size={19}/><span><strong>{m.label}</strong><small>{i===0?"Recommended · 10–15 minutes":m.text}</small></span><ArrowRight size={17}/></button>)}</div>
          <div className={s.entryLinks}>
            <button className={s.tourButton} onClick={()=>setTutorial(true)}><Compass size={14}/> How to play <span>the goal, the controls, how you win</span></button>
            <button className={s.tourButton} onClick={()=>setDrawer("about")}><Info size={14}/> What is this, exactly? <span>60-second tour</span></button>
          </div>
          <p className={s.entryNote}>A software engineering simulation. No login or API key needed.</p>
        </section>
        <div className={s.entryCaption}><span>8,849 M</span><strong>THE SUMMIT IS A SYSTEM THAT WORKS.</strong><small>Drag to rotate · Scroll / pinch to zoom · Click a camp</small></div>
        <p className={s.disclaimer}>This experience uses a simplified Everest expedition as a metaphor for production AI systems. It is not mountaineering, medical, survival, or expedition safety guidance.</p>
      </> : <>
        <div className={s.mapToolbar}>{mode==="guided"&&<button className={s.toolbarButton} onClick={()=>setDrawer("telemetry")} title="How many of the 5 expedition targets are currently on target"><span aria-hidden="true">🎯</span><span>Goal: reach the summit · {[metrics.slo.latency,metrics.slo.reliability,metrics.slo.cost,metrics.slo.quality,metrics.slo.safety].filter(Boolean).length}/5 on target</span></button>}<button className={`${s.xrayButton} ${xray?s.active:""}`} aria-pressed={xray} onClick={()=>setXray(v=>!v)}><Eye size={16}/> X-RAY SYSTEM <span>{xray?"ON":"OFF"}</span></button><button className={s.toolbarButton} onClick={()=>setLayerMenu(v=>!v)} aria-expanded={layerMenu}><Layers size={16}/><span>Layers</span></button><button className={s.toolbarButton} onClick={overview}><RotateCcw size={15}/><span>Overview</span></button><button className={s.toolbarButton} onClick={()=>setPaused(v=>!v)} aria-label={paused?"Resume request flow":"Pause request flow"}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></div>
        {layerMenu && <div className={s.layerMenu}><span className={s.eyebrow}>MAP LAYERS</span>{LAYERS.map(([id,label])=><label key={id}><input type="checkbox" checked={layers.includes(id)} onChange={()=>setLayers(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}/>{label}</label>)}</div>}
        <aside className={s.navigator} aria-label="Expedition stages">
          <span className={s.eyebrow}>{mode==="guided"?"YOUR EXPEDITION":"MOUNTAIN ATLAS"}</span>
          <h2>{mode==="guided"?"The way up.":"A system in layers."}</h2>
          <p>{mode==="guided"?`${visited.length} / 10 stages explored` : "Select a camp to inspect its system."}</p>
          <nav>{STAGES.map((t,i)=><button key={t.id} className={stageIndex===i?s.selectedStage:""} aria-current={stageIndex===i?"step":undefined} onClick={()=>selectStage(i)}><span className={s.stageNumber}>{visited.includes(t.id)?<Check size={12}/>:String(i).padStart(2,"0")}</span><span><strong>{t.name}</strong><small>{t.concept}</small></span>{stageIndex===i&&<span className={s.stageDot}/>}</button>)}</nav>
          <div className={s.navFoot}><Shield size={16}/><span>Expedition contract<strong>{metrics.slo.passed?"All targets met":"Targets need attention"}</strong></span></div>
        </aside>
        {!panelOpen && <button className={s.restorePanel} onClick={()=>setPanelOpen(true)}><BookOpen size={16}/> Open {mode==="lab"?"architecture":"field notes"}</button>}
        {panelOpen && <aside className={s.learning} aria-label={mode==="lab"?"Architecture controls":"Camp field notes"}>
          <div className={s.panelHeader}><span className={s.eyebrow}>{mode==="lab"?"DESIGN YOUR SYSTEM":incident?"INCIDENT IN PROGRESS":"EXPEDITION FIELD NOTES"}</span><button className={s.iconButton} onClick={()=>setPanelOpen(false)} aria-label="Collapse field notes"><X size={16}/></button></div>
          <div className={s.audience}><span>Detail</span>{(["beginner","engineer","architect"] as const).map(d=><button key={d} aria-pressed={difficulty===d} onClick={()=>{setSession(v=>({...v,difficulty:d})); if(d==="architect"){setXray(true);setLayers(v=>Array.from(new Set([...v,"trust","dependencies","tools"])));}}}>{d==="beginner"?"Simple":d[0].toUpperCase()+d.slice(1)}</button>)}</div>
          <div className={s.panelScroll}>
            {mode==="lab" ? <><h2>Architecture Lab</h2><div className={s.seedRow}><label>Seed<input type="number" min="0" max="4294967295" value={seed} onChange={e=>setSession(v=>({...v,seed:Number(e.target.value)>>>0}))}/></label><button className={s.textButton} onClick={()=>{setBaseline(metrics);setNotice("Baseline pinned. Every change now compares the same workload against this snapshot.");}}>Pin baseline</button></div>{baseline&&<div className={s.comparison}><strong>Compared with pinned run</strong><span>p95 {((metrics.p95-baseline.p95)/1000).toFixed(2)} s · Quality {(metrics.quality-baseline.quality).toFixed(1)} · Cost ${(metrics.costPerRequest-baseline.costPerRequest).toFixed(4)}</span></div>}<ArchitectureControls architecture={architecture} onChange={updateArchitecture}/><div className={s.callout}><strong>Challenge: 1,000 requests</strong><p>Success ≥99%, p95 &lt;3 seconds, quality ≥90, cost &lt;$0.01 per request, no policy violations.</p><strong>{metrics.slo.passed?"✓ Contract met":"△ Keep testing the trade-offs"}</strong></div></> : <>
              {mode==="incidents"&&<div className={s.incidentPicker}><label className={s.selectField}>Choose a production incident<select value={selectedIncident} onChange={e=>setSelectedIncident(e.target.value)}>{SCENARIOS.map(i=><option key={i.id} value={i.id}>{i.title}</option>)}</select></label><div className={s.buttonRow}><button className={s.secondaryButton} onClick={()=>triggerIncident(selectedIncident)}><TriangleAlert size={14}/> Trigger incident</button><button className={s.textButton} onClick={()=>{const next=(seed+1)>>>0;setSession(v=>({...v,seed:next})); const id=SCENARIOS[next%SCENARIOS.length].id;setSelectedIncident(id);triggerIncident(id);}}>Random drill</button></div></div>}
              <div className={s.stageTitle}><span>{stage.altitude} / STOP {String(stageIndex).padStart(2,"0")}</span><h2>{incident?incident.title:stage.name}</h2><p>{stage.concept}</p></div>
              <div className={s.situation}><Mountain size={17}/><p>{incident?incident.mountain:stage.situation}</p></div>
              <p className={s.explanation}>{incident?incident.system:stage.explanation}</p>
              {incident&&<>
                <div className={s.signalBox}><strong>Observable signals</strong><ul>{incident.symptoms.map((signal,i)=><li key={i}>{signal}</li>)}</ul><button className={s.textButton} onClick={()=>setDrawer("telemetry")}><Activity size={14}/> Inspect the trace</button></div>
                <h3 className={s.decisionTitle}>Quick check: what's actually causing this?</h3>
                <p className={s.explanation}>Look at the signals above, then pick the explanation the evidence actually supports. This is a warm-up — it won't stop you from picking a fix below either way.</p>
                <div className={s.choiceList}>{DIAGNOSIS_OPTIONS.map(opt=><div key={opt.id}><button aria-pressed={diagnosis===opt.id} onClick={()=>{setDiagnosis(opt.id); setDiagnosisResult(opt.id==="evidence"?`Good instinct — that's exactly what the evidence supports. ${incident.rootCause}`:opt.id==="model"?`Not quite. Check the model's own span in the trace — is it actually the slow or failing part? ${incident.rootCause}`:`Not quite. More agents can't fix a broken dependency, a permission problem, or bad data. ${incident.rootCause}`); logEvent(`Diagnosis: ${opt.label}`);}}><span>{opt.label}</span>{diagnosis===opt.id?<Check size={15}/>:<ArrowRight size={14}/>}</button></div>)}</div>
                <button className={s.textButton} onClick={()=>setDiagnosisHint(v=>!v)}><Lightbulb size={13}/> {diagnosisHint?"Hide the hint":"Need a hint?"}</button>
                {diagnosisHint&&<p className={s.callout}>{incident.misleadingSignal}</p>}
                {diagnosisResult&&<p className={s.callout} data-tone={diagnosis==="evidence"?"good":"retry"}>{diagnosisResult}</p>}
              </>}
              <h3 className={s.decisionTitle}>{incident?"Choose a mitigation":"Make an architecture decision"}</h3>
              <div className={s.choiceList}>{choices.map(choice=><div key={choice.id}><button onClick={()=>updateArchitecture(choice.patch,choice.explanation,choice)} aria-pressed={latestDecision?.id===choice.id}><span>{choice.label}</span>{latestDecision?.id===choice.id?<Check size={15}/>:<ArrowRight size={14}/>}</button><details><summary>Why?</summary><p>{choice.explanation}</p></details></div>)}</div>
              {latestDecision&&<div className={s.outcome} role="status"><span className={s.eyebrow}>CONSEQUENCE</span><p>{latestDecision.explanation}</p><span>p95 {(latestDecision.before.p95/1000).toFixed(2)} → {(latestDecision.after.p95/1000).toFixed(2)} s · Quality {Math.round(latestDecision.before.quality)} → {Math.round(latestDecision.after.quality)}</span></div>}
              {stageIndex===0&&!incident&&<TrainingStation architecture={architecture} onChange={updateArchitecture} onEvent={logEvent}/>}
              {(stageIndex===9 || stageIndex===1)&&!incident&&<EvaluationStation architecture={architecture} onChange={updateArchitecture}/>}
              {stageIndex===5&&<button className={s.secondaryButton} onClick={()=>setDrawer("tools")}><Radio size={16}/> Enter the MCP radio tent</button>}
              <details className={s.lessonDetails}><summary>Why this matters</summary><p>{stage.why}</p><h4>The mountain analogy</h4><p>{stage.analogy}</p><h4>In production</h4><p>{stage.example}</p><h4>What can go wrong</h4><p>{stage.failure}</p><h4>A good pattern</h4><p>{stage.pattern}</p></details>
              {difficulty!=="beginner"&&<div className={s.technicalNote}><span className={s.eyebrow}>{difficulty==="architect"?"ARCHITECT NOTE":"ENGINEERING NOTE"}</span><p>{difficulty==="architect"?stage.architect:stage.example}</p><p>{stage.pattern}</p></div>}
              {incident&&latestDecision&&<details className={s.lessonDetails} open><summary>Root cause & prevention</summary><p>{incident.rootCause}</p><p>{incident.prevention}</p></details>}
              <blockquote>{incident?incident.lesson:stage.takeaway}</blockquote>
              <button className={s.textButton} onClick={()=>{setCutaway(v=>!v);setFocused(true);}}><Eye size={15}/>{cutaway?"Exit camp cutaway":"Explore camp interior"}</button>
            </>}
          </div>
          <div className={s.panelFooter}>{mode==="guided"?<button className={s.primaryButton} disabled={!visited.includes(stage.id)} onClick={nextStage}>{stageIndex===9?"View Expedition Debrief":stageIndex===0?"Continue to Base Camp":stageIndex===1?"Deploy Expedition":"Continue the ascent"}<ArrowRight size={16}/></button>:<button className={s.primaryButton} onClick={()=>setDrawer("report")}><FileText size={16}/>{mode==="incidents"?"View Incident Postmortem":"View Production Debrief"}</button>}{mode==="guided"&&!visited.includes(stage.id)&&<small>Try a decision to see its effect, then continue.</small>}</div>
        </aside>}
        <div className={s.bottomTools}><button onClick={()=>setDrawer("tools")}><Radio size={15}/><span>MCP inspector</span></button><button onClick={()=>setDrawer("telemetry")}><Activity size={15}/><span>Control room</span></button><button onClick={()=>setDrawer("report")}><FileText size={15}/><span>Debrief</span></button><button onClick={replay}><RotateCcw size={15}/><span>Replay same conditions</span></button><span className={s.simulationLabel}>SIMULATED / SEED {seed}</span></div>
        {incident&&<div className={s.incidentFlag}><TriangleAlert size={15}/><span>{metrics.degraded?"Degraded operation":metrics.circuitOpen?"Circuit open":`Incident: ${incident.title}`}</span><button onClick={()=>{setSession(v=>({...v,incidentId:null})); setPaused(false); logEvent("External incident cleared. Compare recovered metrics with the incident run.");}}>Clear incident</button></div>}
        {mode&&session.outcome!=="playing"&&!dismissedResolution&&<ResolutionScreen tier={session.outcome==="lost"?"lost":metrics.slo.passed?"won":"partial"} reason={session.outcome==="lost"?session.outcomeReason:metrics.slo.passed?"Every target in the expedition contract was met — latency, success, cost, quality and safety all held.":"The climb succeeded, but the expedition contract wasn't fully met. Open the debrief to see exactly what to fix next run."} slo={metrics.slo} onPlayAgain={()=>enterMode(mode)} onViewDebrief={()=>{setDismissedResolution(true); setDrawer("report");}} />}
      </>}
      {tutorial&&<MissionBriefing mode={mode} onDone={dismissTutorial} />}
      {notice&&mode&&<div className={s.toast} role="status"><span>{notice}</span><button onClick={()=>setNotice("")} aria-label="Dismiss update"><X size={14}/></button></div>}
    </div>
    {mode&&<MetricBar metrics={metrics} onInspect={()=>setDrawer("telemetry")}/>}
    {drawer&&<Modal title={drawer==="help"?"Help, legend & glossary":drawer==="tools"?"The MCP radio tent":drawer==="telemetry"?"Expedition control room":drawer==="about"?"What is Everest // AI in Production?":report.title} onClose={()=>setDrawer(null)} report={drawer==="report"}>
      {drawer==="about"&&<AboutPanel onStart={(m)=>{setDrawer(null);enterMode(m);}}/>}
      {drawer==="help"&&<><HelpPanel onStage={selectStageId} showTutorial={()=>{setDrawer(null);if(!mode)enterMode("explore");setTutorial(true);}}/><div className={s.dialogBody}><label className={s.toggleField}><span><strong>Reduce motion</strong><small>Keep the map interactive with fewer animated effects.</small></span><input type="checkbox" checked={reducedMotion} onChange={e=>setReducedMotion(e.target.checked)}/></label><button className={s.secondaryButton} onClick={()=>{setSession(initialSession);setDrawer(null);overview();setBaseline(null);setNotice("");try{localStorage.removeItem(STORAGE_KEY);}catch{ /* optional storage */ }}}>Reset this expedition</button></div></>}
      {drawer==="tools"&&<ToolInspector onEvent={logEvent}/>}
      {drawer==="telemetry"&&<Observability metrics={metrics} history={history} onStage={selectStageId}/>}
      {drawer==="report"&&<ReportPanel report={report}/>}
    </Modal>}
  </div>;
}
