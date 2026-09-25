"use client";

import { useState } from "react";

/*
  TokenCostSplit — where the money goes in ONE decision. Shows why LLM output
  tokens matter, and what disappears when the answer is a typed value.
  Prices are editable placeholders (public reporting, Sept 2026).
*/

export function TokenCostSplit() {
  const [inTok, setInTok] = useState(900);
  const [outTok, setOutTok] = useState(150);
  const [pin, setPin] = useState(2);
  const [pout, setPout] = useState(12);
  const [jev, setJev] = useState(0.042);

  const llmIn = (inTok * pin) / 1e6;
  const llmOut = (outTok * pout) / 1e6;
  const llm = llmIn + llmOut;
  const j = (inTok * jev) / 1e6;
  const max = Math.max(llm, j);
  const pct = (v: number) => `${(v / max) * 100}%`;
  const f = (v: number) => "$" + v.toFixed(v < 0.01 ? 6 : 4);

  const S = ({ label, v, set, min, max: mx, step }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step: number }) => (
    <label className="block text-[11px] text-zinc-500">{label}: <b className="text-zinc-800 dark:text-zinc-100">{v}</b>
      <input type="range" min={min} max={mx} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="block w-full" />
    </label>
  );

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Where the money goes in one decision
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <S label="Input tokens (state + questions)" v={inTok} set={setInTok} min={100} max={4000} step={50} />
          <S label="LLM output tokens (the written answer)" v={outTok} set={setOutTok} min={0} max={800} step={10} />
          <S label="LLM input $ per M tokens" v={pin} set={setPin} min={0.1} max={10} step={0.1} />
          <S label="LLM output $ per M tokens" v={pout} set={setPout} min={0.5} max={60} step={0.5} />
          <S label="Jev input $ per M tokens (list)" v={jev} set={setJev} min={0.04} max={0.5} step={0.002} />
        </div>

        <div className="mt-5 space-y-3">
          <div>
            <p className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-100">LLM decision: {f(llm)}</p>
            <div className="mt-1 flex h-5 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
              <div className="bg-violet-500" style={{ width: pct(llmIn) }} title="input" />
              <div className="bg-fuchsia-500" style={{ width: pct(llmOut) }} title="output" />
            </div>
            <p className="mt-1 text-[10px] text-zinc-400"><span className="text-violet-500">■</span> input {f(llmIn)} · <span className="text-fuchsia-500">■</span> written answer {f(llmOut)} ({llm ? Math.round((llmOut / llm) * 100) : 0}% of the cost)</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-100">Typed decision: {f(j)}</p>
            <div className="mt-1 flex h-5 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
              <div className="bg-emerald-500" style={{ width: pct(j) }} />
            </div>
            <p className="mt-1 text-[10px] text-zinc-400"><span className="text-emerald-500">■</span> input only. Output tokens: free at list price.</p>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
          The typed decision costs about <b>{j > 0 ? Math.round(llm / j) : 0}x less per call</b> with these numbers. Two things produce that: a much lower input price, and no paid output. Notice how much of the LLM bill is the written answer alone.
        </p>
      </div>
    </figure>
  );
}
