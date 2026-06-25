"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";

// "Listen to this post" — browser speech synthesis. No API key, no cost.
// Prefers a male, high-quality voice, and lets the reader pick another. Skips
// code/diagrams/tables and chunks by sentence (Chrome cuts off long utterances).
type PlayState = "idle" | "playing" | "paused";

const VOICE_KEY = "tts-voice";

// Heuristics — the API exposes no gender field, so we go by known voice names.
const MALE = /daniel|aaron|tom|reed|oliver|arthur|fred|alex|rishi|google uk english male|\bmale\b|guy|davis|tony|brandon|christopher|eric|roger|steffan|william|liam/i;
const FEMALE = /samantha|karen|moira|tessa|victoria|fiona|aria|jenny|zira|susan|allison|ava|serena|kate|female|sonia|libby|google us english$/i;
const QUALITY = /enhanced|premium|neural|natural|siri|online/i;

function score(v: SpeechSynthesisVoice): number {
  let s = 0;
  if (QUALITY.test(v.name)) s += 5;
  if (MALE.test(v.name)) s += 4;
  if (FEMALE.test(v.name)) s -= 4;
  if (/^en[-_]?gb/i.test(v.lang)) s += 2;
  else if (/^en[-_]?us/i.test(v.lang)) s += 1;
  if (v.localService) s += 1; // installed voices tend to be cleaner than remote fallbacks
  return s;
}

export function ArticleListen({ targetId = "article-body" }: { targetId?: string }) {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<PlayState>("idle");
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string>("");

  const chunks = useRef<string[]>([]);
  const session = useRef(0);
  const rateRef = useRef(1);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const voiceNameRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const saved = (() => {
      try {
        return localStorage.getItem(VOICE_KEY) ?? "";
      } catch {
        return "";
      }
    })();

    const load = () => {
      const en = window.speechSynthesis
        .getVoices()
        .filter((v) => /^en/i.test(v.lang))
        .sort((a, b) => score(b) - score(a));
      if (en.length === 0) return;
      voicesRef.current = en;
      setVoices(en);
      // Default to the saved choice if still available, else the best (male) voice.
      const initial = (saved && en.find((v) => v.name === saved)?.name) || en[0].name;
      voiceNameRef.current = initial;
      setVoiceName(initial);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  function chooseVoice(name: string) {
    voiceNameRef.current = name;
    setVoiceName(name);
    try {
      localStorage.setItem(VOICE_KEY, name);
    } catch {
      /* ignore */
    }
    // Restart so the new voice takes effect immediately if playing.
    if (state !== "idle") {
      stop();
      setTimeout(play, 60);
    }
  }

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
    const v = voicesRef.current.find((x) => x.name === voiceNameRef.current);
    if (v) u.voice = v;
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

      {/* Voice picker — pick the best one your device offers */}
      {voices.length > 0 && (
        <select
          value={voiceName}
          onChange={(e) => chooseVoice(e.target.value)}
          aria-label="Voice"
          title="Voice"
          className="max-w-[8rem] bg-transparent text-xs text-zinc-500 dark:text-zinc-400 focus:outline-none cursor-pointer truncate"
        >
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name.replace(/\s*\(.*\)$/, "")}
            </option>
          ))}
        </select>
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
