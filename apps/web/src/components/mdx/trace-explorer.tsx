"use client";

import { useState } from "react";

/*
  TraceExplorer — a waterfall of one agent run. Click a span to see what a
  trace pipeline records. The run is a real-shaped example, hard-coded.
*/

type Span = {
  id: string;
  name: string;
  kind: "llm" | "tool" | "retrieval" | "guard";
  start: number; // ms
  dur: number; // ms
  detail: Record<string, string>;
};

const TOTAL = 6200;

const SPANS: Span[] = [
  { id: "s1", name: "plan", kind: "llm", start: 0, dur: 1400, detail: { model: "claude-sonnet-5", tokens: "820 in / 140 out", cost: "$0.0041", note: "Decides to look up the order first." } },
  { id: "s2", name: "tool: get_order", kind: "tool", start: 1400, dur: 350, detail: { args: '{ "order": "A-1043" }', status: "ok", note: "Passed the gateway checks." } },
  { id: "s3", name: "retrieve: refund policy", kind: "retrieval", start: 1750, dur: 620, detail: { query: "refund window damaged item", hits: "4 chunks", topScore: "0.82", note: "Top chunk is the 30-day rule." } },
  { id: "s4", name: "draft reply", kind: "llm", start: 2370, dur: 2100, detail: { model: "claude-sonnet-5", tokens: "2,950 in / 310 out", cost: "$0.0134", note: "The slowest span and the most expensive one." } },
  { id: "s5", name: "guard: pii check", kind: "guard", start: 4470, dur: 180, detail: { result: "pass", note: "No card numbers or addresses in the draft." } },
  { id: "s6", name: "tool: issue_refund", kind: "tool", start: 4650, dur: 1550, detail: { args: '{ "order": "A-1043", "amount": 42 }', status: "held for approval", note: "Waited on a human. Most of this time is the wait, not the work." } },
];

const COLOR: Record<Span["kind"], string> = {
  llm: "bg-violet-500",
  tool: "bg-blue-500",
  retrieval: "bg-teal-500",
  guard: "bg-amber-500",
};

export function TraceExplorer() {
  const [sel, setSel] = useState("s4");
  const s = SPANS.find((x) => x.id === sel)!;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        One agent run as a trace — click a span
      </div>
      <div className="p-4 sm:p-5">
        <div className="space-y-1.5">
          {SPANS.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSel(sp.id)}
              className={`grid w-full grid-cols-[110px_1fr] items-center gap-2 rounded-lg px-2 py-1 text-left sm:grid-cols-[170px_1fr] ${sel === sp.id ? "bg-zinc-100 dark:bg-zinc-800/70" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}
            >
              <span className="truncate text-[11px] text-zinc-600 dark:text-zinc-300">{sp.name}</span>
              <span className="relative block h-3 rounded bg-zinc-100 dark:bg-zinc-900">
                <span
                  className={`absolute top-0 h-3 rounded ${COLOR[sp.kind]}`}
                  style={{ left: `${(sp.start / TOTAL) * 100}%`, width: `${Math.max((sp.dur / TOTAL) * 100, 2)}%` }}
                />
              </span>
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-zinc-400">
          {(Object.keys(COLOR) as Span["kind"][]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1"><i className={`h-2 w-2 rounded-sm ${COLOR[k]}`} />{k}</span>
          ))}
          <span>total {(TOTAL / 1000).toFixed(1)}s</span>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{s.name}</p>
          <p className="text-[11px] text-zinc-400">{s.dur} ms · starts at {s.start} ms</p>
          <dl className="mt-2 grid grid-cols-[90px_1fr] gap-x-3 gap-y-1 text-[12px]">
            {Object.entries(s.detail).map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-zinc-400">{k}</dt>
                <dd className="text-zinc-700 dark:text-zinc-200">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </figure>
  );
}
