"use client";

import { useEffect, useMemo, useState } from "react";
import { Shuffle, RotateCw } from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────────
   NarrativeEpidemic — Shiller's core idea made draggable: a story spreads (and
   dies) like a contagion. Drag "how catchy" and "how fast people move on" and
   watch the boom-then-bust curve, plus the R0 that decides whether it spreads.
─────────────────────────────────────────────────────────────────────────── */

const EW = 640;
const EH = 210;
const EPAD = 26;

export function NarrativeEpidemic() {
  const [c, setC] = useState(0.36); // contagiousness
  const [r, setR] = useState(0.06); // forgetting rate

  const { curve, r0 } = useMemo(() => {
    let S = 0.99;
    let I = 0.01;
    const pts: number[] = [];
    for (let t = 0; t < 150; t++) {
      pts.push(I);
      const dI = c * S * I - r * I;
      const dS = -c * S * I;
      S = Math.max(0, S + dS);
      I = Math.max(0, I + dI);
    }
    return { curve: pts, r0: c / r };
  }, [c, r]);

  const maxI = Math.max(...curve, 0.001);
  const toX = (i: number) => EPAD + (i / (curve.length - 1)) * (EW - 2 * EPAD);
  const toY = (v: number) => EH - EPAD - (v / maxI) * (EH - 2 * EPAD);
  const line = curve.map((v, i) => `${i ? "L" : "M"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const area = `${line} L${toX(curve.length - 1).toFixed(1)},${EH - EPAD} L${toX(0).toFixed(1)},${EH - EPAD} Z`;

  const verdict =
    r0 < 1.2
      ? { t: "A damp squib — it fizzles before it ever catches.", c: "text-zinc-500" }
      : r0 < 2.4
        ? { t: "A slow smoulder — spreads, but never takes over.", c: "text-blue-600 dark:text-blue-400" }
        : r0 < 4
          ? { t: "A proper boom — and then, inevitably, the bust.", c: "text-amber-600 dark:text-amber-400" }
          : { t: "A raging mania — steep climb, brutal collapse.", c: "text-rose-600 dark:text-rose-400" };

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        A story is a contagion — drag to spread it
      </div>
      <div className="p-4 sm:p-5">
        <svg viewBox={`0 0 ${EW} ${EH}`} className="w-full h-auto" fill="none">
          <line x1={EPAD} y1={EH - EPAD} x2={EW - EPAD} y2={EH - EPAD} className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" />
          <path d={area} className="fill-blue-500/10" />
          <path d={line} className="stroke-blue-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x={EPAD} y={EH - 8} className="fill-zinc-400" fontSize="10">believers over time →</text>
        </svg>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">
            <span className="mb-1 block text-xs">How catchy is the story?</span>
            <input type="range" min={0.12} max={0.6} step={0.01} value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full accent-blue-500" />
          </label>
          <label className="text-sm text-zinc-600 dark:text-zinc-300">
            <span className="mb-1 block text-xs">How fast do people move on?</span>
            <input type="range" min={0.03} max={0.22} step={0.005} value={r} onChange={(e) => setR(Number(e.target.value))} className="w-full accent-blue-500" />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="font-mono text-xs text-zinc-400">
            R₀ = <span className="text-zinc-700 dark:text-zinc-200">{r0.toFixed(1)}</span>
          </span>
          <span className={`text-sm ${verdict.c}`}>{verdict.t}</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          R₀ above 1 means the story spreads. Sound familiar? Economists borrowed it from epidemiologists.
        </p>
      </div>
    </figure>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   ViralLottery — the same five stories, a different winner every run, because
   early random breaks compound (cumulative advantage). Virality is a lottery.
─────────────────────────────────────────────────────────────────────────── */

const SLOGANS = [
  { emoji: "🚀", label: "“To the moon”" },
  { emoji: "🏠", label: "“Prices only go up”" },
  { emoji: "🤖", label: "“AI changes everything”" },
  { emoji: "💎", label: "“Diamond hands”" },
  { emoji: "📉", label: "“This time is different”" },
];

function simulateCascade(): number[] {
  const n = SLOGANS.length;
  const counts = new Array(n).fill(1);
  const alpha = 1.7;
  for (let k = 0; k < 140; k++) {
    const w = counts.map((x) => Math.pow(x, alpha));
    const sum = w.reduce((a, b) => a + b, 0);
    let rnd = Math.random() * sum;
    let idx = 0;
    for (let i = 0; i < n; i++) {
      rnd -= w[i];
      if (rnd <= 0) {
        idx = i;
        break;
      }
    }
    counts[idx] += 1;
  }
  const total = counts.reduce((a, b) => a + b, 0);
  return counts.map((x) => x / total);
}

export function ViralLottery() {
  const [scores, setScores] = useState<number[]>(() => SLOGANS.map(() => 1 / SLOGANS.length));
  const [runs, setRuns] = useState(0);

  useEffect(() => {
    setScores(simulateCascade());
    setRuns(1);
  }, []);

  const winner = scores.indexOf(Math.max(...scores));

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Same five stories — who runs away this time?</span>
        <button
          onClick={() => {
            setScores(simulateCascade());
            setRuns((r) => r + 1);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <RotateCw className="h-3 w-3" /> run the world again
        </button>
      </div>
      <div className="p-4 sm:p-5">
        <div className="space-y-2">
          {SLOGANS.map((s, i) => {
            const isWin = i === winner && runs > 0;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-sm text-zinc-600 dark:text-zinc-300">
                  {s.emoji} {s.label}
                </span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isWin ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-600"}`}
                    style={{ width: `${Math.round(scores[i] * 100)}%` }}
                  />
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-[11px] text-zinc-400">
                  {Math.round(scores[i] * 100)}%
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] text-zinc-600 dark:text-zinc-300">
          {runs > 0 ? (
            <>
              This run&apos;s runaway hit: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{SLOGANS[winner].label}</span>. Run it again — a <em>different</em> story usually wins. Same merit, different luck.
            </>
          ) : (
            <>Press run.</>
          )}
        </p>
        <p className="mt-1 text-[11px] text-zinc-400">
          Early, random breaks compound (the rich get richer). Which narrative wins is a lottery with loaded dice — not a verdict on truth.
        </p>
      </div>
    </figure>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   NarrativeGenerator — tap for a famous economic/tech narrative and what it did.
