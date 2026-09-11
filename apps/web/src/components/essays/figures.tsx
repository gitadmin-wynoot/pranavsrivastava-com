import type { ReactNode } from "react";
import { NetworkUseCases } from "./network-use-cases";
import { TelcoEraSlider } from "./telco-era-slider";
import { GuardrailSim } from "./guardrail-sim";
import { NarrativeEpidemic, ViralLottery, NarrativeGenerator } from "./narrative-viz";
import { AIFootprint } from "./ai-footprint";
import { FourTurnings } from "./four-turnings";
import { ProgressReceipts } from "./progress-receipts";
import { HubsCompare } from "./hubs-compare";
import { MultipleDiscovery } from "./multiple-discovery";
import { SyncField } from "./sync-field";
import { ThinkingToolkit } from "./thinking-toolkit";
import { ThinkerTypes } from "./thinker-types";
import { LeapsTimeline } from "./leaps-timeline";
import { PrastaraBinary } from "./prastara-binary";
import { FibonacciRhythms } from "./fibonacci-rhythms";
import { PratyaharaIndex } from "./pratyahara-index";
import { GrammarMachine } from "./grammar-machine";
import { InventorsGallery } from "./inventors-gallery";
import { InventionLessons } from "./invention-lessons";
import { OriginLedger } from "./origin-ledger";
import { AncientGames } from "./ancient-games";
import { MachinesVsHumans } from "./machines-vs-humans";
import { PriceOfLight } from "./price-of-light";
import { ReboundGallery } from "./rebound-gallery";
import { GlobalReshuffle } from "./global-reshuffle";
import { PanicPattern } from "./panic-pattern";
import { CognitionCurve } from "./cognition-curve";
import { ClimatePhilosophers } from "./climate-philosophers";
import { InwardOutward } from "./two-paths";
import { IntelligenceLadder } from "./intelligence-ladder";
import { CivilizationalShifts } from "./civilizational-shifts";
import { SectorImpact } from "./sector-impact";
import { ForecastSpread } from "./forecast-spread";
import { RandomnessTimeline } from "./randomness-timeline";
import { RandomnessSpectrum } from "./randomness-spectrum";
import { WillowBenchmark } from "./willow-benchmark";
import { PSHECurve } from "./pshe-curve";
import { EigenQuestionExplainer } from "./eigen-question-explainer";
import { EigenQuestionGallery } from "./eigen-question-gallery";
import { SimulationPractice } from "./simulation-practice";

// Editorial SVG illustrations for the essays. Hand-drawn vectors, not arrow
// flowcharts — minimal, conceptual, and dark-mode aware (colours come from
// Tailwind fill-/stroke- classes). Use as <EssayFigure name="..." />.

function Frame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="my-10 not-prose">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 px-5 py-6 sm:px-8 sm:py-8">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500 italic leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Two stories: spreads vs. concentrates ──────────────────────────────── */
function TwoStories() {
  const leftTargets = [46, 78, 110, 142, 174, 206];
  const rightSources = [46, 78, 110, 142, 174, 206];
  return (
    <svg viewBox="0 0 640 236" className="w-full h-auto" fill="none" role="img">
      <line x1="320" y1="26" x2="320" y2="210" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="3 6" />

      {/* Left — spreads */}
      <text x="36" y="30" className="fill-emerald-600 dark:fill-emerald-400" fontSize="13" fontWeight="600">Spreads</text>
      <text x="36" y="48" className="fill-zinc-400" fontSize="11">ability reaches many</text>
      {leftTargets.map((y, i) => (
        <line key={i} x1="74" y1="126" x2="248" y2={y} className="stroke-emerald-400/60 dark:stroke-emerald-500/40" strokeWidth="1.25" />
      ))}
      {leftTargets.map((y, i) => (
        <circle key={`d${i}`} cx="250" cy={y} r="3.5" className="fill-emerald-500" />
      ))}
      <circle cx="68" cy="126" r="6.5" className="fill-emerald-500" />

      {/* Right — concentrates */}
      <text x="604" y="30" textAnchor="end" className="fill-amber-600 dark:fill-amber-400" fontSize="13" fontWeight="600">Concentrates</text>
      <text x="604" y="48" textAnchor="end" className="fill-zinc-400" fontSize="11">power gathers in a few</text>
      {rightSources.map((y, i) => (
        <line key={i} x1="392" y1={y} x2="556" y2="126" className="stroke-amber-400/60 dark:stroke-amber-500/40" strokeWidth="1.25" />
      ))}
      {rightSources.map((y, i) => (
        <circle key={`s${i}`} cx="390" cy={y} r="3.5" className="fill-amber-500/80" />
      ))}
      <circle cx="566" cy="126" r="13" className="fill-amber-500" />
    </svg>
  );
}

/* ── The gap: intelligence vs. wisdom over time ─────────────────────────── */
function TheGap() {
  return (
    <svg viewBox="0 0 640 300" className="w-full h-auto" fill="none" role="img">
      <line x1="56" y1="252" x2="600" y2="252" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      <text x="56" y="276" className="fill-zinc-400" fontSize="11">time →</text>

      {/* the widening gap */}
      <path
        d="M56,232 C 280,226 430,150 596,64 L 596,150 C 430,184 250,222 56,232 Z"
        className="fill-zinc-300/30 dark:fill-zinc-600/20"
      />
      {/* intelligence — steep */}
      <path d="M56,232 C 300,224 440,150 596,64" className="stroke-blue-500" strokeWidth="2.5" strokeLinecap="round" />
      {/* wisdom — gentle */}
      <path d="M56,232 C 240,224 430,184 596,150" className="stroke-emerald-500" strokeWidth="2.5" strokeLinecap="round" />

      <text x="500" y="54" className="fill-blue-600 dark:fill-blue-400" fontSize="13" fontWeight="600">Intelligence</text>
      <text x="510" y="168" className="fill-emerald-600 dark:fill-emerald-400" fontSize="13" fontWeight="600">Wisdom</text>
      <text x="250" y="150" className="fill-zinc-400 dark:fill-zinc-500" fontSize="11" fontStyle="italic">the gap that decides</text>
    </svg>
  );
}

/* ── Two paths: the shortcut vs. the struggle ───────────────────────────── */
function TwoPaths() {
  return (
    <svg viewBox="0 0 640 286" className="w-full h-auto" fill="none" role="img">
      {/* Question */}
      <circle cx="74" cy="150" r="6.5" className="fill-zinc-400 dark:fill-zinc-500" />
      <text x="74" y="182" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="12">Question</text>

      {/* Shortcut → Answer */}
      <path d="M86,144 C 250,86 420,78 540,84" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />
      <text x="300" y="78" textAnchor="middle" className="fill-zinc-400" fontSize="11">the shortcut · instant</text>
      <circle cx="552" cy="84" r="6.5" className="fill-blue-500" />
      <text x="566" y="88" className="fill-blue-600 dark:fill-blue-400" fontSize="13" fontWeight="600">Answer</text>

      {/* Long road through the struggle → Understanding */}
      <path d="M86,158 C 170,252 252,248 306,244 C 410,236 474,212 544,186" className="stroke-emerald-500" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="300" cy="245" r="4.5" className="fill-amber-500" />
      <text x="300" y="270" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="11">the struggle</text>
      <circle cx="552" cy="186" r="6.5" className="fill-emerald-500" />
      <text x="566" y="190" className="fill-emerald-600 dark:fill-emerald-400" fontSize="13" fontWeight="600">Understanding</text>
    </svg>
  );
}

