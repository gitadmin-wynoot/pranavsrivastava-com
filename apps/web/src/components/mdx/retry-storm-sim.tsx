"use client";

import { useState } from "react";

/*
  RetryStormSim — 100 clients hit a service that fails for the first 3 seconds
  and can handle 40 requests per second. Compare naive retry, backoff, and
  backoff with jitter. Deterministic (seeded), so it renders the same everywhere.
*/

const CLIENTS = 100;
const SECONDS = 16;
const CAPACITY = 40;
const FAIL_UNTIL = 3;

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Mode = "naive" | "backoff" | "jitter";

function simulate(mode: Mode) {
  const rand = rng(7);
  const load = new Array(SECONDS).fill(0);
  const next = Array.from({ length: CLIENTS }, () => ({ t: 0, tries: 0, done: false }));
  for (let sec = 0; sec < SECONDS; sec++) {
    const due = next.filter((c) => !c.done && c.t <= sec);
    load[sec] = due.length;
    // service down early, then serves up to CAPACITY of what arrives
    // an overloaded service does not just slow down, it falls over: too many
    // requests at once and it serves none of them
    const cap = due.length > CAPACITY * 2 ? 0 : CAPACITY;
    let served = 0;
    for (const c of due) {
      const ok = sec >= FAIL_UNTIL && served < cap;
      if (ok) { c.done = true; served++; continue; }
      c.tries++;
      if (mode === "naive") c.t = sec + 1;
      else {
        const wait = Math.min(2 ** c.tries, 8);
        c.t = sec + (mode === "backoff" ? wait : Math.max(1, Math.round(rand() * wait)));
      }
    }
  }
  const left = next.filter((c) => !c.done).length;
  return { load, left };
}

const LABEL: Record<Mode, string> = { naive: "Retry immediately", backoff: "Exponential backoff", jitter: "Backoff + jitter" };

export function RetryStormSim() {
  const [mode, setMode] = useState<Mode>("naive");
  const { load, left } = simulate(mode);
  const max = Math.max(...load, CAPACITY);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        100 agents, one shaky service (down for 3 seconds; handles {CAPACITY}/sec, and collapses past {CAPACITY * 2})
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(LABEL) as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-full border px-2.5 py-1 text-[11px] ${m === mode ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"}`}>
              {LABEL[m]}
            </button>
          ))}
        </div>

        <div className="relative mt-4 flex h-32 items-end gap-1">
          <div className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-rose-400" style={{ bottom: `${(CAPACITY / max) * 100}%` }} />
          {load.map((v, s) => (
            <div key={s} className="flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
              <div className={`w-full rounded-t ${v > CAPACITY ? "bg-rose-500" : "bg-blue-500"}`} style={{ height: `${(v / max) * 100}%` }} title={`${v} requests at second ${s}`} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-zinc-400"><span>0s</span><span>requests per second (dashed line = what the service can handle)</span><span>{SECONDS}s</span></div>

        <p className="mt-3 text-[13px] text-zinc-700 dark:text-zinc-200">
          Peak load: <b>{Math.max(...load)}</b> requests/sec · still waiting at the end: <b>{left}</b> of {CLIENTS}
        </p>
        <p className="mt-1 text-[12px] text-zinc-500">
          {mode === "naive" && "Everyone retries on the same beat. The service comes back, gets hit by all 100 at once, and falls over again. It never gets a chance to recover."}
          {mode === "backoff" && "Better on paper, but everyone waits the same amount, so they all come back together in one big wave and knock it over again."}
          {mode === "jitter" && "Randomising the wait spreads the returns out. The service sees a trickle it can handle, and everyone gets through."}
        </p>
      </div>
    </figure>
  );
}
