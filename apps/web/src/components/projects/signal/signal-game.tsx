"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, CircleHelp, Flag, FlaskConical, Footprints, Lightbulb, Pause, Play, Radio, RotateCcw, ScanLine, ShieldCheck, SkipBack, SkipForward, Sparkles, Target, Trophy, Undo2, Waves, Zap } from "lucide-react";
import { auditHeuristic, coordinate, energy, exactDistances, makeBoard, manhattan, MISSIONS, neighbours, routeCost, search, validRoute, type Strategy, type Terrain } from "./search-engine";
import styles from "./signal-game.module.css";
import { ChapterNav } from "./chapter-nav";

type Tool = "route" | "inspect" | "wall" | "mud" | "floor" | "predict";
const STRATEGIES: { id: Strategy; title: string; short: string; detail: string }[] = [
  { id: "astar", title: "A* search", short: "Balanced", detail: "Cost so far + a safe estimate. Finds a cheapest route." },
  { id: "dijkstra", title: "Dijkstra", short: "Cautious", detail: "Only cost so far. Explores outward without a goal estimate." },
  { id: "weighted", title: "Overconfident", short: "Risky", detail: "Cost so far + 3 × the estimate. Can trade route quality for fewer decisions." },
];
const SAVE_KEY = "signal-missions-v1";
function readProgress() { try { return localStorage.getItem(SAVE_KEY) ?? ""; } catch { return ""; } }
function subscribeProgress(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("signal-progress", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("signal-progress", callback); };
}
const serverProgress = () => "";

