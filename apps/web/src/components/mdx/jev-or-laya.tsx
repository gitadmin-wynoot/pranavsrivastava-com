"use client";

import { useState } from "react";

/*
  JevOrLaya — a lean, not a verdict. Hosted API versus open weights, based on
  the evidence available 25 September 2026. Both are days or weeks old; treat
  the result as a starting hypothesis to test.
*/

type Side = "jev" | "laya";
const QS: { q: string; yes: Side; why: string }[] = [
  { q: "Do you already run a GPU next to your LLM serving?", yes: "laya", why: "Self-hosting is cheap only when the hardware is already paid for and busy. Without a GPU, one independent author found Laya on a CPU server took a median of 49.4 seconds per decision: a batch tool, not a request path." },
  { q: "Can you label a few thousand examples and maintain a fine-tune?", yes: "laya", why: "Laya's base checkpoints scored 0.362 zero-shot on a typed-decisions benchmark, below the 0.461 majority-class baseline. Its good numbers come after fine-tuning." },
  { q: "Must the data stay inside your own network?", yes: "laya", why: "Open weights can run on your hardware. Jev is a managed API; Cloudflare lists zero data retention for it, but you still send the data out." },
  { q: "Does one question have more than about 20 options?", yes: "jev", why: "On Banking77 (77 intents) one review measured Laya 0.425 against Jev 0.870, and Laya's own notes flag trouble past about 20 options." },
  { q: "Are your inputs longer than roughly an email (over about 1,000 tokens)?", yes: "jev", why: "The tested Laya checkpoints have 512 to 1,024 token windows. Jev's docs list 32,000 tokens (a community post says 64,000; sources disagree, so check)." },
  { q: "Do you need this working this week, with no setup?", yes: "jev", why: "It is an API call. Laya needs you to pick a checkpoint, serve it, and calibrate it." },
  { q: "Is a large share of your traffic non-English?", yes: "laya", why: "Laya ships a multilingual checkpoint. Jev is reported weaker outside English. Neither is proven for your language, so test both." },
  { q: "Do you make tens of millions of decisions a month?", yes: "laya", why: "At Jev's list price, a million decisions of 900 tokens is roughly $38 a month. Volume only changes the answer at a very large scale." },
];

export function JevOrLaya() {
  const [a, setA] = useState<(boolean | null)[]>(QS.map(() => null));
  const answered = a.filter((x) => x !== null).length;
  let jev = 0, laya = 0;
  QS.forEach((x, i) => {
    if (a[i] === null) return;
    const side: Side = a[i] ? x.yes : x.yes === "jev" ? "laya" : "jev";
    if (side === "jev") jev++; else laya++;
  });
  const lean = jev === laya ? "No clear lean. Test both on your own data." : jev > laya ? "Leans toward the hosted API (Jev)" : "Leans toward open weights (Laya)";

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Hosted API or open weights? Answer for your situation.
      </div>
      <div className="p-4 sm:p-5">
        <ol className="space-y-2">
          {QS.map((x, i) => (
            <li key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
              <p className="text-[13px] text-zinc-800 dark:text-zinc-100">{i + 1}. {x.q}</p>
              <div className="mt-2 flex gap-1.5">
                {[true, false].map((v) => (
                  <button key={String(v)} onClick={() => setA(a.map((z, n) => (n === i ? v : z)))} className={`rounded-full border px-3 py-0.5 text-[11px] ${a[i] === v ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500"}`}>{v ? "yes" : "no"}</button>
                ))}
              </div>
              {a[i] !== null && <p className="mt-2 text-[12px] text-zinc-600 dark:text-zinc-300">{x.why}</p>}
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-xl border border-blue-500/40 bg-blue-500/5 p-3">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{answered === 0 ? "Answer the questions above" : lean}</p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
            <span>Jev {jev}</span>
            <div className="flex h-2 flex-1 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
              <div className="bg-sky-500" style={{ width: `${answered ? (jev / answered) * 100 : 0}%` }} />
              <div className="bg-orange-500" style={{ width: `${answered ? (laya / answered) * 100 : 0}%` }} />
            </div>
            <span>Laya {laya}</span>
          </div>
          <p className="mt-2 text-[10px] text-zinc-400">A lean, not a ruling. Both projects are days to weeks old (Jev launched 15 Sept 2026, Laya was open-sourced 18 Sept 2026).</p>
        </div>
        <button onClick={() => setA(QS.map(() => null))} className="mt-3 text-[11px] text-zinc-400 hover:underline">Reset</button>
      </div>
    </figure>
  );
}
