"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";

// "Listen to this post" — browser speech synthesis. No API key, no cost.
// Fixed to "Google UK English Male" where available (Chrome / Edge); other
// browsers fall back to the best male voice they have so it never breaks.
// Skips code/diagrams/tables and chunks by sentence (Chrome cuts off long ones).
type PlayState = "idle" | "playing" | "paused";

const PREFERRED_VOICE = "Google UK English Male";
const MALE = /daniel|alex|aaron|tom|reed|oliver|arthur|fred|guy|davis|\bmale\b/i;
const FEMALE = /samantha|karen|moira|tessa|victoria|fiona|aria|jenny|zira|susan|ava|female/i;

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const en = voices.filter((v) => /^en/i.test(v.lang));
  return (
    en.find((v) => v.name === PREFERRED_VOICE) ??
    en.find((v) => MALE.test(v.name) && !FEMALE.test(v.name)) ??
    en.find((v) => /^en[-_]?gb/i.test(v.lang)) ??
    en[0] ??
    null
  );
}

export function ArticleListen({ targetId = "article-body" }: { targetId?: string }) {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<PlayState>("idle");
  const [rate, setRate] = useState(1);

  const chunks = useRef<string[]>([]);
  const session = useRef(0);
  const rateRef = useRef(1);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const load = () => {
      const v = pickVoice(window.speechSynthesis.getVoices());
      if (v) voiceRef.current = v;
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  const buildChunks = useCallback(() => {
    const el = document.getElementById(targetId);
    if (!el) return [];
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("pre, figure, .code-block, table").forEach((n) => n.remove());
    const text = (clone.innerText || "").replace(/\s+/g, " ").trim();
    const sentences = text.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) ?? [text];
    const out: string[] = [];
    let cur = "";
    for (const s of sentences) {
      if ((cur + s).length > 220) {
        if (cur.trim()) out.push(cur.trim());
        cur = s;
      } else cur += s;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }, [targetId]);

  const speakFrom = useCallback((i: number, mySession: number) => {
    if (mySession !== session.current) return;
    if (i >= chunks.current.length) {
      setState("idle");
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks.current[i]);
    if (voiceRef.current) u.voice = voiceRef.current;
    u.rate = rateRef.current;
    u.onend = () => speakFrom(i + 1, mySession);
    window.speechSynthesis.speak(u);
  }, []);

  function play() {
    if (state === "paused") {
      window.speechSynthesis.resume();
      setState("playing");
      return;
    }
    window.speechSynthesis.cancel();
    chunks.current = buildChunks();
    if (chunks.current.length === 0) return;
    session.current += 1;
    setState("playing");
    speakFrom(0, session.current);
  }

  function pause() {
    window.speechSynthesis.pause();
    setState("paused");
  }

  function stop() {
    session.current += 1;
    window.speechSynthesis.cancel();
    setState("idle");
  }

  if (!supported) return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-1 pr-2 text-sm">
      {state === "playing" ? (
        <button
          onClick={pause}
          aria-label="Pause"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Pause className="w-3.5 h-3.5" /> Pause
        </button>
      ) : (
        <button
          onClick={play}
          aria-label={state === "paused" ? "Resume" : "Listen to this post"}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {state === "paused" ? <Play className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          {state === "paused" ? "Resume" : "Listen"}
        </button>
      )}

      {state !== "idle" && (
        <>
          <button
            onClick={stop}
            aria-label="Stop"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Square className="w-3 h-3" />
          </button>
          <select
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            aria-label="Playback speed"
            className="bg-transparent text-xs text-zinc-500 dark:text-zinc-400 focus:outline-none cursor-pointer"
          >
            <option value={0.9}>0.9×</option>
            <option value={1}>1×</option>
            <option value={1.15}>1.15×</option>
            <option value={1.3}>1.3×</option>
          </select>
        </>
      )}
    </div>
  );
}
