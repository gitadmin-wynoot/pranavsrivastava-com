"use client";

import { useState } from "react";

/*
  PSHECurve — Shishir Mehrotra's PSHE framework (Problem, Solution, How,
  Execution), built at Google in 2011. As scope grows along the S-curve, you
  keep fewer things handed to you and must supply more yourself — until, at
  the top, you're only given the space and have to find the problem.
  SSR-stable, no API.
*/

type Stage = {
  scope: string;
  given: string[];
  supply: string;
  letter: "E" | "H" | "S" | "P";
  desc: string;
};

const STAGES: Stage[] = [
  {
    scope: "Feature",
    given: ["Problem", "Solution", "How"],
    supply: "Execution",
    letter: "E",
    desc: "You're handed a clear spec and a clear plan. The job — a real job, not a lesser one — is making it actually work.",
  },
  {
    scope: "Feature group",
    given: ["Problem", "Solution"],
    supply: "The How",
    letter: "H",
    desc: "The what and why are set. You work out the path — sequencing, trade-offs, the plan nobody handed you.",
  },
  {
    scope: "Product sub-area",
    given: ["Problem", "Solution"],
    supply: "The How",
    letter: "H",
    desc: "Same shape, wider surface — several teams' worth of How now depends on the plan you build.",
  },
  {
    scope: "Multiple sub-areas",
    given: ["Problem"],
    supply: "The Solution and How",
    letter: "S",
    desc: "You're told what needs solving. Deciding what to actually build — and how — is now entirely yours.",
  },
  {
    scope: "Product",
    given: ["Problem"],
    supply: "The Solution and How",
    letter: "S",
    desc: "The problem is real and named. Everything downstream of naming it is your call to make.",
  },
  {
    scope: "Product line",
    given: ["The space"],
    supply: "The Problem itself",
    letter: "P",
    desc: "Nobody hands you a problem anymore. Finding the right one, out of everything you could work on, is the entire job.",
  },
];

const LETTER_STYLE: Record<Stage["letter"], { bg: string; text: string; card: string }> = {
  E: { bg: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", card: "border-blue-500/40 bg-blue-500/5" },
  H: { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", card: "border-emerald-500/40 bg-emerald-500/5" },
  S: { bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", card: "border-amber-500/40 bg-amber-500/5" },
  P: { bg: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", card: "border-rose-500/40 bg-rose-500/5" },
};

export function PSHECurve() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  const style = LETTER_STYLE[s.letter];

  // Simple S-curve path across the plot area, sampled at 6 points to match the stages.
  const points = [
    [40, 200], [140, 188], [240, 150], [340, 90], [440, 55], [540, 40],
  ];
  const path = `M${points.map((p) => p.join(",")).join(" L")}`;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        PSHE — what grows as scope grows
      </div>

      <div className="p-4 sm:p-5">
        <svg viewBox="0 0 600 240" className="w-full h-auto" fill="none" role="img">
          <line x1="30" y1="210" x2="570" y2="210" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
          <line x1="30" y1="20" x2="30" y2="210" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
          <text x="600" y="228" textAnchor="end" className="fill-zinc-400" fontSize="11">scope →</text>
          <text x="14" y="16" textAnchor="start" className="fill-zinc-400" fontSize="11">impact</text>

          <path d={path} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="2" strokeLinecap="round" />

          {points.map(([x, y], idx) => {
            const active = idx === i;
            const st = LETTER_STYLE[STAGES[idx].letter];
            return (
              <g key={idx} onClick={() => setI(idx)} className="cursor-pointer">
                <circle cx={x} cy={y} r={active ? 9 : 6} className={active ? st.bg.replace("bg-", "fill-") : "fill-zinc-300 dark:fill-zinc-600"} />
                {active && <circle cx={x} cy={y} r={14} fill="none" className={st.bg.replace("bg-", "stroke-")} strokeWidth="1.5" opacity="0.4" />}
              </g>
            );
          })}

          {STAGES.map((stg, idx) => (
            <text
              key={idx}
              x={points[idx][0]}
              y="226"
              textAnchor="middle"
              fontSize="9.5"
              className={idx === i ? "fill-zinc-800 dark:fill-zinc-100 font-semibold" : "fill-zinc-400"}
            >
              {stg.scope.split(" ")[0]}
            </text>
          ))}
        </svg>

        <div className={`mt-3 rounded-xl border p-4 ${style.card}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{s.scope}</h4>
            <span className={`font-mono text-xs font-bold ${style.text}`}>you supply: {s.letter}</span>
          </div>
          <p className="mt-2 text-[13px] text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Given to you: </span>
            {s.given.join(", ")}
          </p>
          <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">Yours to supply: </span>
            {s.supply}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{s.desc}</p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          <span className="font-mono">P</span>roblem · <span className="font-mono">S</span>olution · <span className="font-mono">H</span>ow · <span className="font-mono">E</span>xecution — Shishir Mehrotra's framework, built at Google in 2011. Growth, on this reading, isn't doing more. It's being trusted with more of the letters yourself.
        </p>
      </div>
    </figure>
  );
}
