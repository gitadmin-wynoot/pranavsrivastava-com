"use client";

import { useState } from "react";

/*
  StudyQuiz — check yourself. Pick an answer, see the explanation, and keep a
  running score. Nothing is stored or sent anywhere.
*/

const QUIZ = [
  { q: "Why is a typed decision usually cheaper than asking an LLM the same question?", opts: ["It uses a smaller prompt", "Output tokens are free at list price and input is priced far lower", "It never makes mistakes", "It runs on your own GPU"], a: 1, why: "At list price the output is free and the input rate is a fraction of a typical LLM's. The written answer alone was about half the LLM bill in our example." },
  { q: "\"0 type errors\" means:", opts: ["Every answer is correct", "Every answer fits the schema you defined", "It never needs testing", "It cannot be wrong on your data"], a: 1, why: "It is a promise about the shape of the answer, not about whether the answer is right." },
  { q: "You set a cascade to auto-handle anything Jev is 90% sure about. What must be true for that to be safe?", opts: ["Nothing, 90% means 90%", "The stated confidence has been checked against real outcomes on your data", "The LLM is even more confident", "The price is low"], a: 1, why: "Independent tests found overconfidence on choice and score answers. Calibrate locally before you trust a threshold." },
  { q: "In the phishing example, what took Jev from 62.6% to 95.0%?", opts: ["A bigger model", "Five narrow questions, plus a regression fitted on 1,000 labelled emails", "Asking more politely", "Removing the hard emails"], a: 1, why: "The gain came from decomposing the task and fitting weights on labels. A two-line regex still scored 91.8%." },
  { q: "Which decision should you keep OUT of a typed-decision model for now?", opts: ["Routing support tickets to a queue", "Ordering a review queue by risk", "Rejecting a job applicant automatically", "Picking the fast or strong model"], a: 2, why: "Decisions with legal effect on a person need explanations and human involvement, and there is no audit of Jev for it." },
  { q: "A guardrail's risk API is down. What should the system do?", opts: ["Let the call through", "Retry forever", "Fail closed and send it to a human", "Switch the check off"], a: 2, why: "A guardrail that fails open is not a guardrail." },
  { q: "Laya beat Jev 0.766 to 0.727 on a benchmark. What is the catch?", opts: ["None", "Laya was fine-tuned on that benchmark's own training split; zero-shot it scored 0.362", "Jev was not tested", "Laya is closed-source"], a: 1, why: "Not like for like. Zero-shot Laya was below the 0.461 majority-class baseline." },
  { q: "You have a GPU already busy with LLM serving, thousands of labels, and data that must stay in-network. Lean:", opts: ["Hosted API", "Open weights", "Neither", "Ask an LLM"], a: 1, why: "That is the profile the open-weights route suits. Still test a fine-tuned checkpoint on a held-out set." },
  { q: "The cheapest baseline for a fixed list of banned phrases is:", opts: ["Jev", "A larger LLM", "A regex or word list", "A fine-tuned encoder"], a: 2, why: "Exact, free, explainable. Use the simple thing first, and beat it before you spend more." },
  { q: "Before letting a typed-decision model run alone in a high-stakes system, you should:", opts: ["Read the launch post", "Run it in shadow on your own labelled traffic, then a small canary behind a gate", "Ship on Friday", "Trust the vendor benchmark"], a: 1, why: "Every independent author says the same thing: measure on your own data." },
];

export function StudyQuiz() {
  const [pick, setPick] = useState<(number | null)[]>(QUIZ.map(() => null));
  const score = pick.filter((p, i) => p === QUIZ[i].a).length;
  const answered = pick.filter((p) => p !== null).length;
  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <span>Check yourself</span><span>{score} / {answered} correct · {QUIZ.length} questions</span>
      </div>
      <div className="p-4 sm:p-5">
        <ol className="space-y-4">
          {QUIZ.map((x, i) => (
            <li key={i}>
              <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">{i + 1}. {x.q}</p>
              <div className="mt-2 grid gap-1.5">
                {x.opts.map((o, n) => {
                  const chosen = pick[i] === n;
                  const show = pick[i] !== null;
                  const cls = show ? (n === x.a ? "border-emerald-500 bg-emerald-500/10" : chosen ? "border-rose-500 bg-rose-500/10" : "border-zinc-200 dark:border-zinc-800 opacity-60") : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-400";
                  return <button key={n} disabled={show} onClick={() => setPick(pick.map((p, k) => (k === i ? n : p)))} className={`rounded-lg border px-3 py-1.5 text-left text-[12px] text-zinc-700 dark:text-zinc-200 ${cls}`}>{o}</button>;
                })}
              </div>
              {pick[i] !== null && <p className="mt-2 text-[12px] text-zinc-600 dark:text-zinc-300">{pick[i] === x.a ? "Right. " : "Not quite. "}{x.why}</p>}
            </li>
          ))}
        </ol>
        <button onClick={() => setPick(QUIZ.map(() => null))} className="mt-4 text-[11px] text-zinc-400 hover:underline">Reset</button>
      </div>
    </figure>
  );
}