/* ── Falling forward: progress is a line of falls ───────────────────────── */
function FallingForward() {
  const pts =
    "56,196 110,150 150,196 210,130 250,180 320,116 360,162 430,100 470,148 556,78";
  const peaks: Array<[number, number]> = [
    [110, 150],
    [210, 130],
    [320, 116],
    [430, 100],
  ];
  const falls: Array<[number, number]> = [
    [150, 196],
    [250, 180],
    [360, 162],
    [470, 148],
  ];
  return (
    <svg viewBox="0 0 640 240" className="w-full h-auto" fill="none" role="img">
      <line x1="56" y1="210" x2="592" y2="210" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      <text x="56" y="230" className="fill-zinc-400" fontSize="11">attempts · time →</text>
      <polyline points={pts} className="stroke-emerald-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {peaks.map(([x, y], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r="3.5" className="fill-emerald-500" />
      ))}
      {falls.map(([x, y], i) => (
        <circle key={`f${i}`} cx={x} cy={y} r="4.5" className="fill-amber-500" />
      ))}
      <circle cx="56" cy="196" r="5" className="fill-zinc-400 dark:fill-zinc-500" />
      <text x="56" y="182" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11">born</text>
      <circle cx="556" cy="78" r="6" className="fill-emerald-500" />
      <text x="556" y="66" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="600">walking</text>
      <text x="308" y="205" textAnchor="middle" className="fill-amber-600/80 dark:fill-amber-400/80" fontSize="11" fontStyle="italic">every dip is a fall — none of them counts as failure</text>
    </svg>
  );
}

/* ── Risk window: cost vs. capacity to recover over a life ───────────────── */
function RiskWindow() {
  return (
    <svg viewBox="0 0 640 300" className="w-full h-auto" fill="none" role="img">
      <line x1="56" y1="252" x2="600" y2="252" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      <text x="56" y="276" className="fill-zinc-400" fontSize="11">age →</text>
      {/* the cheap years — where recovery dwarfs cost */}
      <path d="M56,84 C 200,122 300,150 360,168 L 360,236 C 300,228 200,234 56,238 Z" className="fill-emerald-500/10" />
      {/* cost of a failure — rises with age */}
      <path d="M56,238 C 260,232 430,150 596,72" className="stroke-amber-500" strokeWidth="2.5" strokeLinecap="round" />
      {/* room to recover — falls with age */}
      <path d="M56,84 C 240,124 430,210 596,238" className="stroke-emerald-500" strokeWidth="2.5" strokeLinecap="round" />
      <text x="596" y="60" textAnchor="end" className="fill-amber-600 dark:fill-amber-400" fontSize="13" fontWeight="600">What a failure costs</text>
      <text x="60" y="74" className="fill-emerald-600 dark:fill-emerald-400" fontSize="13" fontWeight="600">Room to recover</text>
      <text x="180" y="206" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" fontStyle="italic">the cheap years</text>
    </svg>
  );
}

/* ── Old schools: the world's traditions of learning by doing ───────────── */
function OldSchools() {
  const cx = 320;
  const cy = 178;
  type N = { x: number; y: number; region: string; method: string; anchor: "start" | "middle" | "end"; color: string };
  const nodes: N[] = [
    { x: 320, y: 42, region: "The Stoa", method: "voluntary hardship", anchor: "middle", color: "amber" },
    { x: 512, y: 86, region: "Japan", method: "nanakorobi yaoki", anchor: "start", color: "rose" },
    { x: 584, y: 184, region: "India", method: "gurukul · jugaad", anchor: "start", color: "emerald" },
    { x: 498, y: 296, region: "Greece", method: "mētis · cunning", anchor: "start", color: "sky" },
    { x: 150, y: 296, region: "West Africa", method: "sankofa", anchor: "end", color: "violet" },
    { x: 56, y: 184, region: "Nordics", method: "risky play", anchor: "end", color: "blue" },
    { x: 138, y: 86, region: "Polynesia", method: "wayfinding", anchor: "end", color: "cyan" },
  ];
  const dotFill: Record<string, string> = {
    amber: "fill-amber-500",
    rose: "fill-rose-500",
    emerald: "fill-emerald-500",
    sky: "fill-sky-500",
    violet: "fill-violet-500",
    blue: "fill-blue-500",
    cyan: "fill-cyan-500",
  };
  return (
    <svg viewBox="0 0 640 340" className="w-full h-auto" fill="none" role="img">
      {nodes.map((n, i) => (
        <line key={`l${i}`} x1={cx} y1={cy} x2={n.x} y2={n.y} className="stroke-zinc-200 dark:stroke-zinc-700/70" strokeWidth="1" />
      ))}
      {/* centre */}
      <circle cx={cx} cy={cy} r="7" className="fill-zinc-800 dark:fill-zinc-100" />
      <text x={cx} y={cy - 18} textAnchor="middle" className="fill-zinc-700 dark:fill-zinc-200" fontSize="12" fontWeight="600">learn by doing</text>
      <text x={cx} y={cy + 26} textAnchor="middle" className="fill-zinc-400" fontSize="11" fontStyle="italic">fall early, fall cheap</text>
      {nodes.map((n, i) => {
        const tx = n.anchor === "start" ? n.x + 12 : n.anchor === "end" ? n.x - 12 : n.x;
        const top = n.anchor === "middle";
        const ry = top ? n.y - 20 : n.y - 2;
        const my = top ? n.y - 6 : n.y + 13;
        return (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={n.y} r="4.5" className={dotFill[n.color]} />
            <text x={tx} y={ry} textAnchor={n.anchor} className="fill-zinc-700 dark:fill-zinc-200" fontSize="12" fontWeight="600">{n.region}</text>
            <text x={tx} y={my} textAnchor={n.anchor} className="fill-zinc-400" fontSize="11">{n.method}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Telco's three eras: closed → programmable → intelligent ────────────── */
function TelcoEras() {
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto" fill="none" role="img">
      {/* timeline */}
      <line x1="40" y1="150" x2="540" y2="150" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
      <line x1="540" y1="150" x2="600" y2="150" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" strokeDasharray="4 5" />
      <path d="M600,150 l-8,-4 l0,8 z" className="fill-zinc-400 dark:fill-zinc-500" />
      <text x="596" y="172" textAnchor="end" className="fill-zinc-400" fontSize="10" fontStyle="italic">the future is dashed</text>

      {/* Phase 1 — closed */}
      <circle cx="120" cy="150" r="6" className="fill-amber-500" />
      <text x="120" y="96" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="13" fontWeight="600">Closed</text>
      <text x="120" y="114" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11">SS7 · the dial tone</text>
      <text x="120" y="129" textAnchor="middle" className="fill-zinc-400" fontSize="10">reliable, rigid, walled</text>

      {/* Phase 2 — programmable */}
      <circle cx="320" cy="150" r="7" className="fill-blue-500" />
      <text x="320" y="96" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="13" fontWeight="600">Programmable</text>
      <text x="320" y="114" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11">CPaaS · CAMARA · APIs</text>
      <text x="320" y="129" textAnchor="middle" className="fill-zinc-400" fontSize="10">the network as code</text>

      {/* Phase 3 — intelligent */}
      <circle cx="510" cy="150" r="6" className="fill-emerald-500" />
      <text x="510" y="96" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="13" fontWeight="600">Intelligent</text>
      <text x="510" y="114" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11">AI + the network</text>
      <text x="510" y="129" textAnchor="middle" className="fill-zinc-400" fontSize="10">sensing & acting</text>
    </svg>
  );
}

/* ── Network-as-API: capabilities exposed up the stack ──────────────────── */
function NetworkAsApi() {
  const layer = (y: number, cls: string, title: string, sub: string) => (
    <>
      <rect x="120" y={y} width="400" height="46" rx="10" className={cls} strokeWidth="1.5" />
      <text x="140" y={y + 22} className="fill-zinc-800 dark:fill-zinc-100" fontSize="13" fontWeight="600">{title}</text>
      <text x="140" y={y + 38} className="fill-zinc-500 dark:fill-zinc-400" fontSize="11">{sub}</text>
    </>
  );
  return (
    <svg viewBox="0 0 640 250" className="w-full h-auto" fill="none" role="img">
      {layer(20, "fill-emerald-500/10 stroke-emerald-500/50", "Developers & apps", "call an API — no telco degree required")}
      {layer(102, "fill-blue-500/10 stroke-blue-500/50", "Open Gateway · CAMARA · TM Forum", "one standard contract across operators")}
      {layer(184, "fill-amber-500/10 stroke-amber-500/50", "The mobile network (4G/5G, NEF)", "location · quality · SIM-swap · verify")}
      {/* upward arrows */}
      <path d="M320,184 L320,150" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="1.5" markerEnd="" />
      <path d="M320,150 l-4,8 l8,0 z" className="fill-zinc-400 dark:fill-zinc-500" />
      <path d="M320,102 L320,68" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="1.5" />
      <path d="M320,68 l-4,8 l8,0 z" className="fill-zinc-400 dark:fill-zinc-500" />
    </svg>
  );
}

/* ── The API as attack surface: an agent, many doors ────────────────────── */
function ApiAttackSurface() {
  const apis = [
    { y: 46, label: "Network API", risk: "over-broad token" },
    { y: 118, label: "Payments API", risk: "broken authz (BOLA)" },
    { y: 190, label: "Customer data API", risk: "injected instruction" },
  ];
  return (
    <svg viewBox="0 0 640 250" className="w-full h-auto" fill="none" role="img">
      {/* agent */}
      <rect x="40" y="102" width="120" height="46" rx="10" className="fill-violet-500/10 stroke-violet-500/60" strokeWidth="1.5" />
      <text x="100" y="124" textAnchor="middle" className="fill-zinc-800 dark:fill-zinc-100" fontSize="13" fontWeight="600">AI agent</text>
      <text x="100" y="140" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="10">acts on your behalf</text>

      {apis.map((a, i) => (
        <g key={i}>
          <line x1="160" y1="125" x2="360" y2={a.y + 23} className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
          {/* risk marker */}
          <circle cx={260} cy={(125 + a.y + 23) / 2} r="4.5" className="fill-rose-500" />
          <rect x="360" y={a.y} width="150" height="46" rx="10" className="fill-blue-500/10 stroke-blue-500/50" strokeWidth="1.5" />
          <text x="435" y={a.y + 22} textAnchor="middle" className="fill-zinc-800 dark:fill-zinc-100" fontSize="12" fontWeight="600">{a.label}</text>
          <text x="435" y={a.y + 38} textAnchor="middle" className="fill-rose-600/90 dark:fill-rose-400/90" fontSize="10">{a.risk}</text>
        </g>
      ))}
      <text x="260" y="235" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="11" fontStyle="italic">● every call is a door someone can walk through</text>
    </svg>
  );
}

/* ── Story as compression: a messy world squeezed into one causal tale ───── */
function StoryCompression() {
  const dots: Array<[number, number]> = [];
  for (let i = 0; i < 44; i++) dots.push([30 + (i % 11) * 16, 40 + Math.floor(i / 11) * 40]);
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto" fill="none" role="img">
      <text x="110" y="24" textAnchor="middle" className="fill-zinc-400" fontSize="11">the world (messy, high-dimensional)</text>
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" className="fill-zinc-300 dark:fill-zinc-600" />
      ))}
      {/* funnel */}
      <path d="M230,40 L300,95 L300,125 L230,180" className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1.25" strokeDasharray="4 5" />
      <text x="330" y="106" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" fontStyle="italic">compressed into</text>
      {/* the story */}
      <rect x="430" y="86" width="180" height="48" rx="10" className="fill-blue-500/10 stroke-blue-500/50" strokeWidth="1.5" />
      <text x="520" y="108" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="13" fontWeight="600">“X causes Y”</text>
      <text x="520" y="124" textAnchor="middle" className="fill-zinc-400" fontSize="10">one shareable story</text>
    </svg>
  );
}

/* ── The reflexive loop: story → belief → action → reality → story ───────── */
function NarrativeLoop() {
  const cx = 320;
  const cy = 130;
  const R = 74;
  const nodes = [
    { a: -90, label: "Story", color: "fill-blue-600 dark:fill-blue-400" },
    { a: -18, label: "Belief", color: "fill-violet-600 dark:fill-violet-400" },
    { a: 54, label: "Action", color: "fill-emerald-600 dark:fill-emerald-400" },
    { a: 126, label: "Reality", color: "fill-amber-600 dark:fill-amber-400" },
    { a: 198, label: "New story", color: "fill-rose-600 dark:fill-rose-400" },
  ];
  const pos = (a: number) => [cx + R * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)];
  return (
    <svg viewBox="0 0 640 260" className="w-full h-auto" fill="none" role="img">
      <circle cx={cx} cy={cy} r={R} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1.5" strokeDasharray="4 6" />
      {nodes.map((n, i) => {
        const [x, y] = pos(n.a);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="5" className="fill-zinc-400 dark:fill-zinc-500" />
            <text x={x} y={y - 12} textAnchor="middle" className={n.color} fontSize="12" fontWeight="600">{n.label}</text>
          </g>
        );
      })}
      {/* AI amplifier */}
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="12" fontWeight="600">AI</text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="fill-zinc-400" fontSize="10">amplifies the loop</text>
      {[-90, -18, 54, 126, 198].map((a, i) => {
        const [x, y] = pos(a);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" />;
      })}
    </svg>
  );
}

