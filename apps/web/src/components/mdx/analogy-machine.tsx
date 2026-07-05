"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

/*
  AnalogyMachine — the wow moment of embeddings, made playable. Because every
  word is a point, relationships become *directions* you can add. "man is to
  woman as king is to ___" is solved by taking the man→woman arrow and applying
  it to king — landing on queen. Two parallel arrows; the answer falls out of
  the geometry. Pick words and watch it happen.
*/

type Word = { id: string; label: string; x: number; y: number };

const WORDS: Word[] = [
  { id: "man", label: "man", x: 26, y: 70 },
  { id: "woman", label: "woman", x: 74, y: 70 },
  { id: "king", label: "king", x: 26, y: 28 },
  { id: "queen", label: "queen", x: 74, y: 28 },
  { id: "prince", label: "prince", x: 26, y: 49 },
  { id: "princess", label: "princess", x: 74, y: 49 },
];

const PRESETS: [string, string, string][] = [
  ["man", "woman", "king"],
  ["man", "woman", "prince"],
  ["king", "queen", "prince"],
  ["woman", "man", "queen"],
];

const VW = 420;
const VH = 300;
const toX = (px: number) => 24 + (px / 100) * (VW - 48);
const toY = (py: number) => 24 + (py / 100) * (VH - 48);

function coord(id: string) {
  return WORDS.find((w) => w.id === id)!;
}

export function AnalogyMachine() {
  const [a, setA] = useState("man");
  const [b, setB] = useState("woman");
  const [c, setC] = useState("king");

  const { rx, ry, answer } = useMemo(() => {
    const A = coord(a);
    const B = coord(b);
    const C = coord(c);
    const rx = C.x + (B.x - A.x); // answer = C + (B − A)
    const ry = C.y + (B.y - A.y);
    let best = WORDS[0];
    let bestD = Infinity;
    for (const w of WORDS) {
      if (w.id === a || w.id === b || w.id === c) continue;
      const d = Math.hypot(w.x - rx, w.y - ry);
      if (d < bestD) {
        bestD = d;
        best = w;
      }
    }
    return { rx, ry, answer: best };
  }, [a, b, c]);

  const A = coord(a);
  const B = coord(b);
  const C = coord(c);

  const Picker = ({ value, set }: { value: string; set: (v: string) => void }) => (
    <select
      value={value}
      onChange={(e) => set(e.target.value)}
      className="rounded-md border border-zinc-300 bg-white px-1.5 py-0.5 text-sm font-medium text-zinc-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
    >
      {WORDS.map((w) => (
        <option key={w.id} value={w.id}>{w.label}</option>
      ))}
    </select>
  );

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Doing maths on meaning — build an analogy
      </div>

      <div className="p-4 sm:p-5">
        {/* the sentence */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-300">
          <Picker value={a} set={setA} /> is to <Picker value={b} set={setB} /> as{" "}
          <Picker value={c} set={setC} /> is to
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" /> {answer.label}
          </span>
        </div>

        {/* presets */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {PRESETS.map(([pa, pb, pc]) => (
            <button
              key={`${pa}-${pb}-${pc}`}
              onClick={() => { setA(pa); setB(pb); setC(pc); }}
              className="rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] text-zinc-500 hover:border-blue-500/40 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors"
            >
              {coord(pa).label} → {coord(pb).label}, {coord(pc).label} → ?
            </button>
          ))}
        </div>

        {/* the map */}
        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-auto">
          <defs>
            <marker id="am-ref" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="fill-amber-500" />
            </marker>
            <marker id="am-app" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="fill-emerald-500" />
            </marker>
          </defs>

          {/* reference arrow A → B */}
          <line x1={toX(A.x)} y1={toY(A.y)} x2={toX(B.x)} y2={toY(B.y)} className="stroke-amber-500" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#am-ref)" />
          {/* applied arrow C → answer point */}
          <line x1={toX(C.x)} y1={toY(C.y)} x2={toX(rx)} y2={toY(ry)} className="stroke-emerald-500" strokeWidth="2.5" markerEnd="url(#am-app)" />

          {/* landed point */}
          <circle cx={toX(rx)} cy={toY(ry)} r="9" className="fill-emerald-500/15" />

          {/* words */}
          {WORDS.map((w) => {
            const isAns = w.id === answer.id;
            const involved = [a, b, c].includes(w.id);
            return (
              <g key={w.id}>
                <circle cx={toX(w.x)} cy={toY(w.y)} r={isAns ? 6 : 5} className={isAns ? "fill-emerald-500" : involved ? "fill-zinc-500 dark:fill-zinc-300" : "fill-zinc-300 dark:fill-zinc-600"} />
                <text x={toX(w.x)} y={toY(w.y) - 11} textAnchor="middle" fontSize="13" fontWeight={isAns || involved ? 600 : 400} className={isAns ? "fill-emerald-600 dark:fill-emerald-400" : "fill-zinc-500 dark:fill-zinc-400"}>
                  {w.label}
                </text>
              </g>
            );
          })}
        </svg>

        <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          The <span className="font-semibold text-amber-600 dark:text-amber-400">amber arrow</span> is the relationship
          ({coord(a).label} → {coord(b).label}). Apply the <em>same</em> arrow to{" "}
          <span className="font-semibold">{coord(c).label}</span> — the{" "}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">green arrow</span> — and you land on{" "}
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{answer.label}</span>. Nobody taught the model that. It falls out of the geometry.
        </p>
      </div>
    </figure>
  );
}
