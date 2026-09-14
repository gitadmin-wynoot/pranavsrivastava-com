"use client";

import { FileText, RotateCcw } from "lucide-react";
import type { Slo } from "./types";
import s from "./resolution-screen.module.css";

const CONTRACT: { key: keyof Omit<Slo, "passed">; label: string }[] = [
  { key: "latency", label: "Speed" },
  { key: "reliability", label: "Success" },
  { key: "cost", label: "Cost" },
  { key: "quality", label: "Quality" },
  { key: "safety", label: "Safety" },
];

const COPY = {
  won: { icon: "🏔️", headline: "You made it — and it held up." },
  partial: { icon: "🏔️", headline: "You made it to the top." },
  lost: { icon: "💥", headline: "Mission failed." },
} as const;

export function ResolutionScreen({ tier, reason, slo, onViewDebrief, onPlayAgain }: {
  tier: "won" | "partial" | "lost"; reason: string; slo: Slo; onViewDebrief: () => void; onPlayAgain: () => void;
}) {
  const copy = COPY[tier];
  return (
    <div className={s.overlay} data-tier={tier} role="alertdialog" aria-modal="true" aria-label="Expedition result">
      <div className={s.card} data-tier={tier}>
        <div className={s.icon} aria-hidden="true">{copy.icon}</div>
        <h2 className={s.headline}>{copy.headline}</h2>
        <p className={s.reason}>{reason}</p>
        <div className={s.contract} aria-label="Expedition contract, met or not">
          {CONTRACT.map((item) => <span key={item.key} className={s.chip} data-met={slo[item.key]} title={`${item.label}: ${slo[item.key] ? "on target" : "missed"}`}>{item.label[0]}</span>)}
        </div>
        <div className={s.actions}>
          <button className={s.primary} onClick={onPlayAgain}><RotateCcw size={14} aria-hidden="true" /> Play again</button>
          <button className={s.secondary} onClick={onViewDebrief}><FileText size={14} aria-hidden="true" style={{ marginRight: 7, verticalAlign: "-2px" }} />View the full debrief</button>
        </div>
      </div>
    </div>
  );
}
