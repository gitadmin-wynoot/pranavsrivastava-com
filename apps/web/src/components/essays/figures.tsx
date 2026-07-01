import type { ReactNode } from "react";

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

const figures: Record<string, { node: ReactNode; caption: string }> = {
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

export const essayComponents = { EssayFigure };
