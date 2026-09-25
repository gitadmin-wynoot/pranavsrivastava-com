"use client";

import { useState } from "react";

/*
  AgentLoopPrimer — step through one tiny agent run. Every step shows what is
  sent to the model, so you can see the context grow and where things can break.
*/

const STEPS = [
  { who: "You", text: "Where is order A-1043? It's late.", tokens: 60, risk: "The user's words are data. They can contain anything." },
  { who: "Model", text: "I should look this order up. → get_order(\"A-1043\")", tokens: 140, risk: "The model only writes text that looks like a tool call. Nothing has run yet." },
  { who: "Harness", text: "Runs get_order. Result: { status: \"delayed\", eta: \"Friday\" }", tokens: 260, risk: "Now real code runs. This is the moment permissions, limits and logging matter." },
  { who: "Model", text: "Delayed until Friday. Let me check the refund policy. → search_docs(\"late delivery\")", tokens: 380, risk: "Each turn re-sends everything so far. Cost creeps up." },
  { who: "Harness", text: "Runs search_docs. Result: 3 chunks of policy text (one from a web page).", tokens: 900, risk: "The chunk from the web page is text someone else wrote. It is now sitting next to your instructions." },
  { who: "Model", text: "Sorry about the delay, Pranav. It should arrive Friday, and late orders qualify for a shipping refund.", tokens: 980, risk: "The loop ends because the model chose to stop. Nothing forced it to." },
];

export function AgentLoopPrimer() {
  const [i, setI] = useState(0);
  const shown = STEPS.slice(0, i + 1);
  const cur = STEPS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        One agent run, one step at a time
      </div>
      <div className="p-4 sm:p-5">
        <ol className="space-y-2">
          {shown.map((s, n) => (
            <li key={n} className={`rounded-xl border px-3 py-2 text-[13px] ${n === i ? "border-blue-500/50 bg-blue-500/5" : "border-zinc-200 dark:border-zinc-800 opacity-70"}`}>
              <span className={`mr-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${s.who === "Model" ? "bg-violet-500/20 text-violet-700 dark:text-violet-300" : s.who === "Harness" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-zinc-500/20 text-zinc-600 dark:text-zinc-300"}`}>{s.who}</span>
              <span className="text-zinc-700 dark:text-zinc-200">{s.text}</span>
            </li>
          ))}
        </ol>

        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-zinc-400"><span>Tokens sent to the model this turn</span><span>{cur.tokens.toLocaleString()}</span></div>
          <div className="mt-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${(cur.tokens / 1000) * 100}%` }} /></div>
        </div>

        <p className="mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-[12px] text-amber-800 dark:text-amber-300">⚠ {cur.risk}</p>

        <div className="mt-3 flex gap-2">
          <button disabled={i >= STEPS.length - 1} onClick={() => setI(i + 1)} className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium disabled:opacity-40">Next step ▸</button>
          <button onClick={() => setI(0)} className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs">Restart</button>
        </div>
      </div>
    </figure>
  );
}
