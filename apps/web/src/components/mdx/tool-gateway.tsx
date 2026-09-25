"use client";

import { useState } from "react";

/*
  ToolGateway — send a tool call through the five checks a gateway runs
  before anything touches the real world. Deterministic, no API.
*/

type Call = {
  label: string;
  tool: string;
  args: string;
  // index of the first check that fails, or -1 if the call is allowed
  failsAt: number;
  reason: string;
};

const CHECKS = [
  { name: "Registered?", detail: "Is this tool on the allowlist for this agent?" },
  { name: "Schema valid?", detail: "Do the arguments match the declared types and ranges?" },
  { name: "Permitted?", detail: "Does this agent's role allow this action on this resource?" },
  { name: "Under the limit?", detail: "Is the agent inside its rate and budget limits?" },
  { name: "Execute + log", detail: "Run it with a timeout; record inputs, output, duration." },
];

const CALLS: Call[] = [
  { label: "Search the docs", tool: "search_docs", args: '{ "query": "refund policy" }', failsAt: -1, reason: "All checks pass. The call runs and is logged." },
  { label: "Invented tool", tool: "delete_everything", args: "{ }", failsAt: 0, reason: "The model made up a tool name. The gateway has never heard of it, so nothing runs." },
  { label: "Bad arguments", tool: "send_email", args: '{ "to": "not-an-email", "body": 42 }', failsAt: 1, reason: "The arguments do not match the schema. The error goes back to the model so it can retry with a fix." },
  { label: "Wrong role", tool: "issue_refund", args: '{ "order": "A-1043", "amount": 900 }', failsAt: 2, reason: "This agent is read-only for billing. Refunds need a different role, or an approval." },
  { label: "Runaway loop", tool: "search_docs", args: '{ "query": "refund policy" } (call #61 this minute)', failsAt: 3, reason: "Same call, 61st time in a minute. The gateway rate-limits it and tells the agent to stop." },
];

export function ToolGateway() {
  const [i, setI] = useState(0);
  const c = CALLS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Send a tool call through the gateway
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {CALLS.map((x, idx) => (
            <button
              key={x.label}
              onClick={() => setI(idx)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-900 px-3 py-2 text-[12px] text-zinc-100">
{`model → ${c.tool}(${c.args})`}
        </pre>

        <ol className="mt-4 space-y-2">
          {CHECKS.map((k, idx) => {
            const reached = c.failsAt === -1 || idx <= c.failsAt;
            const failed = idx === c.failsAt;
            const state = !reached ? "skipped" : failed ? "blocked" : "passed";
            const cls =
              state === "blocked"
                ? "border-rose-500/50 bg-rose-500/10"
                : state === "passed"
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-zinc-200 dark:border-zinc-800 opacity-40";
            return (
              <li key={k.name} className={`flex items-start gap-3 rounded-xl border px-3 py-2 ${cls}`}>
                <span className="mt-0.5 text-sm" aria-hidden="true">{state === "blocked" ? "⛔" : state === "passed" ? "✅" : "·"}</span>
                <div>
                  <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
                    {idx + 1}. {k.name} <span className="ml-1 text-[10px] font-normal uppercase tracking-wide text-zinc-400">{state}</span>
                  </p>
                  <p className="text-[12px] text-zinc-500 dark:text-zinc-400">{k.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{c.reason}</p>
      </div>
    </figure>
  );
}
