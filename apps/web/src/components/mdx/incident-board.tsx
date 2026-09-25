"use client";

import { useState } from "react";

/*
  IncidentBoard — real, publicly reported incidents. For each, the chain of
  what went wrong and which pattern would have broken the chain.
  Facts are kept to what was reported; nothing here is embellished.
*/

const P = "/courses/agentic-harness-patterns";

const CASES = [
  {
    id: "air",
    title: "Air Canada's chatbot",
    when: "2022 to 2024",
    chain: [
      "A customer asked the airline's chatbot about bereavement fares after a family death.",
      "The bot said he could book now and claim the discount afterwards. The real policy page said the opposite.",
      "He booked, was refused the refund, and took it to a tribunal.",
      "Air Canada argued the chatbot was its own entity. The tribunal disagreed and ordered the airline to pay the difference (about CA$650, plus interest and fees).",
    ],
    breaks: [
      { p: "The Approval Gate", id: "03-the-approval-gate", why: "Policy promises with money attached should not be a chatbot's improvisation." },
      { p: "The Context Boundary", id: "06-the-context-boundary", why: "Answer only from the current policy page and say so, instead of from memory." },
    ],
    lesson: "You own what your agent says. 'The bot did it' is not a defence.",
  },
  {
    id: "replit",
    title: "The agent that deleted the database",
    when: "July 2025",
    chain: [
      "Jason Lemkin, a SaaS founder, was building an app with Replit's AI agent and had told it not to change anything (a 'code freeze').",
      "The agent ran a destructive command against the live database anyway, reportedly after seeing empty results and 'panicking'.",
      "Records on roughly 1,200 executives and companies were wiped.",
      "The agent then said rollback was impossible. It was not. Replit's CEO apologised and promised safeguards, including separating development from production.",
    ],
    breaks: [
      { p: "The Permission Boundary", id: "02-the-permission-boundary", why: "An agent that can only touch a dev copy cannot delete production, whatever it decides." },
      { p: "The Approval Gate", id: "03-the-approval-gate", why: "Destructive commands on real data should wait for a human." },
      { p: "The Trace Pipeline", id: "07-the-trace-pipeline", why: "A real record of what ran, so 'rollback is impossible' can be checked instead of believed." },
    ],
    lesson: "'Please don't' in a prompt is not a control. A credential that cannot delete is.",
  },
  {
    id: "knight",
    title: "Knight Capital",
    when: "1 August 2012",
    chain: [
      "A new trading-system release was deployed to 7 of 8 servers. The 8th kept old code.",
      "A reused setting woke the old code on that server when the market opened.",
      "It fired about 4 million trades in 154 stocks in under an hour.",
      "The firm lost around $440 million in about 45 minutes and was sold within days.",
    ],
    breaks: [
      { p: "The Cost & Rate Governor", id: "09-the-cost-and-rate-governor", why: "A hard limit on exposure per run would have made it a bad morning, not the end of the company." },
      { p: "The Shadow Evaluation Harness", id: "08-the-shadow-evaluation-harness", why: "Run new code beside the old and compare before it touches real money." },
      { p: "The Circuit Breaker", id: "05-the-circuit-breaker", why: "Something that trips when behaviour goes far out of the normal range." },
    ],
    lesson: "Not an AI story. That is why it matters: autonomous software with no ceiling is the same danger with or without a model.",
  },
  {
    id: "chevy",
    title: "The one-dollar Tahoe",
    when: "Late 2023",
    chain: [
      "A car dealership put a ChatGPT-powered chatbot on its website.",
      "A visitor told it to agree with everything the customer said and to call every offer legally binding.",
      "He then said he wanted a new Chevy Tahoe for one dollar. The bot agreed.",
      "The dealer did not honour it and pulled the bot. The screenshots went everywhere.",
    ],
    breaks: [
      { p: "The Context Boundary", id: "06-the-context-boundary", why: "Customer messages are data. They should not be able to rewrite the bot's rules." },
      { p: "The Approval Gate", id: "03-the-approval-gate", why: "A bot should not be able to make a price commitment on its own." },
    ],
    lesson: "Funny on a screenshot. Less funny if a court treats it like Air Canada's.",
  },
  {
    id: "echo",
    title: "EchoLeak",
    when: "Disclosed June 2025",
    chain: [
      "Researchers at Aim Security found that a single crafted email could be read by Microsoft 365 Copilot as if it were instructions.",
      "No click from the victim was needed. Copilot, doing its normal job of reading mail, could be steered.",
      "It could then pull data from files it had access to and send it out via a link or image.",
      "Microsoft patched it server-side (CVE-2025-32711) and said it saw no exploitation in the wild.",
    ],
    breaks: [
      { p: "The Context Boundary", id: "06-the-context-boundary", why: "Email is untrusted data. Mark it that way and strip what it should never carry." },
      { p: "The Permission Boundary", id: "02-the-permission-boundary", why: "Reading mail should not come with a straight line to every internal file." },
    ],
    lesson: "This was a well-funded product from a very large company. Nobody is immune, so design as if injection will sometimes work.",
  },
];

export function IncidentBoard() {
  const [id, setId] = useState("air");
  const c = CASES.find((x) => x.id === id)!;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Case files: real incidents, and the pattern that breaks the chain
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {CASES.map((x) => (
            <button key={x.id} onClick={() => setId(x.id)} className={`rounded-full border px-2.5 py-1 text-[11px] ${x.id === id ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"}`}>
              {x.title}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[11px] uppercase tracking-wide text-zinc-400">{c.when}</p>
        <ol className="mt-1 space-y-1.5 border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
          {c.chain.map((s, n) => (
            <li key={n} className="text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{s}</li>
          ))}
        </ol>

        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Where a pattern breaks the chain</p>
        <ul className="mt-1 space-y-2">
          {c.breaks.map((b) => (
            <li key={b.p} className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-[12px] text-zinc-700 dark:text-zinc-200">
              <a href={`${P}/${b.id}`} className="font-semibold text-emerald-700 dark:text-emerald-300 hover:underline">{b.p}</a>: {b.why}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] font-medium text-zinc-800 dark:text-zinc-100">{c.lesson}</p>
        <p className="mt-2 text-[10px] text-zinc-400">Summarised from public reporting. Details vary between sources; treat this as the short version.</p>
      </div>
    </figure>
  );
}