/* ── Perez's surge: installation → crash → deployment (the golden age) ───── */
function PerezSurge() {
  return (
    <svg viewBox="0 0 640 300" className="w-full h-auto" fill="none" role="img">
      <line x1="48" y1="250" x2="600" y2="250" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      <text x="48" y="272" className="fill-zinc-400" fontSize="11">time →</text>

      {/* installation phase — rises into a bubble */}
      <path d="M48,236 C 150,214 210,150 250,120 C 276,100 292,150 312,178" className="stroke-amber-500" strokeWidth="2.5" strokeLinecap="round" />
      {/* the crash / turning point */}
      <circle cx="312" cy="178" r="5" className="fill-rose-500" />
      <text x="312" y="204" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="11">the crash · turning point</text>
      {/* deployment phase — the golden age climb */}
      <path d="M312,178 C 380,168 430,110 596,54" className="stroke-emerald-500" strokeWidth="2.5" strokeLinecap="round" />

      {/* phase labels */}
      <text x="150" y="70" className="fill-amber-600 dark:fill-amber-400" fontSize="13" fontWeight="600">Installation</text>
      <text x="150" y="88" className="fill-zinc-400" fontSize="11">finance leads · bubbles inflate</text>
      <text x="592" y="40" textAnchor="end" className="fill-emerald-600 dark:fill-emerald-400" fontSize="13" fontWeight="600">Deployment</text>
      <text x="592" y="58" textAnchor="end" className="fill-zinc-400" fontSize="11">production leads · the golden age</text>

      {/* you are here */}
      <circle cx="356" cy="164" r="4" className="fill-blue-500" />
      <text x="366" y="150" className="fill-blue-600 dark:fill-blue-400" fontSize="11" fontStyle="italic">roughly here</text>

      {/* surges footnote */}
      <text x="320" y="292" textAnchor="middle" className="fill-zinc-400" fontSize="10">canals → railways → steel → oil &amp; the car → information &amp; AI</text>
    </svg>
  );
}

