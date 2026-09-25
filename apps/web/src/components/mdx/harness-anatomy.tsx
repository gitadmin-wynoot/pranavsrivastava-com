"use client";

import { useState } from "react";

/*
  HarnessAnatomy — the model in the middle, the ten patterns around it.
  Click a pattern to see the question it answers and a real story behind it.
*/

const P = "/courses/agentic-harness-patterns";

const PATTERNS = [
  { n: 1, name: "Tool Gateway", id: "01-the-tool-gateway", ring: "outer", q: "Is this call even allowed to happen?", story: "The model invents a tool name or sends garbage arguments. Somebody has to say no before code runs." },
  { n: 2, name: "Permission Boundary", id: "02-the-permission-boundary", ring: "outer", q: "If the model gets fooled, how bad can it get?", story: "In the EchoLeak research (2025), one crafted email could steer Microsoft 365 Copilot into leaking data. Microsoft patched it. The lesson: assume the trick works and cap the damage." },
  { n: 3, name: "Approval Gate", id: "03-the-approval-gate", ring: "outer", q: "Should a human sign this one?", story: "Air Canada's chatbot promised a refund policy that did not exist, and a tribunal made the airline honour it. Some promises need a person." },
  { n: 4, name: "Sandboxed Runtime", id: "04-the-sandboxed-runtime", ring: "outer", q: "Where does model-written code actually run?", story: "Code the model writes is code nobody reviewed. Run it somewhere you can throw away." },
  { n: 5, name: "Circuit Breaker", id: "05-the-circuit-breaker", ring: "inner", q: "Should we keep calling something that is broken?", story: "Amazon's engineers describe retries turning a small failure into a bigger one, because every client piles on at once." },
  { n: 6, name: "Context Boundary", id: "06-the-context-boundary", ring: "inner", q: "Is this text an order or just information?", story: "A Chevrolet dealer's bot 'agreed' to sell an SUV for one dollar because the customer's message was treated like a rule." },
  { n: 7, name: "Trace Pipeline", id: "07-the-trace-pipeline", ring: "inner", q: "What did it actually do?", story: "When Replit's agent wiped a production database in 2025, it then said recovery was impossible. Only the real record could settle what was true." },
  { n: 8, name: "Shadow Evaluation", id: "08-the-shadow-evaluation-harness", ring: "inner", q: "Is the new version actually better?", story: "Knight Capital shipped a change to 7 of 8 servers in 2012 and lost about $440 million in 45 minutes. Trying it quietly first is cheaper." },
  { n: 9, name: "Cost & Rate Governor", id: "09-the-cost-and-rate-governor", ring: "inner", q: "When do we say enough?", story: "Agents loop. A loop with no ceiling is a bill with no ceiling." },
  { n: 10, name: "Fallback Ladder", id: "10-the-fallback-ladder", ring: "inner", q: "What do we do when it fails anyway?", story: "The last rung is a person and an honest message, because that one cannot be down." },
];

export function HarnessAnatomy() {
  const [sel, setSel] = useState(1);
  const p = PATTERNS.find((x) => x.n === sel)!;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The model is the small box in the middle. Tap a pattern.
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {PATTERNS.map((x) => (
            <button
              key={x.n}
              onClick={() => setSel(x.n)}
              className={`rounded-xl border px-2 py-2 text-left text-[11px] leading-tight transition-colors ${sel === x.n ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400"}`}
            >
              <span className="block text-[10px] opacity-60">{x.n}</span>
              {x.name}
            </button>
          ))}
          <div className="col-span-2 flex items-center justify-center rounded-xl border-2 border-dashed border-violet-400/60 bg-violet-500/10 px-2 py-3 text-center text-[11px] font-semibold text-violet-700 dark:text-violet-300 sm:col-span-5">
            🧠 the model: brilliant, fast, occasionally very wrong
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Pattern {p.n}</p>
          <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">{p.name}</p>
          <p className="mt-1 text-[13px] italic text-zinc-600 dark:text-zinc-300">&ldquo;{p.q}&rdquo;</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{p.story}</p>
          <a href={`${P}/${p.id}`} className="mt-3 inline-block text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            Read the chapter →
          </a>
        </div>
      </div>
    </figure>
  );
}
