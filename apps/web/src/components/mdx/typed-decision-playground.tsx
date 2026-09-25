"use client";

import { useState } from "react";

/*
  TypedDecisionPlayground — what goes in and what comes out when you ask for a
  typed decision instead of a paragraph. ILLUSTRATIVE: the outputs below are
  hand-written examples of the response shape, not live calls to any API.
*/

const CASES = [
  {
    name: "Support ticket",
    state: "Ticket #8841. Customer: 'You charged me twice for the March plan and I have emailed three times. If this is not fixed today I am disputing it with my bank.' Plan: Pro. Account age: 26 months.",
    typed: {
      queue: { type: "choice", value: "billing", probs: "billing 0.91 · account 0.05 · technical 0.03 · other 0.01" },
      urgency: { type: "score (1 to 5)", value: "4.3", probs: "4 → 0.62 · 5 → 0.31" },
      churn_risk: { type: "noul (yes/no)", value: "0.78", probs: "probability of 'yes'" },
    },
    llm: "This looks like a billing issue: the customer says they were charged twice for their March plan and has already written in three times without a reply. They mention disputing the charge with their bank, which suggests they are frustrated and could cancel. I would treat it as high priority and route it to the billing team, ideally with an apology and a promise to resolve it today.",
  },
  {
    name: "Suspicious email",
    state: "From: support@paypa1-secure.example. Subject: Verify your account within 24 hours. Body: 'Click https://bit.ly/x9 to avoid suspension.'",
    typed: {
      verdict: { type: "choice", value: "phishing", probs: "phishing 0.88 · spam 0.09 · legitimate 0.03" },
      shortened_link: { type: "noul (yes/no)", value: "0.99", probs: "probability of 'yes'" },
      urgent_threat: { type: "noul (yes/no)", value: "0.95", probs: "probability of 'yes'" },
    },
    llm: "This email is very likely phishing. The sender address uses a look-alike domain with a number one in place of the letter L, it creates urgency with a 24-hour deadline, and it uses a shortened link that hides the real destination. I would not click the link and I would report it to your security team.",
  },
  {
    name: "Agent tool call",
    state: "Agent wants to run: issue_refund(order='A-1043', amount=4000). Customer history: 2 prior refunds. Policy cap for agents: 100.",
    typed: {
      risk: { type: "score (1 to 5)", value: "4.8", probs: "5 → 0.83 · 4 → 0.15" },
      exceeds_policy: { type: "noul (yes/no)", value: "0.97", probs: "probability of 'yes'" },
      action: { type: "choice", value: "needs_human", probs: "needs_human 0.94 · allow 0.04 · block 0.02" },
    },
    llm: "This refund is much larger than the policy cap of 100 and the customer only has two prior refunds, so I would recommend that a human reviews it before anything is issued. It might be legitimate, but the amount is high enough to justify a second pair of eyes.",
  },
];

const tok = (s: string) => Math.ceil(s.length / 4); // rough: 4 characters per token

export function TypedDecisionPlayground() {
  const [i, setI] = useState(0);
  const c = CASES[i];
  const typedJson = JSON.stringify(Object.fromEntries(Object.entries(c.typed).map(([k, v]) => [k, v.value])), null, 2);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Same question, two kinds of answer (illustrative examples, not live calls)
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {CASES.map((x, n) => (
            <button key={x.name} onClick={() => setI(n)} className={`rounded-full border px-2.5 py-1 text-[11px] ${n === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"}`}>{x.name}</button>
          ))}
        </div>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">State you send</p>
        <p className="mt-1 rounded-lg bg-zinc-900 px-3 py-2 text-[12px] text-zinc-100">{c.state}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-violet-500/40 bg-violet-500/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">An LLM writes (about {tok(c.llm)} output tokens)</p>
            <p className="mt-1 text-[12px] leading-relaxed text-zinc-700 dark:text-zinc-200">{c.llm}</p>
            <p className="mt-2 text-[11px] text-zinc-500">Your code now has to parse this. Is &ldquo;high priority&rdquo; a 3, a 4, or a 5?</p>
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">A typed decision returns</p>
            <pre className="mt-1 overflow-x-auto text-[12px] text-zinc-800 dark:text-zinc-100">{typedJson}</pre>
            <ul className="mt-2 space-y-1 text-[11px] text-zinc-500">
              {Object.entries(c.typed).map(([k, v]) => (
                <li key={k}><b className="text-zinc-700 dark:text-zinc-300">{k}</b> ({v.type}): {v.probs}</li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-zinc-500">Your code branches on it directly. Output tokens billed: 0 (per TypeSafe&rsquo;s list pricing).</p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-zinc-400">The probabilities are shown because the real response includes them. Chapter 5 is about why you should not trust them blindly.</p>
      </div>
    </figure>
  );
}
