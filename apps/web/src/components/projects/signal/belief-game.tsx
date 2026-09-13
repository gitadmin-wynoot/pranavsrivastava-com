"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Radio, Radar, RotateCcw, ScanLine, ShieldCheck, Sparkles, Target, Waves, Zap } from "lucide-react";
import { ChapterNav } from "./chapter-nav";
import { bestStation, entropy, hiddenStation, incorporate, informationGain, plan, SCENARIOS, sensorReading, STATIONS, updateBelief, type Packet } from "./belief-engine";
import shared from "./signal-game.module.css";
import s from "./belief-game.module.css";

interface Reading extends Packet { before: number[]; after: number[]; prediction: number }
interface Rescue { station: number; truth: number; confidence: number; best: number; score: number; expected: number }
const pct = (p: number) => `${(100 * p).toFixed(1)}%`;

export function BeliefGame() {
  const [caseId, setCaseId] = useState(0);
  const scenario = SCENARIOS[caseId];
  const [seed, setSeed] = useState(scenario.seed);
  const [belief, setBelief] = useState(scenario.prior);
  const [selected, setSelected] = useState(0);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [pending, setPending] = useState<Packet | null>(null);
  const [prediction, setPrediction] = useState(50);
  const [rescue, setRescue] = useState<Rescue | null>(null);
  const [replayed, setReplayed] = useState(false);
  const [notice, setNotice] = useState("Ready when you are — tap a station below, then hit Scan to send your first clue.");
  const [recordId, setRecordId] = useState<number | null>(null);
  const remaining = scenario.budget - readings.length - (pending ? 1 : 0);
  const spent = (readings.length + (pending ? 1 : 0)) * scenario.scanCost;
  const policy = useMemo(() => plan(belief, remaining, scenario.sensor, scenario.scanCost), [belief, remaining, scenario]);
  const gains = useMemo(() => belief.map((_, station) => informationGain(belief, station, scenario.sensor)), [belief, scenario]);
  const curious = gains.indexOf(Math.max(...gains));
  const last = readings[readings.length - 1];
  const inspected = recordId !== null ? readings[recordId] : last;
  const calculation = inspected ? updateBelief(inspected.before, inspected.station, inspected.positive, scenario.sensor) : null;
  const naive = replayed && last ? updateBelief(belief, last.station, last.positive, scenario.sensor).posterior : null;
  const seen = readings.map(r => r.id);
  const locked = !!pending || !!rescue;
  const entropyNow = entropy(belief);
  const predictionError = readings.length ? readings.reduce((sum, r) => sum + Math.abs(r.prediction - 100 * r.after[r.station]), 0) / readings.length : null;

  function reset(index: number, nextSeed = SCENARIOS[index].seed) {
    setCaseId(index); setSeed(nextSeed); setBelief(SCENARIOS[index].prior); setSelected(0);
    setReadings([]); setPending(null); setRescue(null); setReplayed(false); setRecordId(null); setPrediction(50);
    setNotice("New mission. The percentages you see are just the starting hunch — the beacon's real location stays hidden until you call in the rescue.");
  }
  function scan(station: number) {
    if (locked || remaining <= 0) return;
    const count = readings.filter(r => r.station === station).length;
    const packet = { id: `${station}-${count + 1}`, station, positive: sensorReading(scenario, seed, station, count) };
    setSelected(station); setPending(packet); setReplayed(false); setPrediction(Math.round(belief[station] * 100));
    setNotice(`${STATIONS[station]} sent back ${packet.positive ? "a ping" : "silence"}. Before the AI crunches the numbers, slide to your own guess: how likely is it the beacon's really there now?`);
  }
  function reveal() {
    if (!pending) return;
    const result = incorporate(belief, pending, seen, scenario.sensor);
    const reading = { ...pending, before: [...belief], after: result.belief, prediction };
    setReadings([...readings, reading]); setBelief(result.belief); setPending(null); setRecordId(null);
    const delta = entropy(result.belief) - entropy(belief);
    setNotice(`${STATIONS[pending.station]}: ${pct(belief[pending.station])} → ${pct(result.belief[pending.station])}. ${delta > 0.001 ? "That clue actually made things a bit fuzzier — clues can surprise you like that. They help on average, just not every single time." : "Notice the odds shifted at every station, not just this one — the beacon can only be in one place, so more likely here means less likely elsewhere."}`);
  }
  function replay() {
    if (!last || locked) return;
    const result = incorporate(belief, last, seen, scenario.sensor);
    setBelief(result.belief); setReplayed(true);
    setNotice(`That clue (packet ${last.id}) was already counted once — it's not new information, so a careful AI leaves its belief unchanged. The outlined "ghost" bars below show what a careless AI would wrongly believe if it counted the same clue twice.`);
  }
  function dispatch() {
    if (locked) return;
    const truth = hiddenStation(scenario.prior, seed);
    setRescue({ station: selected, truth, confidence: belief[selected], best: bestStation(belief), score: (selected === truth ? 100 : 0) - spent, expected: 100 * belief[selected] - spent });
    setNotice(`The beacon was really at ${STATIONS[truth]}. ${selected === truth ? "Rescue successful — nice work!" : "This time the rescue team went to an empty station."} Whatever happened, check the debrief below: a good guess can still get unlucky, and a lucky guess isn't the same as a good one.`);
  }

  return <div className={shared.game}><div className={shared.shell}>
    <header className={shared.hero}><div>
      <Link href="/projects" className={shared.back}><ArrowLeft size={14} /> Back to projects</Link>
      <p className={shared.eyebrow}><span className={shared.liveDot} /> Signal · Chapter 02 · Reasoning under uncertainty</p>
      <h1>Question the <span>signal.</span></h1>
      <p className={shared.lead}>A robot helper thinks it knows where the beacon is. You get the final say.</p>
      <p className={shared.intro}>One hidden rescue beacon, three possible stations, and a sensor that isn't perfect. Scan for clues, make your own guess before the AI answers, and decide when you've learned enough to call in the rescue.</p>
    </div><div className={shared.heroArt} aria-hidden="true"><div className={shared.orbit} /><div className={shared.orbitInner} /><div className={shared.orbitCore}><Radar size={36} strokeWidth={1.2} /></div><span className={shared.orbitLabel}>EVIDENCE ≠ CERTAINTY</span></div></header>
    <ChapterNav current="uncertainty" />

    <section className={s.story} aria-label="Mission story">
      <Radio size={22} strokeWidth={1.4} />
      <div>
        <p className={shared.eyebrow}>Mission briefing</p>
        <p>A hiking group got caught out on the mountain when a storm rolled in, and their emergency beacon is the only way to find them. It&apos;s transmitting from exactly <b>one</b> of three ranger stations — Aster, Boreal, or Cygnus — but nobody knows which. You&apos;re running the rescue control room, with a robot helper that can scan any station for a signal. The trouble is, its sensor isn&apos;t perfect: sometimes it &ldquo;hears&rdquo; a beacon that isn&apos;t really there, and sometimes it misses one that is. Every scan also burns time (and points), so you can&apos;t just check everywhere. Gather clues, trust your own judgment, and call in the rescue before you run out of scans.</p>
      </div>
    </section>

    <div className={s.howto} aria-label="How to play">
      <p className={shared.eyebrow}>How to play</p>
      <div className={s.howtoGrid}>
        <div className={s.howtoStep}><span>1</span><div><b>Pick a station</b><small>Tap Aster, Boreal, or Cygnus below — that&apos;s the spot you want your robot to check next.</small></div></div>
        <div className={s.howtoStep}><span>2</span><div><b>Send a scan</b><small>Hit Scan. It costs a few points, but you&apos;ll get a real clue back: a ping, or silence.</small></div></div>
        <div className={s.howtoStep}><span>3</span><div><b>Make your guess</b><small>Before the AI does its math, slide to how sure YOU are the beacon&apos;s there — then reveal and compare.</small></div></div>
        <div className={s.howtoStep}><span>4</span><div><b>Scan again, or call it in</b><small>Not sure yet? Scan another station. Confident? Hit Rescue — that&apos;s your final answer.</small></div></div>
      </div>
      <p className={s.howtoTip}>Tip: the &ldquo;AI&apos;s advice&rdquo; panel on the right will always suggest a move — but the decision is yours. Try disagreeing with it once and see what happens!</p>
    </div>

    <div className={shared.missionBar} aria-label="Uncertainty scenarios">{SCENARIOS.map((item, i) => <button key={item.title} className={`${shared.mission} ${i === caseId ? shared.missionActive : ""}`} aria-pressed={i === caseId} onClick={() => reset(i)}><span className={shared.missionNumber}>0{i + 1}</span><span><strong>{item.title}</strong><small>{["A tricky first guess", "Does the same clue twice count?", "When to stop looking"][i]}</small></span><ArrowRight size={14} /></button>)}</div>

    <div className={s.layout}>
      <section className={s.field} aria-label="Bayesian rescue field">
        <div className={s.titleRow}><div><p className={shared.eyebrow}>Investigation 0{caseId + 1}</p><h2>{scenario.title}</h2></div><span className={s.budget}><Radio size={13} /> {remaining} scans left</span></div>
        <p className={s.brief}>{scenario.brief}</p>
        <div className={s.sensorSpec}><span title="If the beacon really is at this station, this is how often the sensor correctly picks it up.">True signal detected <b>{pct(scenario.sensor.sensitivity)}</b></span><span title="If the beacon is NOT at this station, this is how often the sensor still (wrongly) reports a ping.">False alarm rate <b>{pct(scenario.sensor.falseAlarm)}</b></span><span title="Points deducted from your score every time you scan a station.">Cost per scan <b>{scenario.scanCost} pts</b></span></div>

        <div className={s.constellation}>
          <div className={s.radarGrid} aria-hidden="true"><span /><span /><span /></div>
          <div className={s.stationRow}>{STATIONS.map((name, i) => <button key={name} className={`${s.station} ${selected === i ? s.stationSelected : ""} ${rescue?.truth === i ? s.trueStation : ""}`} aria-pressed={selected === i} aria-label={`Select ${name}, current belief ${pct(belief[i])}`} disabled={locked} onClick={() => { setSelected(i); setReplayed(false); }}>
            <span className={s.stationGlyph}>{rescue?.truth === i ? <Radio size={27} /> : <Target size={27} strokeWidth={1.3} />}</span>
            <span className={s.stationName}>{name}</span><strong>{pct(belief[i])}</strong><small>{rescue ? rescue.truth === i ? "SIGNAL FOUND" : "EMPTY STATION" : "CURRENT BELIEF"}</small>
          </button>)}</div>
          <div className={s.transmission}><span className={s.pulse} /><span>{rescue ? "TRUTH REVEALED" : pending ? `PACKET ${pending.id} · ${pending.positive ? "POSITIVE PING" : "NO PING"}` : "ONE SIGNAL · THREE POSSIBLE WORLDS"}</span></div>
        </div>

        <div className={s.beliefHeader}><span>Belief distribution</span><small title="How mixed-up the AI's guess still is. Lower means more confident; 0 would mean totally sure.">Uncertainty: {entropyNow.toFixed(3)} bits</small></div>
        <div className={s.stackedBar} role="img" aria-label={STATIONS.map((name, i) => `${name} ${pct(belief[i])}`).join(", ")}>{belief.map((p, i) => <span key={i} style={{ width: `${100 * p}%` }} className={s[`stationColor${i}`]} />)}</div>
        <div className={s.barLegend}>{STATIONS.map((name, i) => <span key={name}><i className={s[`stationColor${i}`]} />{name} <b>{pct(belief[i])}</b></span>)}</div>
        {naive && <div className={s.echoComparison}><p><Waves size={14} /> If the same packet were counted twice</p>{STATIONS.map((name, i) => <div key={name}><span>{name}</span><div className={s.echoTrack}><i style={{ width: `${belief[i] * 100}%` }} /><b style={{ width: `${naive[i] * 100}%` }} /></div><small>{pct(belief[i])} → {pct(naive[i])}</small></div>)}<small>Solid = correct belief. Outline = mistaken update. No new measurement was made.</small></div>}

        <div className={shared.feedback} role="status"><Sparkles size={16} /><span>{notice}</span></div>
        {pending ? <div className={s.prediction}>
          <p className={shared.eyebrow}>Your prediction, before the AI answers</p><h3>{pending.positive ? "A ping came back." : "The detector was silent."} How likely is {STATIONS[pending.station]} now?</h3>
          <div><input aria-label="Your predicted probability" type="range" min={0} max={100} value={prediction} onChange={e => setPrediction(Number(e.target.value))} /><output>{prediction}%</output></div>
          <button className={shared.runButton} onClick={reveal}>Lock prediction & reveal <ArrowRight size={15} /></button>
        </div> : !rescue ? <div className={s.actionRow}>
          <button className={shared.runButton} disabled={remaining === 0} onClick={() => scan(selected)}><ScanLine size={16} /> Scan {STATIONS[selected]} <small>−{scenario.scanCost}</small></button>
          <button className={s.dispatch} onClick={dispatch}><Radio size={15} /> Rescue {STATIONS[selected]}</button>
          <button className={s.replay} disabled={!last} onClick={replay}><RotateCcw size={14} /> Replay last packet</button>
        </div> : <div className={s.result} role="status">
          <p className={shared.eyebrow}>{rescue.station === rescue.truth ? "Rescue successful" : "Rescue missed"}</p><h3>{rescue.score} points <span>{rescue.station === rescue.truth ? 100 : 0} for this rescue − {spent} spent on scans</span></h3>
          <p>You dispatched to {STATIONS[rescue.station]} at {pct(rescue.confidence)} confidence. The signal was at <strong>{STATIONS[rescue.truth]}</strong>.</p>
          <div className={s.resultFacts}><span>Expected score at dispatch<b>{rescue.expected.toFixed(1)}</b></span><span>Mean prediction gap<b>{predictionError === null ? "No predictions" : `${predictionError.toFixed(1)} pp`}</b></span></div>
          <p>{rescue.station === rescue.best ? "You chose the most likely station. Even the best decision can fail: probability is not a promise." : `The AI favoured ${STATIONS[rescue.best]}. A lucky rescue would not make the lower-probability choice better in expectation.`} The expected score measures decision quality under this model; one outcome cannot validate the model.</p>
          <button className={shared.runButton} onClick={() => reset(caseId, seed + 9973)}>New hidden signal <ArrowRight size={15} /></button>
        </div>}
        <p className={s.rules}>You can only rescue once — that&apos;s your final answer: +100 points if you&apos;re right, +0 if you&apos;re wrong. Every new scan costs a few points too, so the fastest, smartest detective wins. Replaying an old clue is free, but it won&apos;t teach the AI anything it doesn&apos;t already know.</p>
        <div className={s.trail}><div className={s.titleRow}><h3>Evidence trail</h3><button onClick={() => reset(caseId, seed)}><RotateCcw size={12} /> Restart this signal</button></div>
          {!readings.length && <p className={s.empty}>Every reading will leave a trace here. Select one to inspect its calculation.</p>}
          {readings.map((r, i) => <button key={r.id} aria-pressed={(recordId ?? readings.length - 1) === i} onClick={() => setRecordId(i)}><span className={s.packetId}>{String(i + 1).padStart(2, "0")}</span><span><b>{STATIONS[r.station]} · {r.positive ? "positive ping" : "no ping"}</b><small>Your prediction {r.prediction}% · AI {pct(r.after[r.station])} · gap {Math.abs(r.prediction - 100 * r.after[r.station]).toFixed(1)} pp</small></span><ArrowRight size={13} /></button>)}
        </div>
      </section>

      <aside className={s.reasoning} aria-label="Bayesian AI reasoning">
        <div className={s.titleRow}><h2><Sparkles size={17} /> The AI’s advice</h2><span className={shared.eyebrow}>You decide</span></div>
        <div className={s.advice}><p className={shared.eyebrow}>{pending ? "Waiting for your prediction" : rescue ? "Decision complete" : "Expected-score planner"}</p><h3>{policy.shouldScan ? `Scan ${STATIONS[policy.bestScan]}.` : `Rescue ${STATIONS[policy.rescueStation]}.`}</h3><p>{policy.shouldScan ? `That scan has the highest expected future score: ${policy.scanValues[policy.bestScan].toFixed(1)} points, versus ${policy.rescueValue.toFixed(1)} for rescuing now.` : `Rescuing now is worth ${policy.rescueValue.toFixed(1)} expected points. ${remaining ? "Further scanning cannot improve that expectation after its cost." : "No scan budget remains."}`} These values exclude points already spent.</p>
          <button disabled={locked} onClick={() => { if (policy.shouldScan) scan(policy.bestScan); else { setSelected(policy.rescueStation); setNotice(`AI recommends ${STATIONS[policy.rescueStation]}. It is selected; use Rescue to make your final decision.`); } }}><Check size={14} /> {policy.shouldScan ? "Take the suggested scan" : "Select the AI’s choice"}</button>
        </div>
        <div className={s.information}><p className={shared.eyebrow}>Curiosity asks a different question</p><h3>Which scan reduces uncertainty most?</h3>{STATIONS.map((name, i) => <div key={name}><span>{name}{i === curious ? " ★" : ""}</span><div><i style={{ width: `${Math.max(0, gains[i]) / Math.max(...gains, .001) * 100}%` }} /></div><b>{gains[i].toFixed(3)} bits</b></div>)}<p>Expected information gain averages both possible readings. {curious !== policy.bestScan && policy.shouldScan ? "The most informative scan and the best-scoring scan differ here." : !policy.shouldScan && remaining > 0 ? "There is still information to gain, but the planner would stop: information has a price." : "Reducing uncertainty and maximising reward are different objectives."}</p></div>

        <p className={s.deeperNote}>Curious exactly how the AI thinks? Open any panel below to see the real math behind it — you don&apos;t need any of it to play.</p>
        <details className={s.proof} open><summary>01 · Bayes, with your actual numbers <ChevronDown size={14} /></summary>
          {inspected && calculation ? <><p>Packet {inspected.id}: {STATIONS[inspected.station]} returned {inspected.positive ? "a positive ping" : "no ping"}. Reweight every possible world, then normalise.</p><div className={s.bayesTable}><div><b>World</b><b>Prior</b><b>Likelihood</b><b>Joint</b></div>{STATIONS.map((name, i) => <div key={name}><span>{name}</span><span>{pct(inspected.before[i])}</span><span>{(calculation.mass[i] / inspected.before[i]).toFixed(2)}</span><span>{calculation.mass[i].toFixed(4)}</span></div>)}</div><div className={s.equation}>P({STATIONS[inspected.station]} | reading)<br /><strong>{calculation.mass[inspected.station].toFixed(4)} ÷ {calculation.evidence.toFixed(4)} = {pct(inspected.after[inspected.station])}</strong></div><p>Certificate: the three joint masses sum to {calculation.evidence.toFixed(4)}; the posterior sums to {inspected.after.reduce((a, b) => a + b, 0).toFixed(6)}. This verifies the arithmetic given our model, not the hidden location.</p></> : <p>Scan and reveal a reading to see its full calculation. Bayes’ theorem follows by equating P(H,E) = P(E|H)P(H) = P(H|E)P(E), then dividing by P(E) &gt; 0.</p>}
        </details>
        <details className={s.proof}><summary>02 · Why an echo teaches us nothing <ChevronDown size={14} /></summary><p>For a repeated copy E of the same packet, P(E,E|H) = P(E|H), because E ∩ E = E. Therefore P(H|E,E) = P(H|E).</p><p>Multiplying by the likelihood again assumes a new, conditionally independent measurement. Try “Replay last packet” to see that mistake. The careful AI deduplicates packet IDs.</p></details>
        <details className={s.proof}><summary>03 · Can evidence make us less certain? <ChevronDown size={14} /></summary><p>Entropy H(p) = −Σ p log₂ p measures uncertainty. A surprising outcome can increase it. But expected information gain is H(before) − Σ P(reading)H(after reading).</p><p>This equals a weighted average of KL divergences between posterior and prior. Each is nonnegative (Gibbs’ inequality), so the average is nonnegative. The theorem is about the average, not every reading.</p></details>
        <details className={s.proof}><summary>04 · When should the AI stop? <ChevronDown size={14} /></summary><p>The planner evaluates every scan and both outcomes for up to {remaining} remaining scans. It may rescue at any step.</p><div className={s.equation}>V(b, k) = max [100 max(b),<br /> max scan (−cost + Σ P(e) V(b′, k−1))]</div><p>At k = 0, rescue the most likely station. Working backward gives the best expected score under these stated probabilities and rewards. This is Bellman’s principle of optimality: after any observation, the remaining plan must itself be optimal for the updated belief and budget.</p></details>
        <a className={shared.source} href="https://www.cs.cmu.edu/afs/cs/project/jair/pub/volume23/roy05a-html/node6.html" target="_blank" rel="noopener noreferrer">Belief states and decisions · CMU research <ArrowRight size={12} /></a>
      </aside>
    </div>
    <section className={s.takeaway}><ShieldCheck size={23} /><div><p className={shared.eyebrow}>The idea to take with you</p><h2>{scenario.lesson}</h2><p>Real AI systems make decisions from incomplete evidence. Ask where the prior came from, whether observations are independent, and which objective the system is actually optimising.</p></div></section>
    <footer className={shared.gameFooter}><span><Zap size={13} /> Bayesian inference + a finite-horizon decision planner. Computed locally.</span><span>Three seeded scenarios. New hidden signals for repeat play.</span></footer>
  </div></div>;
}
