"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

type State = "idle" | "loading" | "done" | "error" | "soon";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
        setMessage(data.message ?? "You're in. I'll only write when I have something useful.");
      } else if (res.status === 503) {
        setState("soon");
        setMessage("Signups open shortly — thanks for the interest.");
      } else {
        setState("error");
        setMessage(data.error ?? "Something went wrong. Try again?");
      }
    } catch {
      setState("error");
      setMessage("Network hiccup. Try again in a moment.");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Notes on building AI that actually works
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 mb-5 max-w-xl">
        Every so often I write up something I learned shipping AI and software at
        scale — the kind of thing that does not fit in a tweet. No schedule, no
        spam, unsubscribe in one click.
      </p>

      {state === "done" || state === "soon" ? (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <Check className="w-4 h-4" />
          {message}
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors disabled:opacity-50 shrink-0"
          >
            {state === "loading" ? "…" : <>Subscribe <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      )}

      {state === "error" && (
        <p className="text-xs text-red-500 mt-2">{message}</p>
      )}
    </div>
  );
}