export function SignalGame() {
  const [mission, setMission] = useState(0);
  const [board, setBoard] = useState(() => makeBoard(0));
  const [route, setRoute] = useState<number[]>(() => [makeBoard(0).start]);
  const [strategy, setStrategy] = useState<Strategy>("astar");
  const [tool, setTool] = useState<Tool>("route");
  const [sandbox, setSandbox] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(220);
  const [selected, setSelected] = useState<number | null>(null);
  const [focusTile, setFocusTile] = useState(() => makeBoard(0).start);
  const [verified, setVerified] = useState(false);
  const [feedback, setFeedback] = useState("Start at S. Click neighbouring tiles to plot your route to G.");
  const [tab, setTab] = useState<"reasoning" | "proof">("reasoning");
  const [sessionWins, setSessionWins] = useState<number[]>([]);
  const storedProgress = useSyncExternalStore(subscribeProgress, readProgress, serverProgress);
  const wins = [...new Set([...storedProgress.split(",").filter(Boolean).map(Number), ...sessionWins])].filter(n => n >= 0 && n < MISSIONS.length);
  const boardRef = useRef<HTMLDivElement>(null);
  const frames = useMemo(() => search(board, strategy), [board, strategy]);
  const distances = useMemo(() => exactDistances(board), [board]);
  const audit = useMemo(() => auditHeuristic(board, strategy, distances), [board, strategy, distances]);
  const frame = frames[Math.min(step, frames.length - 1)];
  const finished = frame.status !== "searching";
  const humanDone = validRoute(board, route);
  const humanCost = routeCost(board, route);
  const aiCost = frame.path.length ? routeCost(board, frame.path) : null;
  const optimum = distances[board.start];
  const activeId = selected ?? frame.current?.id ?? board.start;
  const activeG = frame.scores[activeId];
  const activeH = manhattan(board, activeId) * (strategy === "dijkstra" ? 0 : strategy === "weighted" ? 3 : 1);
  const routeSet = new Set(route);
  const closedSet = new Set(frame.closed);
  const frontierSet = new Set(frame.frontier.map(c => c.id));
  const aiSet = new Set(frame.path);
  const formula = strategy === "dijkstra" ? "f = g" : strategy === "weighted" ? "f = g + 3h" : "f = g + h";

  useEffect(() => {
    if (!playing || finished) return;
    const timer = window.setInterval(() => {
      setStep(value => Math.min(value + 1, frames.length - 1));
    }, speed);
    return () => window.clearInterval(timer);
  }, [playing, finished, frames.length, speed]);

  function clearSearch() {
    setStep(0); setPlaying(false); setVerified(false); setSelected(null); setTab("reasoning");
  }

  function loadMission(index: number) {
    const next = makeBoard(index);
    setMission(index); setBoard(next); setRoute([next.start]);
    setSandbox(false); setTool("route"); setStrategy("astar"); clearSearch();
    setFeedback("Start at S. Click neighbouring tiles to plot your route to G.");
  }

  function changeStrategy(next: Strategy) {
    setStrategy(next); clearSearch();
    if (tool === "predict") setTool("inspect");
    setFeedback("Same map, different reasoning. Your route stays in place for a fair comparison.");
  }

  function chooseTile(id: number) {
    setSelected(id);
    if (tool === "predict") {
      if (!frontierSet.has(id)) { setFeedback("Choose a cyan frontier tile. Those are the AI’s available candidates."); return; }
      const next = frame.frontier[0];
      if (id === next.id) {
        setFeedback(`Exactly. ${coordinate(board, id)} wins with priority ${next.f}. Ties prefer lower h, then row and column.`);
        setStep(value => Math.min(value + 1, frames.length - 1)); setTool("inspect");
      } else {
        const guess = frame.frontier.find(c => c.id === id)!;
        setFeedback(`${coordinate(board, id)} has priority ${guess.f}. Look for the lowest f; break ties with lower h, then top-to-bottom, left-to-right. Try again.`);
      }
      return;
    }
    if (tool === "inspect") return;
    if (tool === "wall" || tool === "mud" || tool === "floor") {
      if (id === board.start || id === board.goal) { setFeedback("The start and signal stay fixed. Edit any other tile."); return; }
      const cells = [...board.cells]; cells[id] = tool as Terrain;
      setBoard({ ...board, cells }); setRoute([board.start]); clearSearch();
      setFeedback("Map changed. Plot a fresh route or run the AI to test your design."); return;
    }
    if (playing && !finished) { setFeedback("Pause the AI before adjusting your route."); return; }
    const previous = route.indexOf(id);
    if (previous !== -1) {
      setRoute(route.slice(0, previous + 1)); setVerified(false);
      setFeedback("Route rewound. Choose a neighbouring tile to continue."); return;
    }
    if (humanDone) { setFeedback("Your route is complete. Run the AI, or click an earlier route tile to rethink it."); return; }
    if (!neighbours(board, route[route.length - 1]).includes(id)) {
      setFeedback("One tile at a time: up, down, left, or right. Walls are impassable; diagonals are not allowed."); return;
    }
    const next = [...route, id]; setRoute(next); setVerified(false);
    setFeedback(id === board.goal
      ? `Signal reached. Your route costs ${routeCost(board, next)} energy. Run the AI to compare your reasoning.`
      : `${coordinate(board, id)} adds ${energy(board, id)} energy. ${board.cells[id] === "mud" ? "Rough terrain is expensive; a detour may be cheaper." : "Keep going toward G."}`);
  }

  function verify() {
    setVerified(true); setTab("proof"); setPlaying(false);
    const achieved = !sandbox && humanDone && humanCost === optimum && aiCost !== null
      && (mission === 1 ? strategy === "weighted" && aiCost > optimum : aiCost === optimum);
    if (achieved) {
      const next = [...new Set([...wins, mission])]; setSessionWins(next);
      try { localStorage.setItem(SAVE_KEY, next.join(",")); window.dispatchEvent(new Event("signal-progress")); } catch { /* Session progress still works. */ }
      setFeedback(mission === 1 ? "Mission complete. Your cheaper route is a counterexample to the AI’s shortest-path claim." : "Mission complete. Your route matches the optimum, and the AI’s result checks out.");
    } else if (!humanDone) {
      setFeedback("AI result checked. To earn the mission badge, plot your own minimum-energy route too.");
    } else if (humanCost > optimum) {
      setFeedback(`Your route uses ${humanCost - optimum} extra energy. Try another route to earn the mission badge.`);
    } else if (mission === 1 && !sandbox) {
      setFeedback("Your route is optimal. Now run Overconfident AI and verify its expensive shortcut to complete this mission.");
    } else {
      setFeedback("Experiment verified. Edit the map or switch strategies to test another hypothesis.");
    }
  }

  function run() {
    if (finished) { setStep(0); setVerified(false); }
    setPlaying(!(playing && !finished));
    setTool("inspect"); setSelected(null);
  }

  const explanation = frame.status === "found"
    ? `The goal was selected from the frontier. This route costs ${aiCost} energy. ${strategy === "weighted" ? "The estimate was inflated, so finding the goal does not guarantee the cheapest route. Verify it below." : "With this consistent heuristic, selecting the goal certifies a minimum-energy route. Check it independently below."}`
    : frame.status === "blocked"
      ? "The frontier is empty. Every reachable tile has been explored; no route reaches the signal. Open a gap in the sandbox and try again."
      : frame.current
        ? `${coordinate(board, frame.current.id)} had the lowest priority: ${frame.current.g} cost so far + ${frame.current.h} estimated remaining = ${frame.current.f}. ${frame.changed.length} neighbour${frame.changed.length === 1 ? "" : "s"} received a new or cheaper route. The cyan frontier is where the search can go next.`
        : "The AI knows the map, but has not searched it yet. It starts with S in its frontier: the set of discovered tiles waiting to be explored. Press Step to reveal the first decision.";
  const points = (path: number[]) => path.map(id => `${(id % board.width) * 100 + 50},${Math.floor(id / board.width) * 100 + 50}`).join(" ");

  return (
    <div className={styles.game}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <Link href="/projects" className={styles.back}><ArrowLeft size={14} /> Back to projects</Link>
            <p className={styles.eyebrow}><span className={styles.liveDot} /> An experiment in human + machine thinking</p>
            <h1>Follow the <span>Signal.</span></h1>
            <p className={styles.lead}>Your intuition. The AI’s reasoning. A path you can prove.</p>
            <p className={styles.intro}>Plot a rescue route, look inside the AI’s decisions, and discover when a clever guess becomes a costly mistake.</p>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.orbit} /><div className={styles.orbitInner} /><div className={styles.orbitCore}><Radio size={36} strokeWidth={1.2} /></div>
            <span className={styles.orbitLabel}>HUMAN ↔ AI</span><span className={styles.orbitNode} />
          </div>
        </header>

        <ChapterNav current="search" />
        <div className={styles.missionBar} aria-label="Missions">
          {MISSIONS.map((item, index) => (
            <button key={item.name} className={`${styles.mission} ${mission === index ? styles.missionActive : ""}`} onClick={() => loadMission(index)} aria-pressed={mission === index}>
              <span className={styles.missionNumber}>{wins.includes(index) ? <Check size={17} /> : `0${index + 1}`}</span>
              <span><strong>{item.name}</strong><small>{item.subtitle}</small></span>
              <ChevronRight size={15} />
            </button>
          ))}
          <div className={styles.progress}><Trophy size={17} /><strong>{wins.length}/3</strong><span>missions</span></div>
        </div>

        <div className={styles.workspace}>
          <section className={styles.arena} aria-label="Interactive rescue map">
            <div className={styles.arenaHeader}>
              <div><p className={styles.eyebrow}>{sandbox ? "Free experiment" : `Mission 0${mission + 1}`}</p><h2>{sandbox ? "Make your own rules. Test ours." : MISSIONS[mission].name}</h2></div>
              <span className={styles.mapTag}><Radio size={12} /> {frame.status === "found" ? "SIGNAL FOUND" : frame.status === "blocked" ? "NO CONNECTION" : "SIGNAL ACTIVE"}</span>
            </div>
            <p className={styles.brief}>{sandbox ? "Paint walls or rough terrain, then switch to Plot route. Every edit resets the search so the comparison stays honest." : MISSIONS[mission].brief}</p>

            <div className={styles.toolbar} aria-label="Map tools">
              <button aria-pressed={tool === "route"} onClick={() => { setTool("route"); setPlaying(false); }}><Footprints size={14} /> Plot route</button>
              <button aria-pressed={tool === "inspect"} onClick={() => setTool("inspect")}><ScanLine size={14} /> Inspect</button>
              <span className={styles.toolDivider} />
              <button onClick={() => { setRoute([board.start]); setVerified(false); setFeedback("Your route is clear. Start again from S."); }} disabled={route.length < 2}><Undo2 size={14} /> Clear route</button>
              <button className={styles.sandboxToggle} aria-pressed={sandbox} onClick={() => { if (sandbox) { loadMission(mission); } else { setSandbox(true); setTool("wall"); clearSearch(); setFeedback("Sandbox open. Click a tile to paint it; S and G stay fixed."); } }}><FlaskConical size={14} /> {sandbox ? "Exit sandbox" : "Sandbox"}</button>
            </div>
            {sandbox && <div className={styles.paintTools} aria-label="Terrain brushes">
              {([ ["wall", "Wall", "impassable"], ["mud", "Rough terrain", "5 energy"], ["floor", "Erase", "1 energy"] ] as const).map(([id, title, hint]) => <button key={id} aria-pressed={tool === id} onClick={() => { setTool(id); setPlaying(false); }}>{title}<small>{hint}</small></button>)}
              <button onClick={() => { setBoard({ ...board, cells: board.cells.map(() => "floor") }); setRoute([board.start]); clearSearch(); }}>Clear terrain</button>
            </div>}

            <div className={styles.mapWrap}>
              <div className={styles.columnLabels} aria-hidden="true">{Array.from({ length: board.width }, (_, i) => <span key={i}>{String.fromCharCode(65 + i)}</span>)}</div>
              <div className={styles.mapBody}>
                <div className={styles.rowLabels} aria-hidden="true">{Array.from({ length: board.height }, (_, i) => <span key={i}>{i + 1}</span>)}</div>
                <div className={styles.grid} ref={boardRef} role="group" aria-label="Rescue map. Use arrow keys to move focus; Enter to use the selected tool." onKeyDown={event => {
                  const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -board.width, ArrowDown: board.width };
                  if (!(event.key in offsets)) return;
                  const id = Number((event.target as HTMLElement).dataset.cell);
                  if (!Number.isFinite(id)) return;
                  event.preventDefault();
                  const next = id + offsets[event.key];
                  if (next < 0 || next >= board.cells.length || ((event.key === "ArrowLeft" || event.key === "ArrowRight") && Math.floor(next / board.width) !== Math.floor(id / board.width))) return;
                  boardRef.current?.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)?.focus();
                }}>
                  {board.cells.map((cell, id) => {
                    const start = id === board.start;
                    const goal = id === board.goal;
                    const current = id === frame.current?.id;
                    const hint = tool === "route" && !humanDone && neighbours(board, route[route.length - 1]).includes(id) && !routeSet.has(id);
                    return <button key={id} data-cell={id} tabIndex={focusTile === id ? 0 : -1} onFocus={() => setFocusTile(id)} className={[styles.cell, styles[cell], closedSet.has(id) ? styles.explored : "", frontierSet.has(id) ? styles.frontier : "", routeSet.has(id) ? styles.humanCell : "", aiSet.has(id) ? styles.aiCell : "", current ? styles.current : "", selected === id ? styles.selected : "", hint ? styles.hint : "", start ? styles.start : "", goal ? styles.goal : ""].join(" ")}
                      aria-label={`${coordinate(board, id)}: ${start ? "start" : goal ? "goal" : cell === "wall" ? "wall" : cell === "mud" ? "rough terrain, 5 energy" : "floor, 1 energy"}${routeSet.has(id) ? ", your route" : ""}${aiSet.has(id) ? ", AI route" : ""}${frontierSet.has(id) ? ", frontier" : ""}${closedSet.has(id) ? ", explored" : ""}`}
                      onClick={() => chooseTile(id)}>
                      {start ? <span className={styles.marker}>S</span> : goal ? <span className={styles.marker}><Flag size={16} /><b>G</b></span> : cell === "wall" ? <span className={styles.wallMark} /> : cell === "mud" ? <span className={styles.mudMark}>5</span> : hint ? <span className={styles.hintDot} /> : frontierSet.has(id) ? <span className={styles.nodeDot} /> : closedSet.has(id) ? <span className={styles.visitedDot} /> : null}
                      {current && !goal && !start && <span className={styles.agentMark}><ScanLine size={17} /></span>}
                    </button>;
                  })}
                  <svg className={styles.routeOverlay} viewBox={`0 0 ${board.width * 100} ${board.height * 100}`} aria-hidden="true">
                    {route.length > 1 && <polyline points={points(route)} className={styles.humanLine} />}
                    {frame.path.length > 1 && <polyline points={points(frame.path)} className={styles.aiLine} />}
                    {route.length > 1 && !humanDone && <circle cx={(route[route.length - 1] % board.width) * 100 + 50} cy={Math.floor(route[route.length - 1] / board.width) * 100 + 50} r="10" className={styles.humanHead} />}
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.legend}>
              <span><i className={styles.legendHuman} /> Your route</span><span><i className={styles.legendAI} /> AI route</span><span><i className={styles.legendFrontier} /> Frontier</span><span><i className={styles.legendExplored} /> Explored</span><span><i className={styles.legendMud} /> Rough: 5</span>
            </div>
            {frame.current && <div className={styles.mobileDecision}><Sparkles size={15} /><p>{finished ? explanation : `AI chose ${coordinate(board, frame.current.id)}: ${frame.current.g} spent + ${frame.current.h} estimated = ${frame.current.f}, the lowest frontier priority. Inspect its reasoning below.`}</p></div>}
            <div className={styles.feedback} role="status"><Lightbulb size={16} /><span>{feedback}</span></div>

            <div className={styles.playback}>
              <button className={styles.runButton} onClick={run}>{playing && !finished ? <Pause size={16} /> : <Play size={16} fill="currentColor" />} {playing && !finished ? "Pause" : finished ? "Replay AI" : step ? "Resume AI" : "Run AI"}</button>
              <button className={styles.stepButton} onClick={() => { setPlaying(false); setStep(value => Math.min(value + 1, frames.length - 1)); setSelected(null); setTool("inspect"); }} disabled={finished}><SkipForward size={15} /> Step</button>
              <button className={styles.iconButton} aria-label="Restart AI search" title="Restart AI search" onClick={clearSearch} disabled={!step}><RotateCcw size={15} /></button>
              <label className={styles.speed}>Speed<select aria-label="Playback speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={650}>Slow</option><option value={220}>Normal</option><option value={45}>Fast</option></select></label>
            </div>
            <div className={styles.timeline}>
              <button className={styles.iconButton} aria-label="Previous decision" disabled={!step} onClick={() => { setPlaying(false); setStep(value => value - 1); setVerified(false); setSelected(null); }}><SkipBack size={13} /></button>
              <input type="range" min={0} max={frames.length - 1} value={step} aria-label="Search decision timeline" onChange={e => { setPlaying(false); setStep(Number(e.target.value)); setVerified(false); setSelected(null); }} />
              <span>Decision {step}<span className={styles.muted}> / {frames.length - 1}</span></span>
            </div>
          </section>

          <aside className={styles.console} aria-label="AI reasoning and proof">
            <div className={styles.consoleHeading}><span><Sparkles size={17} /> Inside the AI</span><span className={styles.classical}>CLASSICAL SEARCH</span></div>
            <div className={styles.strategies} aria-label="AI strategy">{STRATEGIES.map(item => <button key={item.id} aria-pressed={strategy === item.id} onClick={() => changeStrategy(item.id)}><strong>{item.title}</strong><small>{item.short}</small></button>)}</div>
            <p className={styles.strategyDetail}>{STRATEGIES.find(item => item.id === strategy)!.detail}</p>
            <div className={styles.stats}>
              <div><span><Footprints size={13} /> You</span><strong>{humanCost}<small>energy</small></strong><em>{humanDone ? "Route complete" : "Still plotting"}</em></div>
              <div><span><Sparkles size={13} /> AI</span><strong>{aiCost ?? "—"}<small>energy</small></strong><em>{frame.status === "blocked" ? "No route" : finished ? "Route complete" : "Awaiting result"}</em></div>
              <div><span><ScanLine size={13} /> Search</span><strong>{step}<small>decisions</small></strong><em>{frame.frontier.length} in frontier</em></div>
            </div>

            <div className={styles.tabs} role="tablist" aria-label="Learn from this run">
              <button id="signal-reasoning-tab" role="tab" aria-selected={tab === "reasoning"} aria-controls="signal-reasoning" onClick={() => setTab("reasoning")}><Waves size={14} /> Reasoning</button>
              <button id="signal-proof-tab" role="tab" aria-selected={tab === "proof"} aria-controls="signal-proof" onClick={() => setTab("proof")}><ShieldCheck size={14} /> The proof {verified && <span className={styles.proofDot} />}</button>
            </div>

            {tab === "reasoning" ? <div id="signal-reasoning" role="tabpanel" aria-labelledby="signal-reasoning-tab" className={styles.tabPanel}>
              <div className={styles.reasonCard}>
                <p className={styles.eyebrow}><span className={styles.liveDot} /> {finished ? "Search concluded" : step ? "Why this decision?" : "Ready when you are"}</p>
                <p aria-live={playing && !finished ? "off" : "polite"}>{explanation}</p>
              </div>
              <div className={styles.inspector}>
                <div className={styles.sectionTitle}><span>Tile {coordinate(board, activeId)}</span><small>{selected !== null ? "Selected tile" : "Current focus"}</small></div>
                <div className={styles.formula}><span><b>{activeG ?? "?"}</b><small>g · cost so far</small></span><i>+</i><span><b>{activeH}</b><small>{strategy === "weighted" ? "3h · inflated guess" : "h · estimate"}</small></span><i>=</i><span><b>{activeG === undefined ? "?" : activeG + activeH}</b><small>f · priority</small></span></div>
                <p>{board.cells[activeId] === "wall" ? "A wall cannot enter the frontier." : activeG === undefined ? "Not discovered yet: there is no known route from S, so g is still unknown." : `Entering this tile costs ${energy(board, activeId)} energy${activeId === board.start ? "; starting here costs 0" : ""}. Lower priority values are explored first.`}</p>
              </div>
              <div className={styles.queue}>
                <div className={styles.sectionTitle}><span>{finished ? "Unexplored alternatives" : "Up next"}</span><small>{formula}</small></div>
                <div className={styles.queueHeader}><span>Tile</span><span>g</span><span>{strategy === "weighted" ? "3h" : "h"}</span><span>f</span></div>
                {frame.frontier.slice(0, 3).map((item, index) => <button className={styles.queueRow} key={item.id} onClick={() => { if (tool === "predict") chooseTile(item.id); else setSelected(item.id); }} aria-label={`Inspect frontier tile ${coordinate(board, item.id)}`}><span><i>{index + 1}</i>{coordinate(board, item.id)}</span><span>{item.g}</span><span>{item.h}</span><strong>{item.f}</strong></button>)}
                {!frame.frontier.length && <p className={styles.emptyQueue}>No candidates remain.</p>}
                <p className={styles.queueNote}>Ties: lower h, then top-to-bottom, left-to-right.</p>
              </div>
              <button className={styles.predictButton} disabled={finished} aria-pressed={tool === "predict"} onClick={() => { setTool(tool === "predict" ? "inspect" : "predict"); setPlaying(false); setFeedback("Your turn to think like the AI. Click the frontier tile it will select next."); }}><Target size={16} /> {tool === "predict" ? "Pick the next frontier tile…" : "Predict the next decision"}<ArrowRight size={14} /></button>
            </div> : <div id="signal-proof" role="tabpanel" aria-labelledby="signal-proof-tab" className={styles.tabPanel}>
              <div className={`${styles.proofResult} ${strategy === "weighted" ? styles.caution : ""}`}>
                <ShieldCheck size={22} /><p className={styles.eyebrow}>{strategy === "weighted" ? "A guarantee removed" : "A guarantee, with conditions"}</p>
                <h3>{strategy === "weighted" ? "Confidence is not correctness." : "A careful guess finds a cheapest path."}</h3>
                <p>Four-way movement. Finite map. Entry costs of 1 or 5. {strategy === "weighted" ? "Inflating Manhattan distance can overestimate the remaining cost." : "With h = Manhattan distance (or zero), A* selects a minimum-energy route when it selects the goal."}</p>
              </div>
              <details className={styles.proofDetails} open><summary>01 · Why the estimate is safe <ChevronRight size={14} /></summary><p>Each move changes just one coordinate. You need at least |Δx| + |Δy| moves to reach G. Each costs at least 1. So Manhattan distance never exceeds the true remaining energy: <strong>h(n) ≤ d*(n)</strong>. Walls and rough terrain can only add cost.</p></details>
              <details className={styles.proofDetails}><summary>02 · Why A* is optimal <ChevronRight size={14} /></summary><p>For every neighbour v of u, <strong>h(u) ≤ c(u,v) + h(v)</strong>. This is consistency. It makes f nondecreasing along a path, and a selected node has its best g.</p><p>Suppose a selected goal cost C more than the optimum C*. Before reaching an optimal goal, a frontier node n on an optimal path has <strong>f(n) ≤ C* &lt; C</strong>. But A* selects the lowest f, and the goal has h = 0, hence f = C. It could not select that goal first. Contradiction.</p><p>With h = 0 the same argument gives Dijkstra’s guarantee. Multiplying h by 3 breaks the premise in general.</p></details>
              <details className={styles.proofDetails}><summary>03 · Check this actual map <ChevronRight size={14} /></summary><p>An independent Bellman–Ford calculation works backward from G: <strong>d(u) = min [c(u,v) + d(v)]</strong>. Relaxing all edges until stable gives exact remaining costs. It checks this run; the argument above proves the general guarantee.</p><p>Heuristic audit: <strong>{audit.violations.length}</strong> overestimating tiles; <strong>{audit.inconsistent}</strong> consistency failures across {audit.edges} directed edges.</p>{audit.violations.length > 0 && <p>Witness at {coordinate(board, audit.violations[0])}: estimate {3 * manhattan(board, audit.violations[0])}, actual remaining cost {distances[audit.violations[0]]}.</p>}</details>
              {verified && <div className={styles.certificate} role="status"><p className={styles.eyebrow}>{aiCost === null ? "Reachability checked" : aiCost === optimum ? "Result independently verified" : "Counterexample found"}</p><div><span>True minimum</span><strong>{Number.isFinite(optimum) ? `${optimum} energy` : "Unreachable"}</strong></div><div><span>AI result</span><strong>{aiCost !== null ? `${aiCost} energy` : "No route"}</strong></div><div><span>Your route</span><strong>{humanDone ? `${humanCost} energy` : "Not complete"}</strong></div><p>{aiCost === null ? "No finite distance exists from S to G. This confirms that the signal is unreachable." : aiCost > optimum ? `The AI spent ${aiCost - optimum} extra energy. One cheaper route is enough to disprove a universal optimality claim for this strategy.` : strategy === "weighted" ? "This run happened to be optimal. A successful example does not restore the missing guarantee." : "The route cost matches the independent minimum. The theorem explains why this will hold for every map under these rules."}</p></div>}
              <a className={styles.source} href="https://www.cs.cmu.edu/~15281/coursenotes/search/" target="_blank" rel="noopener noreferrer">Read the theory · CMU search notes <ArrowUpRight size={12} /></a>
            </div>}

            <div className={styles.verifyArea}><button className={styles.verifyButton} disabled={!finished} onClick={verify}><ShieldCheck size={17} /> {verified ? "Verify again" : "Verify the result"}<ArrowRight size={15} /></button><p>{finished ? "Compare against an independent shortest-path calculation." : "Finish the AI search to check its answer."}</p></div>
          </aside>
        </div>

        <section className={styles.fieldNotes}>
          <div className={styles.lesson}><p className={styles.eyebrow}><CircleHelp size={14} /> The idea to take with you</p><h2>{mission === 1 ? "A shortcut in thinking can be a detour in practice." : mission === 2 ? "Different reasoning. The same guarantee." : "Intelligence starts with a useful estimate."}</h2><p>{MISSIONS[mission].lesson}</p></div>
          <div className={styles.objective}><p className={styles.eyebrow}><Trophy size={14} /> Earn the mission badge</p><p>{mission === 1 ? "Plot a minimum-energy route. Run Overconfident AI. Verify that its shortcut costs more." : "Plot a minimum-energy route. Finish a careful AI search. Verify that both reach the same minimum."}</p>{wins.includes(mission) ? <span className={styles.earned}><Check size={15} /> Mission complete</span> : <span className={styles.muted}>Experiment as many times as you like.</span>}{mission < 2 && <button className={styles.nextMission} onClick={() => loadMission(mission + 1)}>Next mission <ArrowRight size={14} /></button>}</div>
        </section>
        <Link href="/projects/signal/uncertainty" className={styles.nextChapter}><div><p className={styles.eyebrow}>Ready for a harder question?</p><h2>What if the AI cannot see the truth?</h2><p>Enter the uncertainty chapter. Noisy sensors, Bayesian beliefs, and decisions that cost something.</p></div><ArrowRight size={25} /></Link>
        <footer className={styles.gameFooter}><span><Zap size={13} /> Real search algorithms. Every decision computed in your browser.</span><span>No account. No API key. Just curiosity.</span></footer>
      </div>
    </div>
  );
}
