"use client";

import { useState } from "react";

/*
  ConfidenceRouter — 300 simulated tickets. Jev states a confidence for each;
  you pick the line above which nobody double-checks. SIMULATION: the data is
  generated, and the "overconfident" mode mimics the direction independent
  tests reported for choice answers. It is not Jev output.
*/

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const ITEMS = (() => {
  const r = rng(11);
  return Array.from({ length: 300 }, () => {
    const p = 0.5 + 0.5 * Math.pow(r(), 0.45); // stated confidence, skewed high
    return { p, u: r() };
  });
})();

export function ConfidenceRouter() {
  const [t, setT] = useState(0.9);
  const [over, setOver] = useState(true);

  const rows = ITEMS.map((x) => {
    const acc = over ? Math.max(0.35, x.p - 0.17) : x.p; // real accuracy given stated p
    return { ...x, ok: x.u < acc };
  });
  const auto = rows.filter((x) => x.p >= t);
  const wrongAuto = auto.filter((x) => !x.ok).length;
  const escal = rows.length - auto.length;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Where do you draw the &ldquo;no one checks this&rdquo; line? (simulation)
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setOver(true)} className={`rounded-full border px-2.5 py-1 text-[11px] ${over ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300" : "border-zinc-200 dark:border-zinc-700 text-zinc-500"}`}>Overconfident model (what tests found on choice answers)</button>
          <button onClick={() => setOver(false)} className={`rounded-full border px-2.5 py-1 text-[11px] ${!over ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-zinc-200 dark:border-zinc-700 text-zinc-500"}`}>Perfectly calibrated (the marketing version)</button>
        </div>

        <label className="mt-4 block text-[11px] text-zinc-500">
          Auto-handle when stated confidence is at least <b className="text-zinc-800 dark:text-zinc-100">{Math.round(t * 100)}%</b>
          <input type="range" min={0.5} max={0.99} step={0.01} value={t} onChange={(e) => setT(Number(e.target.value))} className="block w-full" />
        </label>

        <div className="mt-3 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[2px]" aria-hidden="true">
          {rows.map((x, n) => (
            <span key={n} title={`stated ${Math.round(x.p * 100)}%`} className={`aspect-square rounded-[2px] ${x.p >= t ? (x.ok ? "bg-emerald-500" : "bg-rose-500") : "bg-zinc-300 dark:bg-zinc-700"}`} />
          ))}
        </div>
        <p className="mt-1 text-[10px] text-zinc-400">Green: handled and right. Red: handled and wrong. Grey: sent to a human or a bigger model.</p>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2"><p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{auto.length}</p><p className="text-[10px] text-zinc-400">handled alone</p></div>
          <div className="rounded-lg border border-rose-500/40 p-2"><p className="text-lg font-bold text-rose-600 dark:text-rose-400">{wrongAuto}</p><p className="text-[10px] text-zinc-400">wrong, with no second look</p></div>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2"><p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{escal}</p><p className="text-[10px] text-zinc-400">escalated</p></div>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          Flip between the two modes at the same line. If the model is calibrated, a 90% line means about 10% of what it handles alone is wrong. If it is overconfident, the real error is higher, and you would not know without labelled data.
        </p>
      </div>
    </figure>
  );
}
