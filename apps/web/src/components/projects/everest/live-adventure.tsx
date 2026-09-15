"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Award, BookOpen, Check, Compass, Eye, Flag, Heart, HelpCircle, Lightbulb, Mountain, Pause, Play, Radio, RotateCcw, Sparkles, Star, Volume2, VolumeX, Zap } from "lucide-react";
import { QUESTS, PATHS, dailySeed, emptyPassport, getLevel, knowledgeCounts, normalizePassport, recordLearning, type LearningPassport } from "./live-learning";
import { advanceAdventure, buildAdventure, buildPractice, currentQuest, normalizeAdventure, packLesson, resetExperiment, tryOption, type AdventureRun } from "./adventure-state";
import { simulate } from "./engine";
import { STAGES } from "./content";
import { generateReport } from "./reports";
import { arrivalChime, decisionClick, fanfare, initAudio, isMuted, setMuted, successChime } from "./audio";
import { HelpPanel, Modal, Observability, ReportPanel } from "./simulator-panels";
import { LiveQuestPanel } from "./live-quest-panel";
import shared from "./everest-simulator.module.css";
import s from "./live-adventure.module.css";

const MountainScene = dynamic(() => import("./mountain-scene"), { ssr: false, loading: () => <div className={s.loading}><Mountain size={36}/><span>Preparing your mountain…</span></div> });
const ToolInspector = dynamic(() => import("./tool-inspector"), { loading: () => <p>Opening the radio tent…</p> });
const PASSPORT_KEY = "everest-learning-passport-v1";
const RUN_KEY = "everest-live-adventure-v1";
const BASE_LAYERS = ["route", "flow", "agents", "failures"];
type Drawer = "passport" | "help" | "tools" | "trace" | "report" | "camp" | null;
const localDay = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const stageNames = ["Meet your AI", "Give it a job", "Beat the queue", "Pack useful clues", "Build your team", "Connect the radio", "Fix a breakdown", "Spot a trick", "Keep it flowing", "Test before launch"];

