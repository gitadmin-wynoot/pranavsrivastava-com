"use client";

import { useState } from "react";

/*
  ApprovalScenarios — where a human sign-off is genuinely required before an
  agent acts, grounded in the actual rules and risks that force the pause.
  SSR-stable, no API.
*/

type Scenario = {
  emoji: string;
  domain: string;
  accent: string;
  action: string;
  why: string;
  anchor: string;
  practice: string;
};

const SCENARIOS: Scenario[] = [
  {
    emoji: "💳",
    domain: "Payments",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    action: "Release a supplier payment, issue a refund, or move money above a threshold.",
    why: "Money movement is effectively irreversible once settled, and it is the single most attractive target for fraud and manipulation.",
    anchor: "Banking has enforced the four-eyes principle — a second authoriser above a threshold — for decades, and segregation of duties is a standard financial control. Card fraud losses alone run into the tens of billions of dollars globally each year.",
    practice: "A treasury agent drafts the payment run and stops. A human approves the batch (or just the items over a limit) before anything leaves the account.",
  },
  {
    emoji: "🏥",
    domain: "Healthcare",
    accent: "border-rose-500/40 bg-rose-500/5",
    action: "Change a triage priority, suggest a diagnosis, or adjust a dosage.",
    why: "The cost of a false negative is a person, and clinical accountability cannot be delegated to software.",
    anchor: "Regulators treat most clinical AI as decision *support*: it informs a qualified clinician, who remains responsible for the decision. That boundary is the whole design constraint.",
    practice: "A vision model flags a scan as likely urgent; it moves in the queue only after a radiologist confirms. The agent proposes, the clinician disposes.",
  },
  {
    emoji: "⚖️",
    domain: "Decisions about people",
    accent: "border-blue-500/40 bg-blue-500/5",
    action: "Deny a loan, reject an insurance claim, or close an account.",
    why: "Automated decisions with legal or similarly significant effects on a person carry an explicit right to human involvement in much of the world.",
    anchor: "GDPR Article 22 gives people the right not to be subject to decisions based solely on automated processing where the effects are legal or similarly significant — including a right to obtain human intervention. The EU AI Act adds a human-oversight requirement (Article 14) for high-risk systems.",
    practice: "The agent assembles the case and a recommendation; a human reviewer makes and signs the actual decision, with the reasoning recorded.",
  },
  {
    emoji: "🚀",
    domain: "Production infrastructure",
    accent: "border-amber-500/40 bg-amber-500/5",
    action: "Deploy, roll back, scale down, or delete cloud resources.",
    why: "Blast radius. A single confident, wrong action can take a service — or a customer's data — down, and deletion is not undoable.",
    anchor: "Change is the leading source of production incidents, which is why 'change failure rate' is one of the four standard DORA delivery metrics, and why plan-then-apply gates exist in every serious infrastructure tool.",
    practice: "The agent produces a plan (what will change, what it will cost, what breaks if it is wrong). A human approves the plan; only then does apply run.",
  },
  {
    emoji: "🛡️",
    domain: "Content moderation",
    accent: "border-violet-500/40 bg-violet-500/5",
    action: "Remove a post, demonetise a creator, or permanently ban an account.",
    why: "Automated classifiers are confidently wrong at the margins, and the people they are wrong about lose income or voice.",
    anchor: "The EU's Digital Services Act requires platforms to give a statement of reasons and a route to appeal for moderation decisions — which in practice means a human somewhere in the loop for contested calls.",
    practice: "High-confidence spam is auto-removed; borderline and high-impact cases (bans, monetisation) are queued for a human reviewer.",
  },
  {
    emoji: "🤝",
    domain: "Hiring",
    accent: "border-sky-500/40 bg-sky-500/5",
    action: "Screen out a candidate or rank a shortlist.",
    why: "Bias in, bias out — at scale, and with legal exposure attached.",
    anchor: "New York City's Local Law 144 requires an annual independent bias audit and candidate notice for automated employment decision tools; GDPR Article 22 applies here too.",
    practice: "The agent surfaces and summarises candidates. A human recruiter decides who is rejected, and the criteria are auditable.",
  },
  {
    emoji: "📅",
    domain: "Customer commitments",
    accent: "border-teal-500/40 bg-teal-500/5",
    action: "Override a booked slot, cancel an order, or rebook a customer.",
    why: "It reaches into a real person's day. Being technically correct and socially wrong is still wrong, and trust is expensive to rebuild.",
    anchor: "This is the running example in this course precisely because it is so ordinary: no regulator forces the pause, but the business absolutely should.",
    practice: "The agent proposes the override with its reasoning; a human (or the customer) confirms before the calendar actually changes.",
  },
];

export function ApprovalScenarios() {
  const [i, setI] = useState(0);
  const s = SCENARIOS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Where a human must sign off — pick a domain
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {SCENARIOS.map((x, idx) => (
            <button
              key={x.domain}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.domain}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{s.emoji}</span> {s.domain}
          </h4>

          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">The agent wants to</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{s.action}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Why a human decides</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.why}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">The rule or the risk</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.anchor}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">In practice</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.practice}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Notice the shared shape: the agent does the <em>work</em> — gathering, reasoning, drafting — and a human owns the <em>commitment</em>. That handover is exactly what an interrupt plus a durable checkpoint makes possible.
        </p>
      </div>
    </figure>
  );
}
