"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

type State = "idle" | "loading" | "done" | "error" | "soon";

export function CircleInvite() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/circle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
        setMessage("Noted. If it's a fit, you'll hear from me directly.");
      } else if (res.status === 503) {
        setState("soon");
        setMessage("Requests open shortly — thanks for the interest.");
      } else {
        setState("error");
        setMessage(data.error ?? "Something went wrong. Try again?");
      }
    } catch {
      setState("error");
      setMessage("Network hiccup. Try again in a moment.");
    }
  }

  if (state === "done" || state === "soon") {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
        <Check className="w-4 h-4" />
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="One line: what are you building or working on?"
        rows={2}
        maxLength={600}
        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-50"
      >
        {state === "loading" ? "…" : <>Request an invite <ArrowRight className="w-4 h-4" /></>}
      </button>
      {state === "error" && <p className="text-xs text-red-500">{message}</p>}
    </form>
  );
}