/* ── The adjacent possible: combinations open new frontiers ──────────────── */
function AdjacentPossible() {
  const have: Array<[number, number]> = [
    [70, 90], [110, 150], [78, 200], [150, 110], [140, 190],
  ];
  const made: Array<[number, number]> = [
    [300, 96], [320, 168], [290, 210],
  ];
  const combos: Array<[number, number, number, number]> = [
    [70, 90, 300, 96], [150, 110, 300, 96], [140, 190, 320, 168], [110, 150, 320, 168], [78, 200, 290, 210],
  ];
  const frontier: Array<[number, number]> = [
    [500, 70], [540, 120], [520, 176], [498, 224], [560, 200],
  ];
  return (
    <svg viewBox="0 0 640 270" className="w-full h-auto" fill="none" role="img">
      <text x="70" y="46" className="fill-zinc-500 dark:fill-zinc-400" fontSize="12" fontWeight="600">what exists</text>
      <text x="70" y="62" className="fill-zinc-400" fontSize="10">the pieces you already have</text>
      {combos.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1" />
      ))}
      {have.map(([x, y], i) => (
        <circle key={`h${i}`} cx={x} cy={y} r="5" className="fill-blue-500" />
      ))}
      <text x="300" y="52" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="600">new combinations</text>
      {made.map(([x, y], i) => (
        <circle key={`m${i}`} cx={x} cy={y} r="5.5" className="fill-emerald-500" />
      ))}
      {/* frontier arrows */}
      {made.map(([x, y], i) => (
        <line key={`f${i}`} x1={x} y1={y} x2={frontier[i][0] - 14} y2={frontier[i][1]} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1" strokeDasharray="3 5" />
      ))}
      <text x="560" y="46" textAnchor="end" className="fill-violet-600 dark:fill-violet-400" fontSize="12" fontWeight="600">the adjacent possible</text>
      <text x="560" y="62" textAnchor="end" className="fill-zinc-400" fontSize="10">reachable next — for anyone standing here</text>
      {frontier.map(([x, y], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r="5" className="stroke-violet-400 dark:stroke-violet-500" strokeWidth="1.5" strokeDasharray="2 3" />
      ))}
    </svg>
  );
}

/* ── The collective brain: sparse & slow → dense & instant ───────────────── */
function CollectiveBrain() {
  const left: Array<[number, number]> = [
    [70, 80], [140, 60], [110, 140], [60, 190], [150, 200], [200, 120], [95, 110],
  ];
  const leftLinks: Array<[number, number]> = [[0, 6], [6, 2], [2, 3], [1, 5]];
  const right: Array<[number, number]> = [
    [400, 70], [470, 55], [540, 80], [580, 140], [540, 200], [470, 215], [405, 190], [385, 130],
    [500, 120], [450, 150], [520, 165], [430, 100],
  ];
  return (
    <svg viewBox="0 0 640 260" className="w-full h-auto" fill="none" role="img">
      <line x1="320" y1="24" x2="320" y2="236" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="3 6" />

      {/* left — sparse */}
      <text x="60" y="34" className="fill-zinc-500 dark:fill-zinc-400" fontSize="12" fontWeight="600">printing-press era</text>
      <text x="60" y="50" className="fill-zinc-400" fontSize="10">few minds, few links — ideas crawl</text>
      {leftLinks.map(([a, b], i) => (
        <line key={i} x1={left[a][0]} y1={left[a][1]} x2={left[b][0]} y2={left[b][1]} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1" />
      ))}
      {left.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" className={i === 0 ? "fill-amber-500" : "fill-zinc-300 dark:fill-zinc-600"} />
      ))}

      {/* right — dense */}
      <text x="580" y="34" textAnchor="end" className="fill-zinc-500 dark:fill-zinc-400" fontSize="12" fontWeight="600">networked now</text>
      <text x="580" y="50" textAnchor="end" className="fill-zinc-400" fontSize="10">many minds, dense links — ideas arrive at once</text>
      {right.map((_, i) =>
        right.slice(i + 1).map(([x2, y2], j) => {
          const [x1, y1] = right[i];
          const near = Math.hypot(x2 - x1, y2 - y1) < 90;
          return near ? (
            <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-emerald-400/30 dark:stroke-emerald-500/25" strokeWidth="0.75" />
          ) : null;
        })
      )}
      {right.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" className="fill-emerald-500" />
      ))}
    </svg>
  );
}

/* ── The broker: out-of-the-box is often a network position ──────────────── */
function TheBroker() {
  // Two tidy 5-node "worlds" (convex pentagons — no crossing links), a broker
  // above the gap, and two short clean bridges to each world's nearest node.
  const left: Array<[number, number]> = [
    [150, 105], [193, 136], [176, 186], [124, 186], [107, 136],
  ];
  const right: Array<[number, number]> = [
    [490, 105], [533, 136], [516, 186], [464, 186], [447, 136],
  ];
  const ring: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]];
  const broker: [number, number] = [320, 108];
  return (
    <svg viewBox="0 0 640 250" className="w-full h-auto" fill="none" role="img">
      {/* world links */}
      {ring.map(([a, b], i) => (
        <line key={`la${i}`} x1={left[a][0]} y1={left[a][1]} x2={left[b][0]} y2={left[b][1]} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1" />
      ))}
      {ring.map(([a, b], i) => (
        <line key={`lb${i}`} x1={right[a][0]} y1={right[a][1]} x2={right[b][0]} y2={right[b][1]} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1" />
      ))}

      {/* the bridge across the gap — short, clear of all text */}
      <line x1={broker[0]} y1={broker[1]} x2={left[1][0]} y2={left[1][1]} className="stroke-amber-400" strokeWidth="1.75" strokeDasharray="4 4" />
      <line x1={broker[0]} y1={broker[1]} x2={right[4][0]} y2={right[4][1]} className="stroke-amber-400" strokeWidth="1.75" strokeDasharray="4 4" />

      {/* world nodes */}
      {left.map(([x, y], i) => (
        <circle key={`a${i}`} cx={x} cy={y} r="5" className="fill-blue-500/85" />
      ))}
      {right.map(([x, y], i) => (
        <circle key={`b${i}`} cx={x} cy={y} r="5" className="fill-emerald-500/85" />
      ))}

      {/* broker */}
      <circle cx={broker[0]} cy={broker[1]} r="8" className="fill-amber-500" />
      <text x={broker[0]} y="88" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="12" fontWeight="600">the broker</text>

      {/* labels — all clear of the lines */}
      <text x="320" y="178" textAnchor="middle" className="fill-zinc-400" fontSize="11" fontStyle="italic">sees what neither world can</text>
      <text x="150" y="230" textAnchor="middle" className="fill-zinc-400" fontSize="11">world A</text>
      <text x="490" y="230" textAnchor="middle" className="fill-zinc-400" fontSize="11">world B</text>
    </svg>
  );
}

/* ── Meru-prastāra: the binomial triangle from prosody (= Pascal's) ──────── */
function MeruPrastara() {
  const rows = 7;
  const tri: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let k = 0; k <= r; k++) {
      row.push(k === 0 || k === r ? 1 : tri[r - 1][k - 1] + tri[r - 1][k]);
    }
    tri.push(row);
  }
  const cx = 320;
  const dx = 46;
  const dy = 30;
  const y0 = 40;
  return (
    <svg viewBox="0 0 640 268" className="w-full h-auto" fill="none" role="img">
      {tri.map((row, r) =>
        row.map((v, k) => {
          const x = cx + (k - r / 2) * dx;
          const y = y0 + r * dy;
          const edge = k === 0 || k === r;
          return (
            <text
              key={`${r}-${k}`}
              x={x}
              y={y}
              textAnchor="middle"
              className={edge ? "fill-amber-600 dark:fill-amber-400" : "fill-zinc-500 dark:fill-zinc-300"}
              fontSize="13"
              fontWeight={edge ? "700" : "500"}
            >
              {v}
            </text>
          );
        })
      )}
      <text x="320" y="258" textAnchor="middle" className="fill-zinc-400" fontSize="11" fontStyle="italic">
        row n, place k = number of metres with exactly k heavy syllables = C(n, k)
      </text>
    </svg>
  );
}

