"use client";

import { useState } from "react";

/*
  AutonomyMatrix — a practical gate for "does this action need a human?".
  Two axes that actually predict regret: can it be undone, and how far does it
  reach. Click a quadrant. SSR-stable, no API.
*/

type Cell = {
  key: string;
  label: string;
  reversible: boolean;
  large: boolean;
  tone: string;
  chip: string;
  pattern: string;
  what: string;
  example: string;
  code: string;
};

const CELLS: Cell[] = [
  {
    key: "rev-large",
    label: "Announce it",
    reversible: true,
    large: true,
    tone: "border-amber-500/50 bg-amber-500/10",
    chip: "text-amber-700 dark:text-amber-300",
    pattern: "Act — but tell someone, and keep the undo button working.",
    what: "No blocking approval (it would just slow everything down), but emit a notification, write an audit record, and make sure a single command can reverse it.",
    example: "Re-tagging 10,000 support tickets; scaling a fleet up for a traffic spike.",
    code: "No interrupt. Log the action + a rollback handle.",
  },
  {
    key: "irrev-large",
    label: "Require approval",
    reversible: false,
    large: true,
    tone: "border-rose-500/60 bg-rose-500/10",
    chip: "text-rose-700 dark:text-rose-300",
    pattern: "Stop. A human owns this decision.",
    what: "A hard pause: present the plan and the reasoning, wait for an explicit decision, record who approved and when. For the highest stakes, require two approvers.",
    example: "Releasing a wire transfer; deleting a production database; permanently banning an account.",
    code: "interrupt(...) → status PAUSED_FOR_HUMAN → resume with Command(resume=decision)",
  },
  {
    key: "rev-small",
    label: "Just let it run",
    reversible: true,
    large: false,
    tone: "border-emerald-500/50 bg-emerald-500/10",
    chip: "text-emerald-700 dark:text-emerald-300",
    pattern: "Full autonomy. Approval here is theatre.",
    what: "Let the agent act freely and simply log it. Asking a human to confirm trivial, undoable work trains them to click 'approve' without reading — which is how real approvals get rubber-stamped later.",
    example: "Drafting a summary; tagging a ticket; running a read-only query.",
    code: "No interrupt. Trace it and move on.",
  },
  {
    key: "irrev-small",
    label: "Confirm cheaply",
    reversible: false,
    large: false,
    tone: "border-blue-500/50 bg-blue-500/10",
    chip: "text-blue-700 dark:text-blue-300",
    pattern: "A light gate, or a window in which it can still be cancelled.",
    what: "Either a one-tap confirmation, or commit after a short delay the user can cancel inside — the 'undo send' pattern. Cheap for the human, still safe.",
    example: "Sending a single customer email; a small refund under the auto-approve limit.",
    code: "Optional interrupt, or a delayed commit with a cancel path.",
  },
];

export function AutonomyMatrix() {
  const [sel, setSel] = useState("irrev-large");
  const cell = CELLS.find((c) => c.key === sel)!;

  const at = (reversible: boolean, large: boolean) =>
    CELLS.find((c) => c.reversible === reversible && c.large === large)!;

  const Cellular = ({ c }: { c: Cell }) => (
    <button
      onClick={() => setSel(c.key)}
      className={`rounded-xl border p-3 text-left transition-all ${c.tone} ${sel === c.key ? "ring-2 ring-zinc-900 dark:ring-zinc-100" : "opacity-80 hover:opacity-100"}`}
    >
      <span className={`block text-[13px] font-bold ${c.chip}`}>{c.label}</span>
      <span className="mt-0.5 block text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
        {c.example.split(";")[0]}
      </span>
    </button>
  );

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Does this action need a human? — click a quadrant
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex gap-2">
          {/* y-axis label */}
          <div className="flex w-5 shrink-0 items-center justify-center">
            <span className="whitespace-nowrap text-[10px] uppercase tracking-wide text-zinc-400 -rotate-90">
              blast radius
            </span>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-2">
              <Cellular c={at(true, true)} />
              <Cellular c={at(false, true)} />
              <Cellular c={at(true, false)} />
              <Cellular c={at(false, false)} />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[10px] uppercase tracking-wide text-zinc-400">
              <span>reversible</span>
              <span>irreversible</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 p-4">
          <h4 className={`text-base font-bold ${cell.chip}`}>{cell.label}</h4>
          <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">{cell.pattern}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{cell.what}</p>
          <p className="mt-2 text-[12px] text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">For example: </span>{cell.example}
          </p>
          <p className="mt-2 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-200">
            {cell.code}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          The expensive mistake is gating everything: approval fatigue turns a real safety control into a reflex click. Spend your users&apos; attention where it is irreversible <em>and</em> far-reaching.
        </p>
      </div>
    </figure>
  );
}
