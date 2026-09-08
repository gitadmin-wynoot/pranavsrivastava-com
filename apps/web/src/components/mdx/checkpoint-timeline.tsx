"use client";

import { useState } from "react";

/*
  CheckpointTimeline — step through one human-in-the-loop run and watch what
  actually lands in the DynamoDB table, including the moment the Lambda
  container is destroyed and the workflow survives anyway. SSR-stable, no API.
*/

type Row = { sk: string; kind: "checkpoint" | "write"; status: string; detail: string };

const A: Row = { sk: "CKPT##01J7A1", kind: "checkpoint", status: "RUNNING", detail: "state after propose_slot" };
const B: Row = { sk: "CKPT##01J7B2", kind: "checkpoint", status: "PAUSED_FOR_HUMAN", detail: "next_node = human_approval" };
const W: Row = { sk: "WRITE##01J7B2#task-7#0000", kind: "write", status: "—", detail: "channel: slot" };
const C: Row = { sk: "CKPT##01J7C3", kind: "checkpoint", status: "COMPLETED", detail: "state after finalize" };

type Step = {
  title: string;
  invocation: string;
  container: "alive" | "gone" | "new";
  text: string;
  rows: Row[];
  added: string[];
  read: string[];
};

const STEPS: Step[] = [
  {
    title: "A request arrives",
    invocation: "Invocation 1",
    container: "alive",
    text: "A fresh Lambda container spins up and builds a tenant-scoped saver and graph. Nothing has been saved yet — the workflow does not exist in the table.",
    rows: [], added: [], read: [],
  },
  {
    title: "propose_slot runs",
    invocation: "Invocation 1",
    container: "alive",
    text: "The first node finishes. LangGraph calls put() and the first snapshot lands in DynamoDB. If the function died right now, we could resume from here.",
    rows: [A], added: [A.sk], read: [],
  },
  {
    title: "human_approval hits interrupt()",
    invocation: "Invocation 1",
    container: "alive",
    text: "Execution stops inside the node. The state — including exactly where it stopped — is written, along with the step's intermediate writes. The handler marks the row PAUSED_FOR_HUMAN and records what runs next.",
    rows: [A, B, W], added: [B.sk, W.sk], read: [],
  },
  {
    title: "Lambda returns 202 — the container is destroyed",
    invocation: "—",
    container: "gone",
    text: "This is the moment the whole design exists for. The function's memory is gone. The workflow is completely unharmed, because every fact it needs is in the table.",
    rows: [A, B, W], added: [], read: [],
  },
  {
    title: "Hours pass. Nothing is running.",
    invocation: "—",
    container: "gone",
    text: "No compute, no idle server, no timer. A paused workflow costs only the storage of a few small rows — waiting a week is about as cheap as waiting a second.",
    rows: [A, B, W], added: [], read: [],
  },
  {
    title: "The human approves — a brand-new container",
    invocation: "Invocation 2",
    container: "new",
    text: "A different container, with no memory of the first, calls get_tuple() with the same thread_id. It reads the latest checkpoint and its pending writes, and LangGraph rebuilds the graph precisely at the interrupt line.",
    rows: [A, B, W], added: [], read: [B.sk, W.sk],
  },
  {
    title: "finalize runs → COMPLETED",
    invocation: "Invocation 2",
    container: "alive",
    text: "The booking override is actually performed, the graph reaches END, and a final checkpoint records the outcome for audit.",
    rows: [A, B, W, C], added: [C.sk], read: [],
  },
];

const CONTAINER_STYLE: Record<Step["container"], { label: string; cls: string }> = {
  alive: { label: "Lambda: running", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/40" },
  gone: { label: "Lambda: destroyed", cls: "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-400/40" },
  new: { label: "Lambda: new container", cls: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/40" },
};

const STATUS_STYLE: Record<string, string> = {
  RUNNING: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  PAUSED_FOR_HUMAN: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  COMPLETED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "—": "bg-zinc-500/10 text-zinc-500 dark:text-zinc-400",
};

export function CheckpointTimeline() {
  const [i, setI] = useState(0);
  const s = STEPS[i];
  const c = CONTAINER_STYLE[s.container];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Watch the memory table — one workflow, two invocations
      </div>

      <div className="p-4 sm:p-5">
        {/* stepper */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setI(Math.max(0, i - 1))}
            disabled={i === 0}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-[12px] text-zinc-600 dark:text-zinc-300 disabled:opacity-30 hover:border-zinc-400 transition-colors"
          >
            ← Back
          </button>
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Step ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-zinc-900 dark:bg-zinc-100" : "w-3 bg-zinc-300 dark:bg-zinc-700"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setI(Math.min(STEPS.length - 1, i + 1))}
            disabled={i === STEPS.length - 1}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-[12px] text-zinc-600 dark:text-zinc-300 disabled:opacity-30 hover:border-zinc-400 transition-colors"
          >
            Next →
          </button>
        </div>

        {/* what's happening */}
        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-zinc-900/5 dark:bg-zinc-100/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {s.invocation}
            </span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${c.cls}`}>{c.label}</span>
          </div>
          <h4 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">{s.title}</h4>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.text}</p>
        </div>

        {/* the table */}
        <p className="mt-4 mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
          Agent-State · pk = ACME#booking-9f3
        </p>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {s.rows.length === 0 ? (
            <p className="px-3 py-6 text-center text-[12px] text-zinc-400">(no rows yet)</p>
          ) : (
            s.rows.map((r) => {
              const isNew = s.added.includes(r.sk);
              const isRead = s.read.includes(r.sk);
              return (
                <div
                  key={r.sk}
                  className={`flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-zinc-100 dark:border-zinc-900 px-3 py-2 last:border-0 transition-colors ${
                    isNew ? "bg-emerald-500/10" : isRead ? "bg-blue-500/10" : ""
                  }`}
                >
                  <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-200">{r.sk}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[r.status]}`}>
                    {r.status}
                  </span>
                  <span className="text-[11px] text-zinc-400">{r.detail}</span>
                  {isNew && <span className="ml-auto text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">← written now</span>}
                  {isRead && <span className="ml-auto text-[10px] font-semibold text-blue-600 dark:text-blue-400">← read now</span>}
                </div>
              );
            })
          )}
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Sort keys are shown with an empty namespace (<span className="font-mono">CKPT##id</span>) because this is a top-level graph. Step 4 is the one to sit with: the container is gone and the workflow is still perfectly alive.
        </p>
      </div>
    </figure>
  );
}