export default function LiveAdventure({ onExit }: { onExit: () => void }) {
  const [passport, setPassport] = useState<LearningPassport>(emptyPassport);
  const [run, setRun] = useState<AdventureRun | null>(null);
  const [hub, setHub] = useState(true);
  const [ready, setReady] = useState(false);
  const [day, setDay] = useState("");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [inspectStage, setInspectStage] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const [xray, setXray] = useState(false);
  const [cutaway, setCutaway] = useState(false);
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [muted, setMutedState] = useState(true);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [passportFilter, setPassportFilter] = useState("");
  const [startingXp, setStartingXp] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const completionGuard = useRef("");
  const counts = knowledgeCounts(passport);
  const level = getLevel(passport);
  const fallbackRun = useMemo(() => buildAdventure("first-ascent", 42, "2026-01-01"), []);
  const activeRun = run ?? fallbackRun;
  const quest = currentQuest(activeRun);
  const metrics = useMemo(() => simulate(activeRun.architecture, activeRun.seed, quest.incidentId), [activeRun.architecture, activeRun.seed, quest.incidentId]);
  const before = useMemo(() => simulate(activeRun.baseline, activeRun.seed, quest.incidentId), [activeRun.baseline, activeRun.seed, quest.incidentId]);
  const complete = activeRun.completed.includes(quest.id);
  const showHub = hub || !run;
  const missionTitle = activeRun.missionId === "daily" ? "Today's mini-climb" : activeRun.missionId === "practice" ? "One idea, one experiment" : PATHS.find(p => p.id === activeRun.missionId)?.title ?? "First ascent";
  const report = useMemo(() => generateReport({ architecture: activeRun.architecture, metrics, decisions: activeRun.decisions, history: activeRun.history, seed: activeRun.seed, mode: "live", difficulty: "beginner", incidentId: quest.incidentId }), [activeRun, metrics, quest.incidentId]);
  const completedStages = activeRun.completed.map(id => QUESTS.find(q => q.id === id)!.stageIndex);

  useEffect(() => {
    let restored: AdventureRun | null = null;
    let learned = emptyPassport();
    try {
      const saved = localStorage.getItem(PASSPORT_KEY);
      if (saved && saved.length < 100000) learned = normalizePassport(JSON.parse(saved));
      const runData = localStorage.getItem(RUN_KEY);
      if (runData && runData.length < 1500000) restored = normalizeAdventure(JSON.parse(runData));
    } catch { /* An unavailable or damaged save never blocks a new expedition. */ }
    setPassport(learned); setRun(restored); setStartingXp(learned.xp); setDay(localDay()); setReady(true);
    initAudio(); setMutedState(isMuted());
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(PASSPORT_KEY, JSON.stringify(passport)); if (run) localStorage.setItem(RUN_KEY, JSON.stringify(run)); }
    catch { setMessage("Browser saving is unavailable. You can still play this expedition."); }
  }, [passport, run, ready]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  function prepare(next: AdventureRun) {
    completionGuard.current = "";
    setRun(next); setHub(false); setDrawer(null); setStartingXp(passport.xp); setShowResult(false);
    setXray(false); setFocused(false); setCutaway(false); setPaused(false); setMessage(""); setResetKey(k => k+1);
    setToast("Meet your team! Try a choice, watch the mountain, then teach the idea back.");
  }
  function startMission(id: string) {
    const today = localDay(); setDay(today);
    const seed = id === "daily" ? dailySeed(today) : (Date.now() >>> 0);
    prepare(buildAdventure(id, seed, today, Object.keys(passport.stamps)));
  }
  function choose(optionId: string) {
    if (!run) return;
    const next = tryOption(run, optionId);
    if (next === run) return;
    setRun(next); decisionClick();
    if (["protocol", "parallel", "recovery", "security"].includes(quest.experiment)) setXray(true);
    const option = quest.options.find(o => o.id === optionId)!;
    setMessage(option.correct ? "Your change did its job. Now explain the idea to your team." : "That changed the system. Look at the result, then try another idea.");
  }
  function completeLesson(firstTry: boolean) {
    if (!run || complete || completionGuard.current === quest.id) return;
    const next = packLesson(run);
    if (next === run) return;
    completionGuard.current = quest.id;
    const updated = recordLearning(passport, quest.id, firstTry, localDay());
    setPassport(updated); setRun(next); successChime();
    setMessage(quest.takeaway);
    setToast(updated.xp > passport.xp ? `+${updated.xp-passport.xp} learning points · ${quest.concept} added to your passport.` : "Lesson remembered! Today's stamp is already in your passport. Try a new idea next.");
  }
  function advance() {
    if (!run) return;
    const next = advanceAdventure(run);
    if (next === run) return;
    setRun(next); setFocused(false); setCutaway(false); setXray(false); setMessage(""); completionGuard.current = "";
    panelRef.current?.scrollTo({ top:0, behavior:"instant" });
    if (next.finished) { setShowResult(true); fanfare(); } else { arrivalChime(); setToast(`Next stop: ${currentQuest(next).title}. Your choices are moving the team up the mountain.`); }
  }
  function inspect(index: number) { setInspectStage(index); setFocused(true); setDrawer("camp"); }
  function overview() {setFocused(false);setCutaway(false);setResetKey(v => v+1);}
  function inspectObject(kind: string, label: string) {
    if (/team|expedition/i.test(kind)) {setFocused(true);setInspectStage(quest.stageIndex);return;}
    if (/mcp|radio|tool|permission/i.test(`${kind} ${label}`)) setDrawer("tools");
    else setDrawer("trace");
  }
  const sideQuest = STAGES[inspectStage ?? quest.stageIndex];

  return <div className={`${shared.shell} ${s.adventure}`} data-mode="live" data-hub={showHub}>
    <header className={s.header}>
      <button className={s.exit} onClick={onExit}><ArrowLeft size={16}/><span>All modes</span></button>
      <button className={s.logo} onClick={() => {setHub(true);setShowResult(false);overview();}}><Mountain size={25}/><span>EVEREST <small>LIVE EXPEDITION</small></span></button>
      <div className={s.headerButtons}>
        <button className={s.passportButton} onClick={() => setDrawer("passport")}><BookOpen size={17}/><span>My passport</span><b>{counts.learned}/{QUESTS.length}</b></button>
        <button className={s.iconButton} onClick={() => {setMuted(!muted);setMutedState(!muted);}} aria-label={muted?"Turn sound on":"Turn sound off"}>{muted?<VolumeX size={17}/>:<Volume2 size={17}/>}</button>
        <button className={s.iconButton} onClick={() => setDrawer("help")} aria-label="How to play"><HelpCircle size={18}/></button>
      </div>
    </header>
    <div className={s.world}>
      <MountainScene selectedStage={focused ? inspectStage ?? quest.stageIndex : null} onSelectStage={inspect} xray={xray} cutaway={cutaway} layers={xray?[...BASE_LAYERS,"tools","dependencies","latency"]:BASE_LAYERS} metrics={metrics} architecture={activeRun.architecture} incident={showHub?null:quest.incidentId} paused={paused || showHub || Boolean(drawer)} reducedMotion={reducedMotion} resetKey={resetKey} onInspect={inspectObject} liveMode={!showHub} expeditionStage={quest.stageIndex} completedStages={completedStages} celebrating={showResult}/>
      {showHub ? <>
        <section className={s.hubIntro}>
          <span className={s.eyebrow}><Compass size={13}/> A LITTLE CURIOSITY. A BIG ADVENTURE.</span>
          <h1>Can you teach<br/>an AI team<br/><em>to reach the top?</em></h1>
          <p>Pack the right clues. Give your helpers a plan. Fix a broken radio. Discover how AI works, one small experiment at a time.</p>
          <div className={s.howItWorks}><span><b>1</b> Try an idea</span><ArrowRight size={12}/><span><b>2</b> Watch it work</span><ArrowRight size={12}/><span><b>3</b> Keep the lesson</span></div>
          {run&&!run.finished&&<button className={s.resume} onClick={() => {setHub(false);setShowResult(false);}}><Play size={17}/><span>Continue your expedition<small>{run.completed.length}/{run.questIds.length} lessons packed · {currentQuest(run).title}</small></span><ArrowRight size={16}/></button>}
          <div className={s.routeCards}>{PATHS.map((path,i) => <button key={path.id} className={s.routeCard} data-featured={i===0} onClick={() => startMission(path.id)} disabled={!ready}><span className={s.routeIcon}>{i===0?<Compass size={22}/>:i===1?<Heart size={22}/>:<Zap size={22}/>}</span><span><strong>{path.title}</strong><small>{path.description}</small></span><ArrowRight size={16}/></button>)}</div>
          <p className={s.gentleNote}>For curious beginners and grown-ups, too. No timer. No lost progress. Trying again is part of the climb.</p>
        </section>
        <section className={s.dailyCard}><span className={s.eyebrow}><Sparkles size={13}/> TODAY'S MINI-CLIMB</span><h2>Three stops.<br/>Three new ideas.</h2><p>A short route that changes each day. Your passport remembers what you learn.</p><div className={s.dailyStops}>{[0,1,2].map(i => <span key={i}><Flag size={13}/><b>{i+1}</b></span>)}</div><button onClick={() => startMission("daily")} disabled={!ready}>Try today's route <ArrowRight size={15}/></button><small>{day || "Preparing today's route"} · About 5 minutes</small></section>
        <div className={s.hubPassport}><Award size={21}/><span><strong>{level.title}</strong><small>{passport.xp} learning points · {counts.learned} ideas discovered</small></span><button onClick={() => setDrawer("passport")}>Open passport <ArrowRight size={13}/></button></div>
        <p className={s.safety}>This is a game about software, using an imaginary expedition. It is not advice about climbing or mountain safety.</p>
      </> : <>
        <div className={s.mapTools}><button className={s.xray} data-active={xray} onClick={() => setXray(v => !v)} aria-pressed={xray}><Eye size={16}/><span>{xray?"System X-ray on":"See inside the system"}</span></button><button onClick={overview} aria-label="Mountain overview"><RotateCcw size={16}/></button><button onClick={() => setPaused(v=>!v)} aria-label={paused?"Resume mountain animation":"Pause mountain animation"}>{paused?<Play size={16}/>:<Pause size={16}/>}</button></div>
        <aside className={s.trail} aria-label="Your mission progress"><span className={s.eyebrow}>YOUR EXPEDITION</span><h2>{missionTitle}</h2><p>{activeRun.completed.length} / {activeRun.questIds.length} lessons packed</p><nav>{activeRun.questIds.map((id,i) => {const q=QUESTS.find(q=>q.id===id)!;return <button key={id} aria-current={i===activeRun.step?"step":undefined} data-complete={activeRun.completed.includes(id)} onClick={() => inspect(q.stageIndex)}><span>{activeRun.completed.includes(id)?<Check size={13}/>:String(i+1).padStart(2,"0")}</span><span><strong>{stageNames[q.stageIndex]}</strong><small>{STAGES[q.stageIndex].name}</small></span>{i===activeRun.step&&<Flag size={12}/>}</button>;})}</nav><div className={s.levelCard}><Award size={21}/><span><strong>{level.title}</strong><small>{passport.xp} learning points</small></span><progress value={level.progress} max="1" aria-label="Progress to next explorer level"/></div><button className={s.changeMission} onClick={() => {setHub(true);overview();}}><Compass size={14}/> Choose another mission</button></aside>
        <section className={s.questPanel} aria-label="Live learning challenge"><div className={s.questTop}><span><Flag size={12}/> CAMP {activeRun.step+1} OF {activeRun.questIds.length}</span><button onClick={() => setDrawer("passport")}><Star size={12}/> {passport.xp} points</button></div><div className={s.questScroll} ref={panelRef}><LiveQuestPanel key={`${activeRun.seed}-${quest.id}`} quest={quest} architecture={activeRun.architecture} metrics={metrics} before={activeRun.selectedOptionId?before:null} selectedOptionId={activeRun.selectedOptionId} onChoose={choose} onComplete={completeLesson} onInspect={() => {setXray(true);setToast("The glowing paths show the system inside. Drag the mountain to explore, or open the control room for the trace.");}} onTryAgain={() => setRun(v=>v?resetExperiment(v):v)} completed={complete} reducedMotion={reducedMotion}/>{message&&<p className={s.teamMessage} role="status">{message}</p>}</div><div className={s.questFooter}>{complete?<button className={s.nextCamp} onClick={advance}>{activeRun.step===activeRun.questIds.length-1?"Finish this expedition":"On to the next camp"}<ArrowRight size={17}/></button>:<p><Lightbulb size={15}/> Try a choice, then teach the idea back to earn your camp stamp.</p>}</div></section>
        <div className={s.currentCamp}><span className={s.liveDot}/>{complete?"Lesson packed. Your team is ready!":`Your mission: ${quest.mission}`}</div>
        <div className={s.utilityBar}><button onClick={() => setDrawer("tools")}><Radio size={15}/> Try a real MCP tool</button><button onClick={() => setDrawer("trace")}><Zap size={15}/> Control room</button><button onClick={() => setDrawer("report")}><BookOpen size={15}/> My expedition notes</button><span>Simulated systems · Safe to experiment</span></div>
      </>}
    </div>
    {!showHub&&<div className={s.scoreboard} aria-label="Your live system, in plain language">{[
      {label:"Waiting time",value:`${(metrics.p95/1000).toFixed(1)}s`,tip:"95 out of 100 requests wait no longer than this. Engineers call it p95 latency.", icon:Zap},
      {label:"Answers delivered",value:`${Math.round(metrics.reliability)}%`,tip:"How often the system completes a request. This is reliability.",icon:Flag},
      {label:"Answer quality",value:`${Math.round(metrics.quality)}/100`,tip:"How useful and correct answers are in this teaching model.",icon:Sparkles},
      {label:"Rules followed",value:`${Math.round(metrics.safety)}/100`,tip:"Does the software check permissions and block unauthorised actions?",icon:Heart},
      {label:"Pretend AI budget",value:`$${metrics.totalCost.toFixed(2)}`,tip:"Estimated fictional cost for 1,000 requests. No money is spent.",icon:Star},
    ].map(m=><button key={m.label} onClick={() => {setDrawer("trace");}} title={m.tip}><m.icon size={17}/><span><small>{m.label}</small><strong>{m.value}</strong></span></button>)}</div>}
    {toast&&<div className={s.toast} role="status"><Sparkles size={16}/><span>{toast}</span><button onClick={()=>setToast("")} aria-label="Dismiss update">×</button></div>}
    {showResult&&run&&<Modal title={run.missionId==="practice"?"One more idea in your backpack." : run.missionId==="daily"?"Today's route, explored." : "You brought your AI team to the summit."} onClose={() => setShowResult(false)}><div className={s.result}><div className={s.summitMedal}><Mountain size={53}/><Flag size={22}/></div><p>You tried ideas, noticed what changed, and explained {run.completed.length} concept{run.completed.length===1?"":"s"} to your team. That is how a system builder learns.</p><div className={s.resultStats}><span><strong>{run.completed.length}</strong>lessons packed</span><span><strong>+{passport.xp-startingXp}</strong>learning points</span><span><strong>{counts.learned}/{QUESTS.length}</strong>ideas discovered</span></div><div className={s.takeaways}>{run.completed.map(id=>{const q=QUESTS.find(q=>q.id===id)!;return <p key={id}><Check size={15}/><span><strong>{q.concept}</strong>{q.takeaway}</span></p>;})}</div><div className={s.resultButtons}><button onClick={()=>{setShowResult(false);setDrawer("passport");}}>See my explorer passport <BookOpen size={16}/></button><button onClick={()=>{setShowResult(false);setHub(true);overview();}}>Choose the next adventure <ArrowRight size={16}/></button></div><p className={s.smallPrint}>Your next full expedition favours ideas you have not tried. Return another day to practise remembered ideas and add a second or third stamp.</p></div></Modal>}
    {drawer&&<Modal title={drawer==="passport"?"Your explorer passport":drawer==="help"?"How to play & field guide":drawer==="tools"?"Try the MCP radio":drawer==="trace"?"Inside your AI system":drawer==="camp"?sideQuest.name:"Your expedition notes"} onClose={()=>setDrawer(null)} report={drawer==="report"}>
      {drawer==="passport"&&<div className={s.passport}><div className={s.passportIntro}><Award size={39}/><div><span className={s.eyebrow}>LEVEL {level.level} / {level.title}</span><h3>{counts.learned} ideas discovered.<br/>{counts.mastered} practised on three days.</h3><p>{passport.xp} learning points. Each lesson earns a stamp after you try the experiment and explain the idea. Review it on another day for another stamp, up to three.</p></div></div><div className={s.passportProgress}><progress value={counts.learned} max={QUESTS.length} aria-label="Concepts discovered"/><span>{counts.learned}/{QUESTS.length} field notes</span></div><label className={s.passportSearch}>Find an idea<input value={passportFilter} onChange={e=>setPassportFilter(e.target.value)} type="search" placeholder="Agents, context, tools…"/></label><div className={s.fieldCards}>{QUESTS.filter(q=>`${q.concept} ${q.title} ${q.fieldNote.map(n=>n.term).join(" ")}`.toLowerCase().includes(passportFilter.toLowerCase())).map(q=>{const stamps=passport.stamps[q.id]?.days.length??0;return <article key={q.id} data-learned={stamps>0}><div><span className={s.fieldNumber}>{String(q.stageIndex+1).padStart(2,"0")}</span><span className={s.stamps} aria-label={`${stamps} of 3 practice stamps`}>{[1,2,3].map(n=><Star size={13} key={n} fill={n<=stamps?"currentColor":"none"}/>)}</span></div><h4>{q.concept}</h4><p>{stamps?q.takeaway:q.story}</p><small>{stamps===0?"Ready to discover":stamps===1?"Discovered · revisit to remember":stamps===2?"Remembered · one more day of practice":"Practised on three different days"}</small><button onClick={()=>prepare(buildPractice(q.id,Date.now()>>>0,localDay()))}>{stamps?"Practise this idea":"Try this experiment"}<ArrowRight size={13}/></button></article>;})}</div><p className={s.smallPrint}>Saved in this browser, without an account. You keep every stamp when you take a break. Repeating the same lesson today still lets you practise, but adds no extra points.</p></div>}
      {drawer==="help"&&<><div className={s.quickHelp}><span>1 / TRY</span><p>Read your team's problem. Choose what to change. The little experiment and the mountain show the result.</p><span>2 / EXPLAIN</span><p>Pick the explanation that matches what happened. If it doesn't fit yet, use a hint and try again.</p><span>3 / CLIMB</span><p>Pack your lesson to earn a passport stamp. Then move to the next camp. Looking around the map never skips a mission.</p></div><HelpPanel onStage={id=>inspect(STAGES.findIndex(st=>st.id===id))} showTutorial={()=>{setDrawer(null);setToast("Try an idea → watch the result → explain it → pack your lesson → climb.");}}/><div className={shared.dialogBody}><label className={shared.toggleField}><span><strong>Reduced motion</strong><small>Still explore the 3D map, with fewer moving effects.</small></span><input type="checkbox" checked={reducedMotion} onChange={e=>setReducedMotion(e.target.checked)}/></label></div></>}
      {drawer==="tools"&&<ToolInspector onEvent={text=>setToast(text)}/>}
      {drawer==="trace"&&<Observability metrics={metrics} history={activeRun.history} onStage={id=>inspect(STAGES.findIndex(st=>st.id===id))}/>}
      {drawer==="report"&&<ReportPanel report={report}/>}
      {drawer==="camp"&&<div className={s.campPreview}><span className={s.eyebrow}>LOOK AROUND / YOUR TEAM STAYS AT ITS MISSION</span><h3>{stageNames[inspectStage??quest.stageIndex]}</h3><p>{QUESTS.find(q=>q.stageIndex===(inspectStage??quest.stageIndex))?.story}</p><p>{sideQuest.explanation}</p><details><summary>Engineer field notes</summary><p>{sideQuest.architect}</p></details><button onClick={()=>{setDrawer(null);setCutaway(v=>!v);setFocused(true);}}><Eye size={16}/> Look inside this camp</button>{!showHub&&<button onClick={()=>{setDrawer(null);setFocused(false);setCutaway(false);}}>Back to my mission <ArrowRight size={16}/></button>}</div>}
    </Modal>}
  </div>;
}
