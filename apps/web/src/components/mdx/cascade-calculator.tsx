"use client";

import { useState } from "react";

/*
  CascadeCalculator — do the sum yourself. Jev looks at everything; the LLM only
  sees what Jev is not sure about. All prices and accuracies are inputs: the
  defaults are placeholders from public reporting on 16-25 Sept 2026, not a
  quote. Replace them with your own measured numbers.
*/

const usd = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: n < 10 ? 4 : 0 });
const num = (n: number) => Math.round(n).toLocaleString("en-US");

function Field({ label, value, set, min, max, step, suffix }: { label: string; value: number; set: (n: number) => void; min: number; max: number; step: number; suffix?: string }) {
  return (
    <label className="block text-[11px] text-zinc-500">
      {label}: <b className="text-zinc-800 dark:text-zinc-100">{value}{suffix}</b>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="block w-full" />
    </label>
  );
}

export function CascadeCalculator() {
  const [n, setN] = useState(1_000_000);
  const [tokens, setTokens] = useState(900);
  const [llmIn, setLlmIn] = useState(2);
  const [llmOut, setLlmOut] = useState(12);
  const [outTok, setOutTok] = useState(150);
  const [jevPrice, setJevPrice] = useState(0.042);
  const [share, setShare] = useState(70);
  const [accJ, setAccJ] = useState(94);
  const [accL, setAccL] = useState(96);

  const llmPer = (tokens * llmIn + outTok * llmOut) / 1e6;
  const jevPer = (tokens * jevPrice) / 1e6;
  const allLlm = n * llmPer;
  const cascade = n * jevPer + n * (1 - share / 100) * llmPer;
  const wrongAll = n * (1 - accL / 100);
  const wrongCas = n * ((share / 100) * (1 - accJ / 100) + (1 - share / 100) * (1 - accL / 100));
  const cpcAll = allLlm / (n - wrongAll);
  const cpcCas = cascade / (n - wrongCas);
  const extraWrong = wrongCas - wrongAll;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Do the sum: LLM on everything, or Jev first and the LLM for the rest?
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Decisions per month" value={n} set={setN} min={10_000} max={5_000_000} step={10_000} />
          <Field label="Tokens per decision (state + questions)" value={tokens} set={setTokens} min={200} max={4000} step={100} />
          <Field label="LLM input price, $ per M tokens" value={llmIn} set={setLlmIn} min={0.1} max={10} step={0.1} />
          <Field label="LLM output price, $ per M tokens" value={llmOut} set={setLlmOut} min={0.5} max={60} step={0.5} />
          <Field label="LLM output tokens per decision" value={outTok} set={setOutTok} min={10} max={800} step={10} />
          <Field label="Jev input price, $ per M tokens" value={jevPrice} set={setJevPrice} min={0.04} max={0.5} step={0.002} />
          <Field label="Share Jev handles alone" value={share} set={setShare} min={0} max={100} step={5} suffix="%" />
          <Field label="Jev accuracy on that share" value={accJ} set={setAccJ} min={60} max={100} step={1} suffix="%" />
          <Field label="LLM accuracy" value={accL} set={setAccL} min={60} max={100} step={1} suffix="%" />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-violet-500/40 bg-violet-500/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">LLM on everything</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{usd(allLlm)} / month</p>
            <p className="text-[12px] text-zinc-600 dark:text-zinc-300">{num(wrongAll)} wrong · {usd(cpcAll)} per correct decision</p>
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Jev first, LLM for the rest</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{usd(cascade)} / month</p>
            <p className="text-[12px] text-zinc-600 dark:text-zinc-300">{num(wrongCas)} wrong · {usd(cpcCas)} per correct decision</p>
          </div>
        </div>

        <p className={`mt-3 rounded-lg px-3 py-2 text-[13px] ${extraWrong > 0 ? "bg-amber-500/10 text-amber-800 dark:text-amber-300" : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"}`}>
          You save {usd(allLlm - cascade)} a month ({allLlm > 0 ? Math.round(((allLlm - cascade) / allLlm) * 100) : 0}%).
          {extraWrong > 0 ? ` It costs you ${num(extraWrong)} more wrong decisions. Is each one worth less than ${usd((allLlm - cascade) / extraWrong)}?` : " Accuracy does not get worse under these numbers."}
        </p>
        <p className="mt-2 text-[10px] text-zinc-400">Defaults are placeholders from public reporting (Jev list price from TypeSafe, LLM rates as quoted in press on 16 Sept 2026). Prices change and TypeSafe says it cannot yet prove its price is sustainable. Use measured numbers from your own traffic.</p>
      </div>
    </figure>
  );
}
