"use client";

import { Bot, CheckCircle2, Flame, Radio, User } from "lucide-react";
import { STAGES } from "./content";
import { ACHIEVEMENTS } from "./achievements";
import s from "./live-hud.module.css";

const clock = (n: number) => {
  const seconds = Math.max(0, Math.floor(n));
  return `T+${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

const PIPELINE = [
  { label: "Request", icon: User, caption: "A request comes in — someone needs an answer." },
  { label: "AI Agent", icon: Bot, caption: "An AI agent looks at it and decides what to do." },
  { label: "MCP Server", icon: Radio, caption: "The agent asks an MCP server for real information." },
  { label: "Answer", icon: CheckCircle2, caption: "The agent puts it together and answers." },
];

export function LiveHud({ stageIndex, elapsedAt, paused, incidentTitle, feed, earned, agentCount }: {
  stageIndex: number; elapsedAt: number; paused: boolean; incidentTitle?: string | null; feed: string[]; earned: string[]; agentCount: number;
}) {
  const summited = stageIndex === STAGES.length - 1 && !incidentTitle;
  const tone = incidentTitle ? "incident" : summited ? "summit" : paused ? "paused" : "climbing";
  const headline = incidentTitle ? `Uh oh: ${incidentTitle}` : summited ? "You reached the top! 🎉" : paused ? "Climb paused." : `Climbing toward ${STAGES[Math.min(stageIndex + 1, STAGES.length - 1)].name}.`;
  const sub = incidentTitle ? "Something broke. Pick a fix on the right — or clear it and see what happens." : summited ? "Open the debrief to see the whole story." : paused ? "Press the button below to keep going." : `Right now: ${STAGES[stageIndex].name}, ${STAGES[stageIndex].altitude}.`;

  const pipelineIndex = incidentTitle ? 2 : paused ? -1 : Math.floor(elapsedAt / 4) % PIPELINE.length;
  const pipelineCaption = incidentTitle ? "The agent is stuck talking to a server — that's the problem!" : paused ? "Everything is paused. Nothing is moving right now." : PIPELINE[pipelineIndex]?.caption ?? PIPELINE[0].caption;

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

      <div className={s.pipeline} aria-label="What is happening right now">
        {PIPELINE.map((step, i) => (
          <div key={step.label} className={s.pipeStep} data-active={i === pipelineIndex} data-trouble={i === pipelineIndex && Boolean(incidentTitle)}>
            <step.icon size={15} aria-hidden="true" />
            <span>{step.label}</span>
          </div>
        ))}
        <p className={s.pipeCaption}>{pipelineCaption} <em>{agentCount} AI agent{agentCount === 1 ? "" : "s"} on this climb.</em></p>
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

      <div className={s.badges} aria-label="Badges earned this run">
        {earned.length === 0 ? <span className={s.badgeHint}>🏅 Fix an incident well to earn your first badge.</span> : ACHIEVEMENTS.filter((a) => earned.includes(a.id)).map((a) => (
          <span key={a.id} className={s.badgePill} title={a.blurb}>{a.icon} {a.label}</span>
        ))}
      </div>
    </div>
  );
}