/* ── One idea, many names: found early in India, named later in Europe ───── */
function OneIdeaManyNames() {
  const tracks = [
    { y: 60, idea: "Binary numbers", origin: "Piṅgala · ~2nd c. BCE", named: "Leibniz 1703 · Shannon's \"bit\" 1948", ox: 150, nx: 520 },
    { y: 130, idea: "Fibonacci sequence", origin: "Piṅgala → Virahāṅka · to ~700 CE", named: "Fibonacci · 1202", ox: 150, nx: 430 },
    { y: 200, idea: "Pascal's triangle", origin: "Piṅgala → Halāyudha · ~950 CE", named: "Pascal · 1654", ox: 260, nx: 470 },
  ];
  return (
    <svg viewBox="0 0 640 250" className="w-full h-auto" fill="none" role="img">
      {tracks.map((t, i) => (
        <g key={i}>
          <text x="20" y={t.y - 14} className="fill-zinc-700 dark:fill-zinc-200" fontSize="12" fontWeight="600">{t.idea}</text>
          <line x1={t.ox} y1={t.y} x2={t.nx} y2={t.y} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1.25" strokeDasharray="4 5" />
          <circle cx={t.ox} cy={t.y} r="5.5" className="fill-amber-500" />
          <text x={t.ox} y={t.y + 20} textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="10">{t.origin}</text>
          <circle cx={t.nx} cy={t.y} r="5.5" className="fill-blue-500" />
          <text x={t.nx} y={t.y + 20} textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="10">{t.named}</text>
        </g>
      ))}
      <text x="320" y="238" textAnchor="middle" className="fill-zinc-400" fontSize="11" fontStyle="italic">● found first, in verse &nbsp;·&nbsp; ● named later, and remembered</text>
    </svg>
  );
}

/* ── A derivation: the grammar "runs" to build a word ────────────────────── */
function DerivationTrace() {
  const steps = [
    { form: "rāma + su", note: "start: stem + nominative-singular affix" },
    { form: "rāma + s", note: "the 'u' is a silent marker (it) — strip it" },
    { form: "rāmaḥ", note: "word-final s before a pause → visarga ḥ" },
  ];
  return (
    <svg viewBox="0 0 640 232" className="w-full h-auto" fill="none" role="img">
      {steps.map((s, i) => {
        const y = 44 + i * 62;
        return (
          <g key={i}>
            <rect x="150" y={y - 22} width="200" height="40" rx="8" className="fill-blue-500/10 stroke-blue-500/50" strokeWidth="1.25" />
            <text x="250" y={y + 3} textAnchor="middle" className="fill-zinc-800 dark:fill-zinc-100" fontSize="15" fontWeight="600">{s.form}</text>
            <text x="372" y={y + 3} className="fill-zinc-500 dark:fill-zinc-400" fontSize="11">{s.note}</text>
            {i < steps.length - 1 && (
              <>
                <line x1="250" y1={y + 18} x2="250" y2={y + 40} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
                <path d={`M250,${y + 40} l-4,-8 l8,0 z`} className="fill-zinc-400 dark:fill-zinc-500" />
              </>
            )}
          </g>
        );
      })}
      <text x="250" y="216" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="600">output: &ldquo;Rāma&rdquo; (as the subject)</text>
    </svg>
  );
}

/* ── The generative lineage: one idea, re-found and formalised ───────────── */
function GenerativeLineage() {
  const nodes = [
    { x: 70, label: "Pāṇini", sub: "~500 BCE", color: "fill-amber-500", tcol: "fill-amber-600 dark:fill-amber-400" },
    { x: 250, label: "Chomsky", sub: "1957 · generative grammar", color: "fill-blue-500", tcol: "fill-blue-600 dark:fill-blue-400" },
    { x: 400, label: "Backus–Naur", sub: "1959 · BNF for languages", color: "fill-blue-500", tcol: "fill-blue-600 dark:fill-blue-400" },
    { x: 560, label: "Compilers · NLP · LLMs", sub: "today", color: "fill-emerald-500", tcol: "fill-emerald-600 dark:fill-emerald-400" },
  ];
  return (
    <svg viewBox="0 0 640 150" className="w-full h-auto" fill="none" role="img">
      <line x1="70" y1="70" x2="560" y2="70" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      <line x1="70" y1="70" x2="250" y2="70" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" strokeDasharray="4 6" />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy="70" r="6" className={n.color} />
          <text x={n.x} y="52" textAnchor="middle" className={n.tcol} fontSize="12" fontWeight="600">{n.label}</text>
          <text x={n.x} y="92" textAnchor="middle" className="fill-zinc-400" fontSize="10">{n.sub}</text>
        </g>
      ))}
      <text x="160" y="126" textAnchor="middle" className="fill-zinc-400" fontSize="11" fontStyle="italic">a finite set of rules that generates an infinite language</text>
    </svg>
  );
}

/* ── An idea's genealogy: neural nets, through two winters ───────────────── */
function IdeaGenealogy() {
  const nodes = [
    { x: 60, label: "gradient descent", sub: "Cauchy · 1847", color: "fill-zinc-400" },
    { x: 190, label: "backprop", sub: "Werbos '74 · RHW '86", color: "fill-blue-500" },
    { x: 380, label: "AlexNet", sub: "ImageNet · 2012", color: "fill-emerald-500" },
    { x: 540, label: "modern AI", sub: "LLMs · today", color: "fill-emerald-500" },
  ];
  return (
    <svg viewBox="0 0 640 170" className="w-full h-auto" fill="none" role="img">
      {/* two AI winters as shaded gaps */}
      <rect x="118" y="40" width="60" height="60" className="fill-zinc-400/10" />
      <rect x="230" y="40" width="140" height="60" className="fill-zinc-400/10" />
      <text x="300" y="34" textAnchor="middle" className="fill-zinc-400" fontSize="10" fontStyle="italic">the AI winters — when almost everyone quit</text>

      <line x1="60" y1="70" x2="540" y2="70" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy="70" r="6" className={n.color} />
          <text x={n.x} y="58" textAnchor="middle" className="fill-zinc-700 dark:fill-zinc-200" fontSize="11" fontWeight="600">{n.label}</text>
          <text x={n.x} y="90" textAnchor="middle" className="fill-zinc-400" fontSize="9.5">{n.sub}</text>
        </g>
      ))}
      <text x="320" y="140" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="11" fontStyle="italic">~165 years from the maths to the moment — someone kept the flame through every winter</text>
    </svg>
  );
}

/* ── Persistence: attempts before the breakthrough ───────────────────────── */
function PersistenceBars() {
  const bars = [
    { label: "Dyson — vacuum prototypes", value: 5127, disp: "5,127", w: 520 },
    { label: "Edison — filament materials tried", value: 1600, disp: "~1,600", w: 300 },
    { label: "Wrights — wing shapes wind-tested", value: 200, disp: "~200", w: 130 },
    { label: "Hinton — years before vindication", value: 30, disp: "~30 yrs", w: 70 },
  ];
  return (
    <svg viewBox="0 0 640 200" className="w-full h-auto" fill="none" role="img">
      {bars.map((b, i) => {
        const y = 30 + i * 42;
        return (
          <g key={i}>
            <text x="16" y={y - 6} className="fill-zinc-500 dark:fill-zinc-400" fontSize="11">{b.label}</text>
            <rect x="16" y={y} width={b.w} height="16" rx="4" className="fill-amber-500/80" />
            <text x={b.w + 26} y={y + 13} className="fill-zinc-700 dark:fill-zinc-200" fontSize="12" fontWeight="700">{b.disp}</text>
          </g>
        );
      })}
      <text x="16" y="196" className="fill-zinc-400" fontSize="10" fontStyle="italic">Figures are the inventors' own widely-cited counts — the point is the order of magnitude, not the decimal.</text>
    </svg>
  );
}

