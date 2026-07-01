import type { ReactNode } from "react";
import { NetworkUseCases } from "./network-use-cases";
import { TelcoEraSlider } from "./telco-era-slider";
import { GuardrailSim } from "./guardrail-sim";
import { NarrativeEpidemic, ViralLottery, NarrativeGenerator } from "./narrative-viz";

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

const figures: Record<string, { node: ReactNode; caption: string }> = {
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
};