─────────────────────────────────────────────────────────────────────────── */

type Kind = "busted" | "self-fulfilling" | "spreading";
type Item = { emoji: string; title: string; story: string; kind: Kind };

const KIND: Record<Kind, { label: string; cls: string }> = {
  busted: { label: "Contagious then busted", cls: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  "self-fulfilling": { label: "Self-fulfilling", cls: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  spreading: { label: "Still spreading", cls: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
};

const ITEMS: Item[] = [
  { emoji: "🌷", title: "Tulip mania (1637)", kind: "busted", story: "A story that tulip bulbs were a one-way bet turned flowers into fortunes — until the story flipped, and a single bulb's price collapsed to a fraction overnight. The tulips never changed; the narrative did." },
  { emoji: "🍸", title: "The Laffer napkin (1974)", kind: "spreading", story: "An economist sketched a curve on a napkin arguing lower taxes could raise revenue. The drawing was simple, vivid, and shareable — and shaped tax policy for decades, far beyond what the evidence supported. A great story beats a careful paper." },
  { emoji: "🏠", title: "“House prices always go up”", kind: "busted", story: "A belief so widely held it felt like physics. It drove lending, building, and buying — until 2008 proved it was a story, not a law, and the whole edifice came down with it." },
  { emoji: "👁️", title: "Dot-com “eyeballs” (1999)", kind: "busted", story: "The narrative said profits didn't matter, only attention did. Money poured into anything with traffic — until the story ran out and the market lost trillions in value." },
  { emoji: "🪙", title: "Bitcoin as “digital gold”", kind: "spreading", story: "Shiller's favourite modern example: a technically dense idea wrapped in a gripping story — rebellion, scarcity, getting rich — that spreads in waves, each boom seeding the memory that fuels the next." },
  { emoji: "🎮", title: "GameStop (2021)", kind: "self-fulfilling", story: "A story — “stick it to the hedge funds” — spread across social media and, amplified by algorithms, became a coordinated buying wave. The narrative literally moved the price it was describing." },
  { emoji: "🏦", title: "The bank run (1930s)", kind: "self-fulfilling", story: "The purest case: a rumour that a bank might fail makes everyone withdraw at once — which makes the bank actually fail. The story doesn't describe reality; it manufactures it." },
  { emoji: "🤖", title: "“AI will change everything”", kind: "spreading", story: "The narrative of our moment. It drives staggering investment and valuations, which fund the very progress that seems to confirm the story — a loop where belief and reality pull each other along." },
  { emoji: "🌐", title: "The metaverse (2021)", kind: "busted", story: "A vivid story about our future lives in virtual worlds moved billions in strategy and stock — then quietly faded when the experience didn't match the telling." },
  { emoji: "💚", title: "“Greed is good” (1987)", kind: "spreading", story: "A single movie line crystallised a whole ethos of finance and seeped into how a generation justified how markets should work. Narratives don't just predict behaviour — they license it." },
  { emoji: "📈", title: "“This time is different”", kind: "busted", story: "The four most expensive words in finance. Every bubble reruns the same story — that the old rules no longer apply — and every time, eventually, they do." },
  { emoji: "⚡", title: "The energy transition", kind: "spreading", story: "A story about an inevitable shift to clean energy is redirecting trillions in capital. Whether it's fully true matters less, in the short run, than how many people act as if it is." },
];

export function NarrativeGenerator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(Math.floor(Math.random() * ITEMS.length));
  }, []);

  const it = ITEMS[i];
  const k = KIND[it.kind];
  const next = () => {
    let n = Math.floor(Math.random() * ITEMS.length);
    if (n === i) n = (n + 1) % ITEMS.length;
    setI(n);
  };

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Famous stories that moved money — tap for another</span>
        <button
          onClick={next}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Shuffle className="h-3 w-3" /> another
        </button>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl leading-none shrink-0" aria-hidden="true">{it.emoji}</div>
          <div className="min-w-0">
            <div className="mb-2">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${k.cls}`}>{k.label}</span>
            </div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">{it.title}</h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">{it.story}</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
