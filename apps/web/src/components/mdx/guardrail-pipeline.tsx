"use client";

import { useState } from "react";

/*
  GuardrailPipeline — a typed-decision risk check sitting BEHIND deterministic
  rules and IN FRONT of a human gate. Risk scores are illustrative. The point
  is the order of the layers and that the system fails closed.
*/

const CALLS = [
  { label: "Look up order status", tool: "get_order", risk: 0.04, rules: "allow", irreversible: false },
  { label: "Refund 42", tool: "issue_refund(42)", risk: 0.31, rules: "allow", irreversible: true },
  { label: "Refund 4,000", tool: "issue_refund(4000)", risk: 0.88, rules: "deny", irreversible: true },
  { label: "Email all customers", tool: "send_bulk_email", risk: 0.72, rules: "allow", irreversible: true },
  { label: "Read a support doc", tool: "search_docs", risk: 0.12, rules: "allow", irreversible: false },
] as const;

export function GuardrailPipeline() {
  const [i, setI] = useState(1);
  const [thr, setThr] = useState(0.5);
  const [down, setDown] = useState(false);
  const c = CALLS[i];

  const steps: { name: string; result: string; tone: "ok" | "stop" | "human" | "skip" }[] = [];
  let outcome = "";
  let stopped = false;

  steps.push({ name: "1. Deterministic rules", result: c.rules === "deny" ? "DENY: over the policy cap" : "pass", tone: c.rules === "deny" ? "stop" : "ok" });
  if (c.rules === "deny") { stopped = true; outcome = "Blocked by a plain rule. No model was consulted, which is exactly right for a rule you can write down."; }

  if (!stopped) {
    if (down) {
      steps.push({ name: "2. Jev risk check", result: "API unavailable: fail closed", tone: "human" });
      stopped = true; outcome = "The risk check could not run, so the call goes to a human. A guardrail that fails open is not a guardrail.";
    } else {
      const high = c.risk >= thr;
      steps.push({ name: "2. Jev risk check", result: `risk ${c.risk.toFixed(2)} ${high ? "≥" : "<"} ${thr.toFixed(2)}`, tone: high ? "human" : "ok" });
      if (high) { stopped = true; outcome = "Risk is above your line, so a human approves it. The line is yours to set and to test on labelled examples."; }
    }
  }
  if (!stopped) {
    if (c.irreversible) {
      steps.push({ name: "3. Approval gate", result: "irreversible action: human approves", tone: "human" });
      outcome = "Low risk score, but the action cannot be undone, so the approval gate still applies. A model's low score never overrides that rule.";
    } else {
      steps.push({ name: "3. Approval gate", result: "reversible: no approval needed", tone: "ok" });
      outcome = "Runs, and is logged to the trace.";
    }
  }
  const tone = { ok: "border-emerald-500/40 bg-emerald-500/5", stop: "border-rose-500/50 bg-rose-500/10", human: "border-amber-500/50 bg-amber-500/10", skip: "opacity-40 border-zinc-200 dark:border-zinc-800" };

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        A risk score inside a guardrail stack (illustrative scores)
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {CALLS.map((x, n) => (
            <button key={x.label} onClick={() => setI(n)} className={`rounded-full border px-2.5 py-1 text-[11px] ${n === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"}`}>{x.label}</button>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-zinc-900 px-3 py-2 text-[12px] text-zinc-100">agent → {c.tool}</p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[11px] text-zinc-500">Human review when risk ≥ <b className="text-zinc-800 dark:text-zinc-100">{thr.toFixed(2)}</b>
            <input type="range" min={0.1} max={0.95} step={0.05} value={thr} onChange={(e) => setThr(Number(e.target.value))} className="block w-full" />
          </label>
          <label className="flex items-center gap-2 text-[12px] text-zinc-700 dark:text-zinc-200">
            <input type="checkbox" checked={down} onChange={(e) => setDown(e.target.checked)} /> Simulate: the risk API is down
          </label>
        </div>

        <ol className="mt-4 space-y-2">
          {steps.map((s) => (
            <li key={s.name} className={`rounded-xl border px-3 py-2 text-[13px] ${tone[s.tone]}`}>
              <b className="text-zinc-800 dark:text-zinc-100">{s.name}</b> <span className="text-zinc-600 dark:text-zinc-300">— {s.result}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{outcome}</p>
      </div>
    </figure>
  );
}
