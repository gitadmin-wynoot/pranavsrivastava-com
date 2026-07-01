"use client";

import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";

/*
  NetworkUseCases — an on-demand generator of vivid "what the programmable
  network can do" scenarios. Each click surfaces a random real-world story,
  tagged by the capability it uses and how far off it is (here today / soon /
  futuristic). Makes an abstract idea concrete and playable.
*/

type Horizon = "now" | "soon" | "future";
type UseCase = { emoji: string; title: string; story: string; cap: string; horizon: Horizon };

const CASES: UseCase[] = [
  { emoji: "🏦", horizon: "now", cap: "SIM-Swap check", title: "The transfer that didn't happen", story: "You approve a big bank transfer. Before it clears, the bank quietly asks the network: was this phone's SIM swapped recently? It was — two hours ago, by a fraudster. The transfer is blocked. You never even knew you were attacked." },
  { emoji: "🏥", horizon: "soon", cap: "Quality-on-Demand", title: "A surgeon operates from 300 km away", story: "A remote operation can't tolerate a laggy video feed. The app asks the network for a guaranteed low-latency connection for the next 40 minutes — and gets it. The network stops being 'best effort' and starts making promises." },
  { emoji: "🚜", horizon: "now", cap: "IoT + eSIM", title: "A farm that waters itself", story: "Ten thousand soil sensors, each with a software SIM, whisper moisture readings over a low-power network. An AI decides exactly where and when to irrigate — saving water no human could track by hand." },
  { emoji: "📦", horizon: "now", cap: "Number Verification", title: "No more 'enter the code we texted you'", story: "Instead of an SMS code you copy-paste (and a fraudster could intercept), the app asks the network to silently confirm you control your number. Faster for you, and far harder to fake." },
  { emoji: "🛴", horizon: "soon", cap: "Device Location", title: "The scooter that knows you're lying", story: "Someone spoofs their GPS to unlock a scooter from across town. But the network's own location signal — much harder to fake than phone GPS — says otherwise. Unlock denied." },
  { emoji: "🧓", horizon: "soon", cap: "IoT + prioritisation", title: "A fall, caught in seconds", story: "A wearable on an elderly relative detects a fall. The alert jumps the queue on a congested network, and an AI triages it before a human even picks up. Minutes saved can be a life saved." },
  { emoji: "🎫", horizon: "soon", cap: "Network slicing", title: "60,000 phones, one stadium", story: "At a packed concert, everyone films at once and the network buckles. Slicing carves out a protected lane so emergency calls and payments still fly, even as the selfies clog everything else." },
  { emoji: "🌊", horizon: "now", cap: "IoT sensing", title: "The flood we saw coming", story: "Thousands of cheap river sensors on a low-power network feed an AI that spots the pattern hours before the water rises — enough time to move people, not just mop up." },
  { emoji: "🧳", horizon: "now", cap: "Network location", title: "Login from two countries at once", story: "An account logs in from Amsterdam and, four minutes later, from Lagos. Physically impossible. The network's location signal flags the 'impossible travel' and the AI locks the account before any damage." },
  { emoji: "🤖", horizon: "future", cap: "APIs composed by an agent", title: "Your AI books a plumber", story: "An AI assistant arranges a repair: it silently verifies your number, checks your SIM wasn't just swapped, and only then authorises payment — three network powers, stitched into one errand you never had to think about." },
  { emoji: "🏭", horizon: "now", cap: "Private 5G", title: "Robots on their own private network", story: "A factory runs its own private 5G. Autonomous carts get a guaranteed lane so they never stall mid-aisle, while an AI reschedules the floor in real time. The 'network' is now part of the machinery." },
  { emoji: "🔋", horizon: "now", cap: "IoT at scale", title: "A grid that balances itself", story: "Millions of smart meters report usage every few seconds. An AI nudges supply and demand to keep the lights on — an invisible dance run entirely over the network." },
  { emoji: "🚗", horizon: "future", cap: "Quality-on-Demand", title: "The car that reserves the road ahead", story: "A self-driving car approaches a tricky junction and pre-books guaranteed bandwidth for the sensor handoff — asking the network for certainty exactly when a dropped packet would matter most." },
  { emoji: "💬", horizon: "now", cap: "AI + network signals", title: "Catching the text-message scam", story: "Bots trigger millions of 'verify your number' texts to numbers that quietly pay the fraudster a cut. An AI watching network patterns spots the surge and shuts it down before the bill lands." },
  { emoji: "📱", horizon: "now", cap: "eSIM", title: "A local SIM before you leave the airport", story: "You land abroad and an app provisions a local data plan instantly — no plastic card, no shop, no queue. The SIM is just software now." },
  { emoji: "🚨", horizon: "soon", cap: "Network prioritisation", title: "Keeping the line open in a disaster", story: "When a storm floods the network with panicked calls, it reprioritises to keep emergency services connected, while an AI reroutes traffic around the damage." },
];

const HORIZON: Record<Horizon, { label: string; cls: string }> = {
  now: { label: "Here today", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  soon: { label: "Coming soon", cls: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  future: { label: "Futuristic", cls: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400" },
};

export function NetworkUseCases() {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(Math.floor(Math.random() * CASES.length));
  }, []);

  const c = CASES[i];
  const h = HORIZON[c.horizon];
  const next = () => {
    let n = Math.floor(Math.random() * CASES.length);
    if (n === i) n = (n + 1) % CASES.length;
    setI(n);
  };

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          What can a programmable network do? — tap for another
        </span>
        <button
          onClick={next}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Shuffle className="h-3 w-3" /> another
        </button>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl leading-none shrink-0" aria-hidden="true">{c.emoji}</div>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${h.cls}`}>
                {h.label}
              </span>
              <span className="rounded-full border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                {c.cap}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
              {c.title}
            </h4>
            <p className="mt-1.5 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              {c.story}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