/* ── How the credit travelled (and got renamed) ─────────────────────────── */
function CreditFlow() {
  const stops = [
    { x: 80, label: "India", sub: "origin", note: "numerals · zero · sine · series", color: "fill-emerald-500", tcol: "fill-emerald-600 dark:fill-emerald-400" },
    { x: 270, label: "Baghdad", sub: "transmits", note: "credited as 'Indian'", color: "fill-blue-500", tcol: "fill-blue-600 dark:fill-blue-400" },
    { x: 450, label: "Europe", sub: "renames", note: "'Arabic numerals'", color: "fill-amber-500", tcol: "fill-amber-600 dark:fill-amber-400" },
    { x: 590, label: "the world", sub: "inherits", note: "source forgotten", color: "fill-zinc-400", tcol: "fill-zinc-500 dark:fill-zinc-400" },
  ];
  return (
    <svg viewBox="0 0 640 150" className="w-full h-auto" fill="none" role="img">
      <line x1="80" y1="66" x2="590" y2="66" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      {stops.slice(0, -1).map((s, i) => (
        <path key={i} d={`M${s.x + 14},66 L${stops[i + 1].x - 14},66`} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" markerEnd="" />
      ))}
      {stops.map((s, i) => (
        <path key={`a${i}`} d={i > 0 ? `M${s.x - 14},66 l-8,-4 l0,8 z` : ""} className="fill-zinc-400 dark:fill-zinc-500" />
      ))}
      {stops.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy="66" r="7" className={s.color} />
          <text x={s.x} y="46" textAnchor="middle" className={s.tcol} fontSize="12" fontWeight="600">{s.label}</text>
          <text x={s.x} y="88" textAnchor="middle" className="fill-zinc-400" fontSize="10">{s.sub}</text>
          <text x={s.x} y="104" textAnchor="middle" className="fill-zinc-400" fontSize="9">{s.note}</text>
        </g>
      ))}
      <text x="320" y="138" textAnchor="middle" className="fill-zinc-400" fontSize="11" fontStyle="italic">the mathematics kept moving; the credit fell off somewhere over the Mediterranean</text>
    </svg>
  );
}

/* ── The Royal Game of Ur board (the 20-square rosette layout) ───────────── */
function UrBoard() {
  // Which columns exist in the top/bottom rows (middle row is the full bridge).
  const outer = [0, 1, 2, 3, 6, 7];
  const rosettes = new Set(["0-0", "0-3", "1-3", "0-6", "0-7"].flatMap((s) => {
    const [r, c] = s.split("-").map(Number);
    // mirror the rosette pattern to top and bottom rows where sensible
    return [`${r}-${c}`, `2-${c}`];
  }));
  const cell = 46;
  const gap = 6;
  const x0 = 120;
  const y0 = 40;
  const items: { r: number; c: number }[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if (r === 1 || outer.includes(c)) items.push({ r, c });
    }
  }
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto" fill="none" role="img">
      {items.map(({ r, c }) => {
        const x = x0 + c * (cell + gap);
        const y = y0 + r * (cell + gap);
        const rosette = rosettes.has(`${r}-${c}`) && (c === 0 || c === 3 || c === 6 || c === 7);
        return (
          <g key={`${r}-${c}`}>
            <rect x={x} y={y} width={cell} height={cell} rx="7" className={rosette ? "fill-amber-500/15 stroke-amber-500/60" : "fill-zinc-100 dark:fill-zinc-800 stroke-zinc-300 dark:stroke-zinc-700"} strokeWidth="1.5" />
            {rosette && (
              <text x={x + cell / 2} y={y + cell / 2 + 6} textAnchor="middle" className="fill-amber-500" fontSize="18">✦</text>
            )}
          </g>
        );
      })}
      <text x="320" y="206" textAnchor="middle" className="fill-zinc-400" fontSize="11" fontStyle="italic">20 squares · land on a ✦ and roll again</text>
    </svg>
  );
}

/* ── Elastic demand: why cheaper explodes the quantity ──────────────────── */
function ElasticDemand() {
  return (
    <svg viewBox="0 0 640 280" className="w-full h-auto" fill="none" role="img">
      {/* axes */}
      <line x1="70" y1="30" x2="70" y2="240" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
      <line x1="70" y1="240" x2="600" y2="240" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
      <text x="60" y="34" textAnchor="end" className="fill-zinc-400" fontSize="11">price</text>
      <text x="596" y="262" textAnchor="end" className="fill-zinc-400" fontSize="11">quantity used →</text>

      {/* two price levels */}
      <line x1="70" y1="80" x2="600" y2="80" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="3 5" />
      <line x1="70" y1="200" x2="600" y2="200" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="3 5" />
      <text x="64" y="84" textAnchor="end" className="fill-zinc-400" fontSize="10">dear</text>
      <text x="64" y="204" textAnchor="end" className="fill-zinc-400" fontSize="10">cheap</text>

      {/* inelastic demand — steep (salt) */}
      <path d="M150,40 L200,250" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="2.5" />
      <text x="150" y="34" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" fontWeight="600">salt</text>
      <circle cx="164" cy="80" r="4" className="fill-zinc-500" />
      <circle cx="192" cy="200" r="4" className="fill-zinc-500" />
      <text x="220" y="150" className="fill-zinc-400" fontSize="10">inelastic — barely moves</text>

      {/* elastic demand — flat (light / compute / intelligence) */}
      <path d="M120,70 C 260,90 420,190 590,210" className="stroke-emerald-500" strokeWidth="2.5" />
      <circle cx="150" cy="80" r="4.5" className="fill-emerald-500" />
      <circle cx="520" cy="200" r="4.5" className="fill-emerald-500" />
      <text x="470" y="150" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="600">light · computing · intelligence</text>
      <text x="470" y="166" textAnchor="middle" className="fill-zinc-400" fontSize="10">elastic — quantity explodes</text>

      {/* the price drop arrow */}
      <path d="M96,86 L96,194" className="stroke-blue-500" strokeWidth="1.5" />
      <path d="M96,194 l-4,-9 l8,0 z" className="fill-blue-500" />
      <text x="104" y="150" className="fill-blue-600 dark:fill-blue-400" fontSize="10">price falls</text>
    </svg>
  );
}

/* ── Climate & society: extremes hurt, the temperate middle helps ────────── */
function ClimateHistory() {
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto" fill="none" role="img">
      <line x1="40" y1="120" x2="600" y2="120" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1" strokeDasharray="4 6" />
      <text x="40" y="138" className="fill-zinc-400" fontSize="10">← colder</text>
      <text x="600" y="138" textAnchor="end" className="fill-zinc-400" fontSize="10">time →</text>

      {/* a temperature-ish wiggle across the eras */}
      <path d="M60,150 C 130,70 180,72 240,150 C 300,220 360,215 420,120 C 470,50 540,44 596,60" className="stroke-blue-500" strokeWidth="2.5" strokeLinecap="round" />

      {/* era markers */}
      <g>
        <circle cx="150" cy="76" r="4" className="fill-emerald-500" />
        <text x="150" y="58" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="11" fontWeight="600">Medieval warm</text>
        <text x="150" y="196" textAnchor="middle" className="fill-zinc-400" fontSize="9">farms &amp; cathedrals spread</text>
      </g>
      <g>
        <circle cx="270" cy="196" r="4" className="fill-rose-500" />
        <text x="270" y="212" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="11" fontWeight="600">Little Ice Age</text>
        <text x="270" y="88" textAnchor="middle" className="fill-zinc-400" fontSize="9">famine, war, the 17th-c. crisis</text>
      </g>
      <g>
        <circle cx="430" cy="118" r="4" className="fill-zinc-500" />
        <text x="430" y="100" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-300" fontSize="11" fontWeight="600">Industrial era</text>
        <text x="430" y="196" textAnchor="middle" className="fill-zinc-400" fontSize="9">heating makes cold livable</text>
      </g>
      <g>
        <circle cx="580" cy="56" r="4" className="fill-amber-500" />
        <text x="576" y="38" textAnchor="end" className="fill-amber-600 dark:fill-amber-400" fontSize="11" fontWeight="600">now — warming</text>
      </g>
    </svg>
  );
}

