"use client";

import { useState } from "react";

/*
  JevDecisionGuide — should THIS decision go to a typed-decision model? Answer
  honestly. "Hard stop" answers keep it out; the rest shape how carefully you
  start. Reflects the evidence as of 25 September 2026.
*/

type A = "yes" | "no" | null;
const Q: { q: string; bad: "yes" | "no"; hard: boolean; why: string }[] = [
  { q: "Does each decision need a written explanation or audit trail?", bad: "yes", hard: true, why: "Jev returns probabilities, not reasoning. If a regulator or a customer can ask \"why\", you need something that can say." },
  { q: "Is the decision about a person's job, credit, insurance, or legal rights?", bad: "yes", hard: true, why: "Decisions with legal effect on people carry human-involvement and audit duties (for example GDPR Article 22). I found no audit of Jev for this, and the vendor's résumé-screening use case is unproven." },
  { q: "Is the answer fully contained in the text you send (no outside facts, maths, or date arithmetic)?", bad: "no", hard: true, why: "It answers only from the state you provide, and independent tests found it unreliable at counting and date comparisons." },
  { q: "Is the set of options fixed and under 255?", bad: "no", hard: true, why: "Choice supports up to 255 options; many-option multi-class was a weak spot in independent testing." },
  { q: "Is your text mostly English?", bad: "no", hard: false, why: "One review saw Russian fall from 88.3% to 77.3% and Spanish lose 3 to 6 points. Test your language before trusting it." },
  { q: "Do you have a few hundred labelled examples to test on?", bad: "no", hard: false, why: "Without labels you cannot calibrate or even know your accuracy. Independent authors all say the same: shadow first, on your own traffic." },
  { q: "If a decision is wrong, is it caught downstream or easy to undo?", bad: "no", hard: false, why: "If not, keep a human approval in front of it, whatever the score says." },
  { q: "Do you have a fallback when the API is slow or down?", bad: "no", hard: false, why: "It is a ten-day-old, single-vendor service. A fallback rung is not optional in a high-stakes system." },
];

export function JevDecisionGuide() {
  const [ans, setAns] = useState<A[]>(Q.map(() => null));
  const done = ans.every((a) => a !== null);
  const flagged = Q.map((x, i) => ({ x, hit: ans[i] === x.bad }));
  const hard = flagged.filter((f) => f.hit && f.x.hard);
  const soft = flagged.filter((f) => f.hit && !f.x.hard);

  let verdict = "";
  let tone = "";
  if (done) {
    if (hard.length) { verdict = "Keep this decision out of a typed-decision model, at least for now."; tone = "border-rose-500/50 bg-rose-500/10"; }
    else if (soft.length >= 3) { verdict = "Shadow only. Run it beside your current process and ship nothing yet."; tone = "border-amber-500/50 bg-amber-500/10"; }
    else if (soft.length >= 1) { verdict = "Reasonable candidate: shadow first, then a small canary behind an approval gate."; tone = "border-amber-500/50 bg-amber-500/10"; }
    else { verdict = "Good candidate. Still shadow first, then a canary. Nothing here has been proven in production yet."; tone = "border-emerald-500/40 bg-emerald-500/5"; }
  }

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Should this decision go to Jev? Answer for your real system.
      </div>
      <div className="p-4 sm:p-5">
        <ol className="space-y-2">
          {Q.map((x, i) => (
            <li key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
              <p className="text-[13px] text-zinc-800 dark:text-zinc-100">{i + 1}. {x.q}</p>
              <div className="mt-2 flex gap-1.5">
                {(["yes", "no"] as const).map((v) => (
                  <button key={v} onClick={() => setAns(ans.map((a, n) => (n === i ? v : a)))} className={`rounded-full border px-3 py-0.5 text-[11px] ${ans[i] === v ? (v === x.bad ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300" : "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300") : "border-zinc-200 dark:border-zinc-700 text-zinc-500"}`}>{v}</button>
                ))}
              </div>
              {ans[i] === x.bad && <p className="mt-2 text-[12px] text-zinc-600 dark:text-zinc-300">{x.hard ? "Hard stop. " : "Caution. "}{x.why}</p>}
            </li>
          ))}
        </ol>
        {done && (
          <div className={`mt-4 rounded-xl border p-3 ${tone}`}>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{verdict}</p>
            <p className="mt-1 text-[11px] text-zinc-500">{hard.length} hard stop{hard.length === 1 ? "" : "s"}, {soft.length} caution{soft.length === 1 ? "" : "s"}. Reflects the public evidence on 25 September 2026.</p>
          </div>
        )}
        <button onClick={() => setAns(Q.map(() => null))} className="mt-3 text-[11px] text-zinc-400 hover:underline">Reset</button>
      </div>
    </figure>
  );
}
