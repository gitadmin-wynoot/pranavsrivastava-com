"use client";

import { useState } from "react";

/*
  ProjectFitExplorer — where typed decisions could plausibly help Pranav's own
  projects. These are PROPOSALS, not built systems. Each carries an honest
  evidence label and a first step.
*/

type Ev = "ok" | "mixed" | "unproven";
const EV: Record<Ev, { t: string; c: string }> = {
  ok: { t: "Reasonable fit, cheap to test", c: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  mixed: { t: "Plausible, evidence mixed", c: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  unproven: { t: "Unproven: test before trusting", c: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
};

const P: { name: string; brand: string; decision: string; helps: string; saves: string; ev: Ev; risk: string; first: string }[] = [
  {
    name: "Site chat assistant",
    brand: "pranavsrivastava.com",
    decision: "Is this visitor question answerable from the site, does it need the model, or should it go to /contact?",
    helps: "A cheap first pass decides the route. Simple navigational questions (\"where is the MCP course?\") never need a big model, and out-of-scope questions get sent to /contact instead of a made-up answer.",
    saves: "Big-model calls for the share of questions that are simple routing. Also fewer wrong answers: the honesty rule in the voice guide (\"if it does not know, say so\") becomes a decision the code can act on.",
    ev: "ok",
    risk: "A wrong \"in scope\" call means a confident wrong answer under Pranav's name. Keep the answering step grounded in site content regardless.",
    first: "Log 300 real questions, label the route by hand, run Jev (or a regex and embeddings baseline) in shadow, compare.",
  },
  {
    name: "AI Radar (research agent)",
    brand: "pranavsrivastava.com",
    decision: "Is this item worth summarising? Score relevance, difficulty, and buildability before an LLM reads it.",
    helps: "The research agent scans many releases and papers. A typed score per item filters the pile so the LLM only summarises what clears the bar.",
    saves: "Most of the LLM input tokens: you skip reading and summarising the items that score low. Volume is high and stakes are low, which is the friendliest place to start.",
    ev: "ok",
    risk: "Missing a good item. Keep a weekly sample of the rejected pile for a human skim, so drift shows up.",
    first: "Run scores in shadow beside the current process for two weeks and look at what it would have dropped.",
  },
  {
    name: "Writer agent (voice check)",
    brand: "pranavsrivastava.com",
    decision: "Does this draft break the voice-and-style rules?",
    helps: "For banned phrases a plain regex or word list is better: exact, free, explainable. A typed check is only worth trying for the fuzzy rules, like \"reads like a generic assistant\".",
    saves: "Little. Most of this check should stay deterministic. Say so: the honest answer is that Jev is the wrong first tool here.",
    ev: "unproven",
    risk: "Fuzzy tone judgements are where independent tests found it least stable (small wording changes moved many answers).",
    first: "Ship the regex list first. Try the fuzzy check in shadow only, and keep a human in the publish step (already a repo rule).",
  },
  {
    name: "Agent cockpit approvals",
    brand: "pranavsrivastava.com",
    decision: "Which pending agent actions are low-risk enough to batch, and which need a close human look?",
    helps: "A risk score orders the approval queue so the human sees the scary items first. It does not approve anything.",
    saves: "Human time more than tokens. Also cheaper than asking a big model to review every action.",
    ev: "mixed",
    risk: "Risk scores are overconfident in independent tests. Never let a low score skip approval for irreversible actions (deploy, post, delete).",
    first: "Use it only to sort the queue, and measure how often the human disagrees with the ordering.",
  },
  {
    name: "LLM gateway routing",
    brand: "packages/llm-gateway",
    decision: "Does this request need the fast model or the strong model?",
    helps: "A model-routing policy: cheap model for lookups and extraction, strong model for hard reasoning. LangChain's Jev integration ships this idea as a router middleware.",
    saves: "The price gap between your cheap and strong models, on every request the router sends down. Real, but only as big as your model price gap.",
    ev: "mixed",
    risk: "A hard question sent to the cheap model quietly gets a worse answer. Sample and review routed-down traffic.",
    first: "Add the router behind the gateway's model-policy config, shadow it, then compare answer quality by route.",
  },
  {
    name: "Wynoot (booking and support SaaS)",
    brand: "wynoot.com",
    decision: "Classify incoming customer messages: booking change, cancellation, complaint, question.",
    helps: "Intent triage in front of the automation, with a fixed set of options, short English texts, and lots of volume. This is the shape independent tests liked best.",
    saves: "LLM calls on routine messages, and latency: a reply routes in a fraction of a second.",
    ev: "ok",
    risk: "Cancellations and money touch customers directly. Route those to a confirmation step, not straight to action.",
    first: "Label a few hundred real messages per customer type, shadow it, and only then let it route without a check.",
  },
  {
    name: "Qubitsy client work",
    brand: "qubitsy.com",
    decision: "Should a client system use a typed-decision layer at all?",
    helps: "A repeatable audit: find the decisions in the client's LLM pipeline that are cheap classifications in disguise, and price them. The value is the assessment, not a vendor.",
    saves: "Whatever the calculator says once you plug in the client's real volumes and measured accuracy.",
    ev: "mixed",
    risk: "Recommending a ten-day-old single-vendor service into a client's high-stakes system. Say plainly what is unproven, and design with a fallback.",
    first: "Offer the shadow evaluation as the deliverable: the client learns the answer on their own data before committing.",
  },
];

export function ProjectFitExplorer() {
  const [i, setI] = useState(0);
  const p = P[i];
  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Where it could help: proposals for real projects (none of this is built yet)
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {P.map((x, n) => (
            <button key={x.name} onClick={() => setI(n)} className={`rounded-full border px-2.5 py-1 text-[11px] ${n === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"}`}>{x.name}</button>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">{p.name}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${EV[p.ev].c}`}>{EV[p.ev].t}</span>
          </div>
          <p className="text-[11px] text-zinc-400">{p.brand}</p>
          {([["The decision", p.decision], ["How it helps", p.helps], ["What it saves", p.saves], ["What could go wrong", p.risk], ["First step", p.first]] as const).map(([h, t]) => (
            <div key={h} className="mt-3">
              <p className={`text-[10px] font-semibold uppercase tracking-wide ${h === "What could go wrong" ? "text-rose-600 dark:text-rose-400" : h === "First step" ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>{h}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
