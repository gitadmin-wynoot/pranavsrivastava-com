"use client";

import { useState } from "react";

/*
  CognitionCurve — how mental performance tracks temperature. Peaks around
  ~22°C and falls off as it gets hot (steeply past ~26°C) and, more gently, when
  it's cold. The shape is drawn from office-productivity work (Seppänen, Fisk &
  Lei) and heat-cognition studies (Cedeño Laurent et al.; Park et al.). Figures
  are illustrative of the well-established shape, not a precise law. SSR-stable.
*/

const PEAK = 22;

function perf(t: number): number {
  let p: number;
  if (t <= PEAK) p = 100 - (PEAK - t) * 1.1;
  else if (t <= 26) p = 100 - (t - PEAK) * 1.6;
  else p = 100 - (26 - PEAK) * 1.6 - (t - 26) * 3.0;
  return Math.max(45, Math.min(100, p));
}

const T_MIN = 12;
const T_MAX = 42;
const X0 = 64;
const X1 = 600;
const Y0 = 44; // perf 100
const Y1 = 214; // perf 50
const px = (t: number) => X0 + ((t - T_MIN) / (T_MAX - T_MIN)) * (X1 - X0);
const py = (p: number) => Y0 + ((100 - p) / (100 - 50)) * (Y1 - Y0);

function note(t: number): string {
  if (t < 20) return "a touch cool — the mind stays sharp";
  if (t <= 24) return "the sweet spot: focus, patience, curiosity come easily";
  if (t <= 28) return "the edge — attention starts to fray, mistakes creep in";
  if (t <= 33) return "foggy: measurably slower, and you can feel the 'naah, enough'";
  return "the body is fighting the heat now, not thinking";
}

export function CognitionCurve() {
  const [t, setT] = useState(30);
  const p = perf(t);

  const pts: string[] = [];
  for (let x = T_MIN; x <= T_MAX; x += 1) pts.push(`${px(x)},${py(perf(x))}`);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The temperature of thought — move the slider
      </div>

      <div className="p-4 sm:p-5">
        <svg viewBox="0 0 640 240" className="w-full h-auto" fill="none" role="img">
          {/* optimal band */}
          <rect x={px(20)} y="30" width={px(24) - px(20)} height="196" className="fill-emerald-500/10" />
          <text x={(px(20) + px(24)) / 2} y="24" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">~20–24°C</text>

          {/* axes */}
          <line x1={X0} y1="226" x2={X1} y2="226" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
          {[15, 20, 25, 30, 35, 40].map((tick) => (
            <text key={tick} x={px(tick)} y="240" textAnchor="middle" className="fill-zinc-400" fontSize="10">{tick}°</text>
          ))}

          {/* curve */}
          <polyline points={pts.join(" ")} className="stroke-blue-500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* marker */}
          <line x1={px(t)} y1={py(p)} x2={px(t)} y2="226" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx={px(t)} cy={py(p)} r="6" className="fill-blue-500" />
        </svg>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 shrink-0">temperature</span>
          <input
            type="range"
            min={T_MIN}
            max={T_MAX}
            step={1}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            className="flex-1 cursor-pointer accent-blue-500"
            aria-label="Temperature"
          />
          <span className="w-32 shrink-0 text-right text-[12px] text-zinc-500 dark:text-zinc-400 tabular-nums">
            {t}°C · <span className="font-semibold text-zinc-800 dark:text-zinc-100">{Math.round(p)}%</span>
          </span>
        </div>

        <p className="mt-2 text-[13px] text-zinc-600 dark:text-zinc-300">{note(t)}</p>

        <p className="mt-2 text-[11px] text-zinc-400">
          Illustrative of a well-documented shape: mental performance tends to peak around 22°C and drop off sharply in sustained heat (studies put the fall on the order of a few percent per degree past the mid-20s). Cold hurts too — just more gently, and we solved it with a jumper.
        </p>
      </div>
    </figure>
  );
}
