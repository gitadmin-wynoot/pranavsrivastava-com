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

const figures: Record<string, { node: ReactNode; caption: string }> = {
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
