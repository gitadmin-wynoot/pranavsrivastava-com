"use client";

import { useState } from "react";

/*
  CircuitBreakerSim — closed → open → half-open. You are the flaky
  dependency: make calls fail or succeed and watch the breaker react.
*/

type State = "closed" | "open" | "half-open";
const THRESHOLD = 3;
const COOLDOWN = 3;

const STYLE: Record<State, string> = {
  closed: "border-emerald-500/50 bg-emerald-500/10",
  open: "border-rose-500/50 bg-rose-500/10",
  "half-open": "border-amber-500/50 bg-amber-500/10",
};
const EXPLAIN: Record<State, string> = {
  closed: "Calls pass through. Failures are counted.",
  open: "Calls are refused instantly. The broken service gets time to recover, and the agent stops burning tokens on retries.",
  "half-open": "One trial call is allowed. Success closes the breaker; failure opens it again.",
};

export function CircuitBreakerSim() {
  const [state, setState] = useState<State>("closed");
  const [fails, setFails] = useState(0);
  const [cool, setCool] = useState(0);
  const [log, setLog] = useState<string[]>(["Breaker is closed. Try a failing call."]);

  const push = (m: string) => setLog((l) => [m, ...l].slice(0, 6));

  function call(ok: boolean) {
    if (state === "open") return push("Refused instantly — breaker is open (no call made).");
    if (ok) {
      setFails(0);
      if (state === "half-open") push("Trial call succeeded → closed.");
      else push("Call succeeded.");
      setState("closed");
      return;
    }
    if (state === "half-open") {
      setState("open");
      setCool(COOLDOWN);
      return push("Trial call failed → open again.");
    }
    const n = fails + 1;
    setFails(n);
    if (n >= THRESHOLD) {
      setState("open");
      setCool(COOLDOWN);
      push(`Failure ${n} of ${THRESHOLD} → OPEN.`);
    } else push(`Call failed (${n} of ${THRESHOLD}).`);
  }

  function tick() {
    if (state !== "open") return push("Time passes. Nothing to do while the breaker is not open.");
    const c = cool - 1;
    setCool(c);
    if (c <= 0) {
      setState("half-open");
      push("Cooldown over → half-open.");
    } else push(`Cooling down… ${c} tick${c === 1 ? "" : "s"} left.`);
  }

  const btn = "rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:border-zinc-500";

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Be the flaky API — trip the breaker ({THRESHOLD} failures opens it)
      </div>
      <div className="p-4 sm:p-5">
        <div className={`rounded-xl border p-4 ${STYLE[state]}`}>
          <p className="text-lg font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">{state}</p>
          <p className="mt-1 text-[13px] text-zinc-700 dark:text-zinc-200">{EXPLAIN[state]}</p>
          <p className="mt-2 text-[11px] text-zinc-500">
            Failures: {fails}/{THRESHOLD}{state === "open" ? ` · cooldown ${cool}` : ""}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className={btn} onClick={() => call(false)}>Call fails</button>
          <button className={btn} onClick={() => call(true)}>Call succeeds</button>
          <button className={btn} onClick={tick}>Wait one tick</button>
          <button
            className={btn}
            onClick={() => { setState("closed"); setFails(0); setCool(0); setLog(["Reset."]); }}
          >
            Reset
          </button>
        </div>
        <ul className="mt-3 space-y-1 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
          {log.map((l, n) => <li key={`${n}-${l}`} className={n === 0 ? "text-zinc-800 dark:text-zinc-100" : ""}>› {l}</li>)}
        </ul>
      </div>
    </figure>
  );
}
