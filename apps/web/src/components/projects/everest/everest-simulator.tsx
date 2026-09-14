"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, Compass, Eye, FileText, Flame, HelpCircle, Layers, Mountain, Pause, Play, Radio, RotateCcw, Settings2, Shield, SlidersHorizontal, TriangleAlert, X } from "lucide-react";
import { STAGES, SCENARIOS } from "./content";
import { DEFAULT_ARCHITECTURE, createRandom, normalizeArchitecture, simulate } from "./engine";
import { arrivalLine, chatterLine, incidentChance, pickNextIncident } from "./live-run";
import { generateIncidentReport, generateReport } from "./reports";
import type { Architecture, Choice, DecisionRecord, Difficulty, HistoryEvent, Metrics, Mode, StageId } from "./types";
import { ArchitectureControls } from "./architecture-controls";
import { LiveHud } from "./live-hud";
import { EvaluationStation, HelpPanel, MetricBar, Modal, Observability, ReportPanel, TrainingStation } from "./simulator-panels";
import s from "./everest-simulator.module.css";

const MountainScene = dynamic(() => import("./mountain-scene"), { ssr: false, loading: () => <div className={s.preparing}><Mountain size={36} /><strong>Preparing expedition…</strong><span>Loading terrain · Establishing camps · Connecting tools</span></div> });
const ToolInspector = dynamic(() => import("./tool-inspector"), { loading: () => <p className={s.dialogBody}>Connecting the radio tent…</p> });
const STORAGE_KEY = "everest-expedition-v1";
const MODES: { id: Mode; label: string; short: string; text: string; icon: typeof Compass }[] = [
  { id: "guided", label: "Start Guided Expedition", short: "Guided expedition", text: "Your first ascent. Learn by making decisions.", icon: Compass },
  { id: "live", label: "Start Live Expedition", short: "Live expedition", text: "Real time and randomized. Climb while the system takes real hits.", icon: Flame },
  { id: "incidents", label: "Incident Drills", short: "Incident drills", text: "Find the failure. Recover the system.", icon: TriangleAlert },
  { id: "lab", label: "Architecture Lab", short: "Architecture lab", text: "Change the design. Test the trade-offs.", icon: SlidersHorizontal },
  { id: "explore", label: "Explore Mountain", short: "Explore mountain", text: "A free-roaming atlas of production AI.", icon: Mountain },
];
const LAYERS = [["route", "Expedition route"], ["flow", "AI request flow"], ["agents", "Agents / Sherpas"], ["tools", "MCP / tools"], ["latency", "Latency heatmap"], ["failures", "Failures"], ["telemetry", "Telemetry"], ["trust", "Trust boundaries"], ["dependencies", "Dependencies"]];
type Drawer = "help" | "tools" | "telemetry" | "report" | null;
type Session = { mode: Mode | null; stage: number; architecture: Architecture; seed: number; difficulty: Difficulty; incidentId: string | null; decisions: DecisionRecord[]; history: HistoryEvent[]; visited: StageId[]; liveUsed: string[]; liveFeed: string[] };
const initialSession: Session = { mode: null, stage: 0, architecture: DEFAULT_ARCHITECTURE, seed: 42, difficulty: "beginner", incidentId: null, decisions: [], history: [{at: 0, message: "Expedition prepared. A seeded cohort of 1,000 requests is ready."}], visited: [], liveUsed: [], liveFeed: [] };

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
    return { ...initialSession, mode: MODES.some(m => m.id === v.mode) ? v.mode : null, stage: Number.isInteger(v.stage) ? Math.min(9, Math.max(0, v.stage)) : 0, architecture: normalizeArchitecture(v.architecture && typeof v.architecture === "object" ? v.architecture : {}), seed: Number.isFinite(v.seed) ? v.seed >>> 0 : 42, difficulty: ["beginner", "engineer", "architect"].includes(v.difficulty) ? v.difficulty : "beginner", incidentId: SCENARIOS.some(i => i.id === v.incidentId) ? v.incidentId : null, decisions, history, visited: Array.isArray(v.visited) ? v.visited.filter((id:StageId) => STAGES.some(t => t.id === id)) : [], liveUsed: Array.isArray(v.liveUsed) ? v.liveUsed.filter((id: string) => typeof id === "string").slice(-30) : [], liveFeed: Array.isArray(v.liveFeed) ? v.liveFeed.filter((m: string) => typeof m === "string").slice(-6) : [] };
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
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
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
    if (choice) setNotice(`${choice.explanation} p95 ${(metrics.p95/1000).toFixed(2)} → ${(after.p95/1000).toFixed(2)} s.`);
  }
  function dismissTutorial() { setTutorial(false); try { localStorage.setItem("everest-orientation-seen", "1"); } catch { /* optional preference */ } }
  function enterMode(nextMode: Mode) {
    setSession(v => ({...v, mode: nextMode, incidentId: null, stage: nextMode === "guided" || nextMode === "live" ? 0 : v.stage, ...(nextMode === "live" ? { seed: (Date.now() >>> 0), liveUsed: [], liveFeed: [] } : {}) }));
    setCutaway(false); setFocused(false); setPanelOpen(true); setDiagnosis(""); setDiagnosisResult(""); setPaused(false);
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
    setFocused(false); setXray(true); setPanelOpen(true); setDiagnosis(""); setDiagnosisResult(""); setLayers(v => Array.from(new Set([...v, "failures", "latency", "tools"])));
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

  // Live Expedition: an unattended clock that chatters, climbs and occasionally rolls a random,
  // reachable incident. Reads and writes go through refs so the interval survives re-renders
  // without restarting, while every branch still calls the same handlers a manual click would.
  const sessionRef = useRef(session); useEffect(() => { sessionRef.current = session; }, [session]);
  const pausedRef = useRef(paused); useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => {
    if (mode !== "live") return;
    const timer = setInterval(() => {
      const v = sessionRef.current;
      if (v.mode !== "live" || pausedRef.current || v.incidentId) return;
      const at = (v.history.at(-1)?.at ?? 0) + 16;
      const rng = createRandom((v.seed + at * 2654435761) >>> 0);
      if (rng() < 0.7) logEvent(chatterLine(v.stage, rng));
      const candidate = rng() < incidentChance(v.stage) ? pickNextIncident(v.stage, v.liveUsed, rng) : null;
      if (candidate) {
        setSession(s => ({ ...s, liveUsed: [...s.liveUsed, candidate.id] }));
        triggerIncident(candidate.id);
        setPaused(true);
        return;
      }
      if (v.stage < STAGES.length - 1 && rng() < 0.62) {
        const nextIndex = v.stage + 1;
        selectStage(nextIndex);
        logEvent(arrivalLine(nextIndex, rng));
        if (nextIndex === STAGES.length - 1) setPaused(true);
      }
    }, 2600);
    return () => clearInterval(timer);
    // triggerIncident/logEvent/selectStage close only over stable setState functions and module
    // constants, so calling the versions captured when the interval was created is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return <div className={s.shell} data-mode={mode ?? "entry"}>
    <div className={s.topbar}>
      <Link href="/projects" className={s.backLink}><ArrowLeft size={15}/><span>Projects</span></Link>
      <button className={s.brand} onClick={() => {setSession(v=>({...v,mode:null})); overview();}} aria-label="Everest entry screen"><Mountain size={23}/><span>EVEREST <small>// AI IN PRODUCTION</small></span></button>
      <div className={s.headerActions}>{mode && <label className={s.modeSelect}><span className={s.srOnly}>Experience mode</span><select value={mode} onChange={e=>enterMode(e.target.value as Mode)}>{MODES.map(m=><option key={m.id} value={m.id}>{m.short}</option>)}</select><ChevronDown size={13}/></label>}<button className={s.iconButton} onClick={()=>setDrawer("help")} aria-label="Help and glossary"><HelpCircle size={19}/></button></div>
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
          <div className={s.modeCards}>{MODES.map((m,i)=><button key={m.id} className={i===0?s.primaryMode:s.modeCard} onClick={()=>enterMode(m.id)}><m.icon size={19}/><span><strong>{m.label}</strong><small>{i===0?"Recommended · 10–15 minutes":m.text}</small></span><ArrowRight size={17}/></button>)}</div>
          <p className={s.entryNote}>A software engineering simulation. No login or API key needed.</p>
        </section>
        <div className={s.entryCaption}><span>8,849 M</span><strong>THE SUMMIT IS A SYSTEM THAT WORKS.</strong><small>Drag to rotate · Scroll / pinch to zoom · Click a camp</small></div>
        <p className={s.disclaimer}>This experience uses a simplified Everest expedition as a metaphor for production AI systems. It is not mountaineering, medical, survival, or expedition safety guidance.</p>
      </> : <>
        <div className={s.mapToolbar}><button className={`${s.xrayButton} ${xray?s.active:""}`} aria-pressed={xray} onClick={()=>setXray(v=>!v)}><Eye size={16}/> X-RAY SYSTEM <span>{xray?"ON":"OFF"}</span></button><button className={s.toolbarButton} onClick={()=>setLayerMenu(v=>!v)} aria-expanded={layerMenu}><Layers size={16}/><span>Layers</span></button><button className={s.toolbarButton} onClick={overview}><RotateCcw size={15}/><span>Overview</span></button><button className={s.toolbarButton} onClick={()=>setPaused(v=>!v)} aria-label={paused?"Resume request flow":"Pause request flow"}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></div>
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
              {incident&&<><div className={s.signalBox}><strong>Observable signals</strong><ul>{incident.symptoms.map((signal,i)=><li key={i}>{signal}</li>)}</ul>{difficulty!=="beginner"&&<p>{incident.misleadingSignal}</p>}<button className={s.textButton} onClick={()=>setDrawer("telemetry")}><Activity size={14}/> Inspect the trace</button></div><label className={s.selectField}>Your diagnosis<select value={diagnosis} onChange={e=>{setDiagnosis(e.target.value);setDiagnosisResult("");}}><option value="">Identify the failing part…</option><option value="model">The model alone is always the bottleneck</option><option value="evidence">The failing dependency, evidence or policy shown in the trace</option><option value="agents">Too few agents, regardless of the observed symptoms</option></select></label><button className={s.textButton} disabled={!diagnosis} onClick={()=>{const text=diagnosis==="evidence"?`Diagnosis supported: ${incident.rootCause}`:"That diagnosis does not explain these signals. Inspect the failing span and compare model time with dependency time.";setDiagnosisResult(text);logEvent(text);}}>Check diagnosis</button>{diagnosisResult&&<p className={s.callout}>{diagnosisResult}</p>}</>}
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
          <div className={s.panelFooter}>{mode==="guided"?<button className={s.primaryButton} disabled={!visited.includes(stage.id)} onClick={nextStage}>{stageIndex===9?"View Expedition Debrief":stageIndex===0?"Continue to Base Camp":stageIndex===1?"Deploy Expedition":"Continue the ascent"}<ArrowRight size={16}/></button>:mode==="live"?(incident?<button className={s.primaryButton} disabled={!latestDecision} onClick={()=>{setSession(v=>({...v,incidentId:null})); setPaused(false);}}>Resume the climb<ArrowRight size={16}/></button>:stageIndex===9?<button className={s.primaryButton} onClick={()=>setDrawer("report")}><FileText size={16}/>View Expedition Debrief</button>:<button className={s.primaryButton} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={16}/>:<Pause size={16}/>}{paused?"Resume the climb":"Pause the climb"}</button>):<button className={s.primaryButton} onClick={()=>setDrawer("report")}><FileText size={16}/>{mode==="incidents"?"View Incident Postmortem":"View Production Debrief"}</button>}{mode==="guided"&&!visited.includes(stage.id)&&<small>Try a decision to see its effect, then continue.</small>}{mode==="live"&&incident&&!latestDecision&&<small>Choose a mitigation to be able to resume the climb.</small>}</div>
        </aside>}
        <div className={s.bottomTools}><button onClick={()=>setDrawer("tools")}><Radio size={15}/><span>MCP inspector</span></button><button onClick={()=>setDrawer("telemetry")}><Activity size={15}/><span>Control room</span></button><button onClick={()=>setDrawer("report")}><FileText size={15}/><span>Debrief</span></button><button onClick={replay}><RotateCcw size={15}/><span>Replay same conditions</span></button><span className={s.simulationLabel}>SIMULATED / SEED {seed}</span></div>
        {incident&&<div className={s.incidentFlag}><TriangleAlert size={15}/><span>{metrics.degraded?"Degraded operation":metrics.circuitOpen?"Circuit open":`Incident: ${incident.title}`}</span><button onClick={()=>{setSession(v=>({...v,incidentId:null})); setPaused(false); logEvent("External incident cleared. Compare recovered metrics with the incident run.");}}>Clear incident</button></div>}
        {mode==="live"&&<LiveHud stageIndex={stageIndex} elapsedAt={history.at(-1)?.at ?? 0} paused={paused} incidentTitle={incident?.title} feed={session.liveFeed} />}
        {tutorial&&<div className={s.tutorial}><div><Compass size={22}/><span className={s.eyebrow}>A 20-SECOND ORIENTATION</span><button className={s.iconButton} onClick={dismissTutorial} aria-label="Skip orientation"><X size={16}/></button></div><p>{mode==="live"?"The climb runs on its own — watch the strip at the top. Random, real incidents will surface as you go; when one does, the climb pauses so you can pick a fix. Pause anytime with the button above the map.":"Drag to rotate. Scroll or pinch to zoom. Click a glowing camp, or use the stage list. Switch on X-ray to see the system inside."}</p><strong>{mode==="live"?"Every random failure here is a real production failure mode, playing out live.":"Every mountain problem maps to a production problem."}</strong><button className={s.textButton} onClick={dismissTutorial}>Start exploring <ArrowRight size={14}/></button></div>}
      </>}
      {notice&&mode&&<div className={s.toast} role="status"><span>{notice}</span><button onClick={()=>setNotice("")} aria-label="Dismiss update"><X size={14}/></button></div>}
    </div>
    {mode&&<MetricBar metrics={metrics} onInspect={()=>setDrawer("telemetry")}/>}
    {drawer&&<Modal title={drawer==="help"?"Help, legend & glossary":drawer==="tools"?"The MCP radio tent":drawer==="telemetry"?"Expedition control room":report.title} onClose={()=>setDrawer(null)} report={drawer==="report"}>
      {drawer==="help"&&<><HelpPanel onStage={selectStageId} showTutorial={()=>{setDrawer(null);if(!mode)enterMode("explore");setTutorial(true);}}/><div className={s.dialogBody}><label className={s.toggleField}><span><strong>Reduce motion</strong><small>Keep the map interactive with fewer animated effects.</small></span><input type="checkbox" checked={reducedMotion} onChange={e=>setReducedMotion(e.target.checked)}/></label><button className={s.secondaryButton} onClick={()=>{setSession(initialSession);setDrawer(null);overview();setBaseline(null);setNotice("");try{localStorage.removeItem(STORAGE_KEY);}catch{ /* optional storage */ }}}>Reset this expedition</button></div></>}
      {drawer==="tools"&&<ToolInspector onEvent={logEvent}/>}
      {drawer==="telemetry"&&<Observability metrics={metrics} history={history} onStage={selectStageId}/>}
      {drawer==="report"&&<ReportPanel report={report}/>}
    </Modal>}
  </div>;
}
