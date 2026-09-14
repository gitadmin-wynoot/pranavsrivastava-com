"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Compass, SkipForward } from "lucide-react";
import type { Mode } from "./types";
import s from "./mission-briefing.module.css";

/** Kept to one short idea per line — this is read out loud to a five-year-old as easily as to an engineer. */
const STORY_LINES = [
  "Hi. Welcome to Everest: AI in Production.",
  "Here's the idea: a team is climbing a real mountain.",
  "But this mountain is actually a picture of how AI computer systems work.",
  "You are the **boss of the AI helpers** — they're called agents, or Sherpas.",
  "They do the climbing. **You** decide how they're built and what they do.",
  "**GOAL:** get everyone safely to the top of the mountain.",
  "Along the way, things will break — a storm, a broken radio, a bad decision.",
  "When that happens, the climb pauses, and **you** pick how to fix it.",
  "**YOU WIN** if you reach the top with your team safe and working well.",
  "**YOU LOSE** if things break so badly the system can't recover.",
  "Ready?",
];

const SANDBOX_LINES = [
  "Welcome. This is a practice area — there's no way to lose here.",
  "Pick a problem, or change a setting, and watch what happens to the mountain.",
  "Try different fixes. Break things on purpose. That's the whole point.",
  "Take your time. Nothing here is timed or scored.",
  "Ready to look around?",
];

function parts(line: string) {
  return line.split(/\*\*(.+?)\*\*/g).map((chunk, i) => (i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk));
}

export function MissionBriefing({ mode, onDone }: { mode: Mode | null; onDone: () => void }) {
  const lines = mode === "incidents" || mode === "lab" || mode === "explore" ? SANDBOX_LINES : STORY_LINES;
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (finished) return;
    const current = lines[lineIndex];
    if (charCount < current.length) {
      timer.current = setTimeout(() => setCharCount((c) => c + 1), 16);
    } else if (lineIndex < lines.length - 1) {
      timer.current = setTimeout(() => { setLineIndex((i) => i + 1); setCharCount(0); }, 420);
    } else {
      setFinished(true);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [lineIndex, charCount, finished, lines]);

  function skip() {
    if (timer.current) clearTimeout(timer.current);
    setLineIndex(lines.length - 1);
    setCharCount(lines[lines.length - 1].length);
    setFinished(true);
  }

  return (
    <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Mission briefing">
      <div className={s.card}>
        <span className={s.eyebrow}><Compass size={13} aria-hidden="true" /> Mission briefing</span>
        <div className={s.lines}>
          {lines.slice(0, lineIndex + 1).map((line, i) => (
            <p key={i} className={s.line} data-shown="true">
              {i < lineIndex ? parts(line) : parts(line.slice(0, charCount))}
              {i === lineIndex && !finished && <span className={s.cursor} />}
            </p>
          ))}
        </div>
        <div className={s.actions}>
          <button className={s.skip} onClick={skip}><SkipForward size={12} aria-hidden="true" style={{ marginRight: 5, verticalAlign: "-1px" }} />Skip</button>
          <button className={s.go} onClick={onDone} disabled={!finished}>Let&apos;s go <ArrowRight size={14} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
