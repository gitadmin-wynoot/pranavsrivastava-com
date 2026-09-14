"use client";

import { Flame, Radio } from "lucide-react";
import { STAGES } from "./content";
import s from "./live-hud.module.css";

const clock = (n: number) => {
  const seconds = Math.max(0, Math.floor(n));
  return `T+${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

export function LiveHud({ stageIndex, elapsedAt, paused, incidentTitle, feed }: {
  stageIndex: number; elapsedAt: number; paused: boolean; incidentTitle?: string | null; feed: string[];
}) {
  const summited = stageIndex === STAGES.length - 1 && !incidentTitle;
  const tone = incidentTitle ? "incident" : summited ? "summit" : paused ? "paused" : "climbing";
  const headline = incidentTitle ? `Incident: ${incidentTitle}` : summited ? "Summit reached." : paused ? "Climb paused." : `Climbing toward ${STAGES[Math.min(stageIndex + 1, STAGES.length - 1)].name}.`;
  const sub = incidentTitle ? "Choose a mitigation, or clear it and accept the consequence." : summited ? "Open the debrief to see how the run went." : paused ? "Resume when you're ready." : `Currently at ${STAGES[stageIndex].name}, ${STAGES[stageIndex].altitude}.`;

  return (
    <div className={s.hud} aria-live="polite">
      <div className={s.strip}>
        <span className={s.badge}><Flame size={13} aria-hidden="true" /><span>LIVE</span></span>
        <div className={s.state} data-tone={tone}>
          <strong>{headline}</strong>
          <small>{sub}</small>
        </div>
        <span className={s.clock}>{clock(elapsedAt)}</span>
      </div>
      <div className={s.progress} aria-label={`Progress: camp ${stageIndex + 1} of ${STAGES.length}`}>
        {STAGES.map((stage, i) => (
          <div key={stage.id} className={s.dot} data-state={i < stageIndex ? "done" : i === stageIndex ? "current" : "upcoming"} title={stage.name} />
        ))}
      </div>
      {feed.length > 0 && (
        <div className={s.feed}>
          {feed.map((line, i) => (
            <span key={`${i}-${line}`} className={s.feedLine}><Radio size={9} aria-hidden="true" style={{ marginRight: 5, verticalAlign: "-1px" }} />{line}</span>
          ))}
        </div>
      )}
    </div>
  );
}