/* ── The air-conditioning paradox: a cooling loop that warms ─────────────── */
function ACParadox() {
  const cx = 320;
  const cy = 118;
  const r = 66;
  const nodes = [
    { a: -90, label: "It's hot", color: "fill-amber-500" },
    { a: 0, label: "Turn on AC", color: "fill-blue-500" },
    { a: 90, label: "More energy burned", color: "fill-zinc-500" },
    { a: 180, label: "More emissions & waste heat", color: "fill-rose-500" },
  ];
  const pos = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  return (
    <svg viewBox="0 0 640 236" className="w-full h-auto" fill="none" role="img">
      <circle cx={cx} cy={cy} r={r} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1.5" strokeDasharray="4 6" />
      {/* arrows around the loop */}
      {[-45, 45, 135, 225].map((a, i) => {
        const [x, y] = pos(a);
        return <text key={i} x={x} y={y + 4} textAnchor="middle" className="fill-zinc-400" fontSize="14">↻</text>;
      })}
      {nodes.map((n, i) => {
        const [x, y] = pos(n.a);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="6" className={n.color} />
            <text x={x} y={n.a === 90 ? y + 20 : n.a === -90 ? y - 12 : y - 12} textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-300" fontSize="11" fontWeight="600">{n.label}</text>
          </g>
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" fontWeight="600">the loop</text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-zinc-400" fontSize="9">cooler inside, hotter outside</text>
      <text x="320" y="228" textAnchor="middle" className="fill-zinc-400" fontSize="10" fontStyle="italic">the same Jevons trap: the fix, scaled up, feeds the problem</text>
    </svg>
  );
}

/* ── The recurring arc of a technology panic ─────────────────────────────── */
function PanicArc() {
  return (
    <svg viewBox="0 0 640 240" className="w-full h-auto" fill="none" role="img">
      <line x1="56" y1="200" x2="600" y2="200" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      <text x="56" y="222" className="fill-zinc-400" fontSize="11">time →</text>

      {/* fear — spikes early, then fades */}
      <path d="M70,150 C 130,60 180,60 230,96 C 300,150 430,182 596,188" className="stroke-amber-500" strokeWidth="2.5" strokeLinecap="round" />
      <text x="150" y="48" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="12" fontWeight="600">the fear</text>

      {/* jobs / abundance — dips (real disruption), then climbs well above */}
      <path d="M70,150 C 150,150 200,186 250,184 C 360,180 470,120 596,54" className="stroke-emerald-500" strokeWidth="2.5" strokeLinecap="round" />
      <text x="560" y="46" textAnchor="end" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="600">work &amp; abundance</text>

      {/* the real dip */}
      <circle cx="250" cy="184" r="4.5" className="fill-rose-500" />
      <text x="250" y="205" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="10">real disruption (this part is true)</text>

      {/* beats */}
      <text x="120" y="182" textAnchor="middle" className="fill-zinc-400" fontSize="10">new tool</text>
      <text x="410" y="150" textAnchor="middle" className="fill-zinc-400" fontSize="10">adaptation</text>
    </svg>
  );
}

/* ── The Great Filter: why the sky is quiet ───────────────────────────────── */
function GreatFilter() {
  const filters = [
    { x: 110, label: "Simple life", sub: "abiogenesis" },
    { x: 220, label: "Complex life", sub: "the eukaryote jump" },
    { x: 330, label: "Intelligence", sub: "tool use, language" },
    { x: 440, label: "Civilisation", sub: "surviving itself" },
    { x: 550, label: "Interstellar reach", sub: "the step we haven't seen" },
  ];
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto" fill="none" role="img">
      <line x1="60" y1="110" x2="600" y2="110" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
      <text x="60" y="128" className="fill-zinc-400" fontSize="10">a billion planets start here</text>
      <text x="600" y="128" textAnchor="end" className="fill-zinc-400" fontSize="10">almost none arrive here</text>

      {filters.map((f, i) => (
        <g key={i}>
          <line x1={f.x} y1="94" x2={f.x} y2="126" className="stroke-rose-400/70 dark:stroke-rose-500/60" strokeWidth="2" strokeDasharray="3 4" />
          <circle cx={f.x} cy="110" r="5" className="fill-zinc-500 dark:fill-zinc-400" />
          <text x={f.x} y="78" textAnchor="middle" className="fill-zinc-700 dark:fill-zinc-200" fontSize="11" fontWeight="600">{f.label}</text>
          <text x={f.x} y="60" textAnchor="middle" className="fill-zinc-400" fontSize="9">{f.sub}</text>
        </g>
      ))}

      <text x="320" y="164" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="11" fontStyle="italic">
        each dashed line is a "great filter" — a step almost nothing gets past
      </text>
      <text x="320" y="188" textAnchor="middle" className="fill-zinc-400" fontSize="10">
        the unsettling question: is our hardest filter behind us, or still ahead?
      </text>
    </svg>
  );
}

/* ── "God does not play dice" — and the experiment that answered him ─────── */
function GodsDiceDebate() {
  return (
    <svg viewBox="0 0 640 220" className="w-full h-auto" fill="none" role="img">
      {/* Einstein */}
      <circle cx="130" cy="70" r="7" className="fill-amber-500" />
      <text x="130" y="48" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="13" fontWeight="600">Einstein</text>
      <text x="130" y="64" textAnchor="middle" className="fill-zinc-400" fontSize="10">1935</text>
      <text x="130" y="98" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-300" fontSize="11" fontStyle="italic">"God does not play dice"</text>
      <text x="130" y="114" textAnchor="middle" className="fill-zinc-400" fontSize="10">there must be hidden variables</text>

      {/* Bohr */}
      <circle cx="510" cy="70" r="7" className="fill-blue-500" />
      <text x="510" y="48" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400" fontSize="13" fontWeight="600">Bohr</text>
      <text x="510" y="64" textAnchor="middle" className="fill-zinc-400" fontSize="10">1935</text>
      <text x="510" y="98" textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-300" fontSize="11" fontStyle="italic">the randomness is real</text>
      <text x="510" y="114" textAnchor="middle" className="fill-zinc-400" fontSize="10">there is nothing hidden to find</text>

      <line x1="180" y1="70" x2="460" y2="70" className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1" strokeDasharray="4 5" />
      <text x="320" y="150" textAnchor="middle" className="fill-zinc-400" fontSize="10">a disagreement with no experiment to settle it — for 29 years</text>

      {/* Bell */}
      <line x1="320" y1="160" x2="320" y2="178" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
      <path d="M320,178 l-4,-8 l8,0 z" className="fill-zinc-400 dark:fill-zinc-500" />
      <circle cx="320" cy="196" r="6" className="fill-rose-500" />
      <text x="320" y="216" textAnchor="middle" className="fill-rose-600 dark:fill-rose-400" fontSize="11" fontWeight="600">Bell's theorem, 1964 — testable at last</text>
    </svg>
  );
}

const figures: Record<string, { node: ReactNode; caption: string }> = {
  "gods-dice-debate": {
    node: <GodsDiceDebate />,
    caption:
      "The argument that ran for a generation. In 1935 Einstein, Podolsky and Rosen argued quantum mechanics had to be incomplete — some 'hidden variable' must secretly fix the outcome, we just hadn't found it. Bohr held that the randomness was the whole, final story. For decades it was a matter of taste — a beautiful argument nobody could actually test. John Bell changed that in 1964, showing the two views made different, measurable predictions. Every experiment run since — decades of them, ever more loophole-free, honoured with the 2022 Nobel Prize — has come out on Bohr's side.",
  },
  "great-filter": {
    node: <GreatFilter />,
    caption:
      "The Fermi paradox, plainly stated: the universe is old and vast enough that it should be loud with other civilisations, and it is silent. One candidate answer, the Great Filter, is that somewhere between lifeless chemistry and a civilisation that reaches the stars sits at least one step almost nothing gets past. If it's behind us — the origin of life, say — we got lucky and the sky ahead is genuinely ours. If it's ahead of us, something about the step we're approaching right now (general intelligence, among the candidates) tends to end civilisations before they get any further. Nobody knows which. That is the honest, unsettling shape of the question — not a prediction either way.",
  },
  "climate-history": {
    node: <ClimateHistory />,
    caption:
      "It was never simply 'cold bad, hot good' or the reverse. Europe's Little Ice Age brought famine and the catastrophic crises of the 1600s; the warmer medieval centuries let farms and cathedrals spread. Extremes at either end hurt — and what changed the game was learning to engineer a temperate middle indoors.",
  },
  "ac-paradox": {
    node: <ACParadox />,
    caption:
      "Air conditioning is a genuine lifesaver — and a loop. Cooling one room burns energy and dumps heat and emissions outside, warming the whole, which calls for more cooling. Global cooling demand may triple by mid-century (IEA). The technology that rescues us from the heat can, unmanaged, deepen it.",
  },
  "panic-arc": {
    node: <PanicArc />,
    caption:
      "The shape of nearly every technology panic. Fear spikes early and fades; there is a real dip of disruption for some people (the honest part); and then adaptation carries work and abundance well past where they started. The mistake is reading the dip as the whole story.",
  },
  "elastic-demand": {
    node: <ElasticDemand />,
    caption:
      "The whole trick in one picture. Drop the price of something people barely want more of (salt) and little changes. Drop the price of something with near-limitless uses — light, computing, and now intelligence — and the quantity used detonates. Problems have no ceiling, which is exactly why cheap thinking means far more of it.",
  },
  "ur-board": {
    node: <UrBoard />,
    caption:
      "The Royal Game of Ur — around 4,600 years old, and you could learn it in the time it takes to read this caption. Two players race seven pieces along the track; the flowered squares (✦) are safe spots that grant an extra roll. Humanity's oldest playable board game, and still a good night in.",
  },
  "credit-flow": {
    node: <CreditFlow />,
    caption:
      "The journey of Indian mathematics west — faithfully credited at every step until the last. Arabic scholars called the digits 'Indian'; Europe, inheriting them, called them 'Arabic'. Not a plot, exactly — but a real erosion worth naming and reversing.",
  },
  "idea-genealogy": {
    node: <IdeaGenealogy />,
    caption:
      "One idea's family tree. The maths under modern AI runs from Cauchy's gradient descent (1847) through backpropagation to the 2012 ImageNet moment and today's models — across roughly a century and a half, and two 'AI winters' when the field was abandoned. Progress isn't a spark; it's a relay somebody refuses to drop.",
  },
  "persistence-bars": {
    node: <PersistenceBars />,
    caption:
      "What 'overnight success' actually costs. Breakthroughs sit on top of a mountain of attempts that no one remembers — which is oddly encouraging: the barrier is mostly persistence, and persistence is available to anyone.",
  },
  "derivation-trace": {
    node: <DerivationTrace />,
    caption:
      "A tiny, simplified glimpse of the machine at work: rules fire in order to derive a finished word from a stem and an affix — markers stripped, sound-changes applied. Read it as a program running, because that is essentially what it is.",
  },
  "generative-lineage": {
    node: <GenerativeLineage />,
    caption:
      "The same core idea — a finite rule-system generating an infinite language — appears in Pāṇini, is revived by Chomsky, is turned into Backus–Naur Form to define programming languages, and now underlies compilers, NLP, and the grammar-shaped guts of language models. Re-found, not merely inherited.",
  },
  "meru-prastara": {
    node: <MeruPrastara />,
    caption:
      "The meru-prastāra — the \"staircase of Mount Meru\" — laid out by the commentator Halāyudha around 950 CE to count how many metres have a given number of heavy syllables. It is Pascal's triangle, roughly seven centuries before Pascal.",
  },
  "one-idea-many-names": {
    node: <OneIdeaManyNames />,
    caption:
      "Three ideas that quietly run modern computing, found first in the counting of Sanskrit verse and named centuries later in Europe. Not a conspiracy — the ordinary way credit follows language and print. The honest map of discovery is more crowded, and more global, than the textbooks.",
  },
  "the-broker": {
    node: <TheBroker />,
    caption:
      "Ronald Burt's \"structural holes\": the richest ideas cluster at the gaps between groups that don't talk. Out-of-the-box thinking is often less a personality than a position — standing where two worlds meet and carrying an idea across.",
  },
  "adjacent-possible": {
    node: <AdjacentPossible />,
    caption:
      "Stuart Kauffman's 'adjacent possible': every new idea is a recombination of ones that already exist, and each new piece opens a fresh frontier of things now reachable — by anyone standing in the same place. This is why discoveries cluster, and why they speed up.",
  },
  "collective-brain": {
    node: <CollectiveBrain />,
    caption:
      "The 'collective brain' (Henrich; Muthukrishna) is intelligence held between minds, not inside one. Add more people and, especially, more connections between them, and the same idea reaches everyone almost at once — the difference between the printing press and the feed.",
  },
  "perez-surge": {
    node: <PerezSurge />,
    caption:
      "Carlota Perez's pattern for every great technology: an installation phase where finance inflates a bubble, a crash, then a deployment phase where the technology finally spreads into everyday life — the real golden age. We look to be past the crash, early into deployment.",
  },
  "story-compression": {
    node: <StoryCompression />,
    caption:
      "A narrative is how a human compresses a messy, high-dimensional world into one portable, causal story — a lossy model you can carry and pass on. Knowledge representation, done in prose instead of graphs.",
  },
  "narrative-loop": {
    node: <NarrativeLoop />,
    caption:
      "Narratives don't just describe the economy — they feed back into it. Story shapes belief, belief drives action, action becomes reality, reality seeds the next story. AI now sits in the middle, amplifying every turn.",
  },
  "telco-eras": {
    node: <TelcoEras />,
    caption:
      "Telecom in three acts: a closed, reliable network; then a programmable one you call like any API; and — probably next — an intelligent one that AI can sense and act through.",
  },
  "network-as-api": {
    node: <NetworkAsApi />,
    caption:
      "The quiet revolution: a mobile network's deepest capabilities — location, quality, SIM-swap checks — handed up to any developer as a standard API, no telco degree required.",
  },
  "api-attack-surface": {
    node: <ApiAttackSurface />,
    caption:
      "Give an AI agent API keys and every capability becomes a door. The more doors, the more locks you have to get right — which is why API security is now AI security.",
  },
  "falling-forward": {
    node: <FallingForward />,
    caption:
      "A toddler averages roughly 2,300 steps and 17 falls an hour. We never call it failing — we call it learning to walk. We are born relentless problem-solvers, and then we're slowly taught to stop.",
  },
  "risk-window": {
    node: <RiskWindow />,
    caption:
      "When you're young, a failure costs little and you have decades to absorb it. The asymmetry never tilts more in your favour than it does early — which is exactly when we're told to play it safe.",
  },
  "old-schools": {
    node: <OldSchools />,
    caption:
      "Almost every durable culture built a way to make the young practise risk and problem-solving on purpose — from Polynesian wayfinding to the Stoa's rehearsed hardship.",
  },
  "two-stories": {
    node: <TwoStories />,
    caption: "The same technology, two possible stories. The tools don't choose between them — we do.",
  },
  "the-gap": {
    node: <TheGap />,
    caption: "Intelligence scales with data and compute. Wisdom doesn't. The space between them is the part we have to mind.",
  },
  "two-paths": {
    node: <TwoPaths />,
    caption: "Both routes reach an answer. Only the one that passes through the struggle leaves you with understanding.",
  },
};

export function EssayFigure({ name, caption }: { name: string; caption?: string }) {
  const fig = figures[name];
  if (!fig) return null;
  return <Frame caption={caption ?? fig.caption}>{fig.node}</Frame>;
}

export const essayComponents = {
  EssayFigure,
  NetworkUseCases,
  TelcoEraSlider,
  GuardrailSim,
  NarrativeEpidemic,
  ViralLottery,
  NarrativeGenerator,
  AIFootprint,
  FourTurnings,
  ProgressReceipts,
  HubsCompare,
  MultipleDiscovery,
  SyncField,
  ThinkingToolkit,
  ThinkerTypes,
  LeapsTimeline,
  PrastaraBinary,
  FibonacciRhythms,
  PratyaharaIndex,
  GrammarMachine,
  InventorsGallery,
  InventionLessons,
  OriginLedger,
  AncientGames,
  MachinesVsHumans,
  PriceOfLight,
  ReboundGallery,
  GlobalReshuffle,
  PanicPattern,
  CognitionCurve,
  ClimatePhilosophers,
  InwardOutward,
  IntelligenceLadder,
  CivilizationalShifts,
  SectorImpact,
  ForecastSpread,
  RandomnessTimeline,
  RandomnessSpectrum,
  WillowBenchmark,
  PSHECurve,
  EigenQuestionExplainer,
  EigenQuestionGallery,
  SimulationPractice,
};
