"use client";

import { Bot, CheckCircle2, Flame, Radio, User } from "lucide-react";
import { STAGES } from "./content";
import { ACHIEVEMENTS } from "./achievements";
import type { Metrics } from "./types";
import s from "./live-hud.module.css";
import shared from "./everest-simulator.module.css";

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

type LiveState = { stageIndex: number; elapsedAt: number; paused: boolean; incidentTitle?: string | null };

/** A single, minimal, floating line over the mountain — the mountain stays the view. */
export function LiveHud({ stageIndex, elapsedAt, paused, incidentTitle }: LiveState) {
  const summited = stageIndex === STAGES.length - 1 && !incidentTitle;
  const tone = incidentTitle ? "incident" : summited ? "summit" : paused ? "paused" : "climbing";
  const headline = incidentTitle ? `Uh oh: ${incidentTitle}` : summited ? "You reached the top! 🎉" : paused ? "Climb paused." : `Climbing toward ${STAGES[Math.min(stageIndex + 1, STAGES.length - 1)].name}.`;

  return (
    <div className={s.hud} aria-live="polite">
      <div className={s.strip}>
        <span className={s.badge}><Flame size={13} aria-hidden="true" /><span>LIVE</span></span>
        <strong className={s.stripHeadline} data-tone={tone}>{headline}</strong>
        <span className={s.clock}>{clock(elapsedAt)}</span>
      </div>
    </div>
  );
}

/** Everything else — the detail a curious player wants, kept in the side panel, not on the view. */
export function LiveSidePanel({ stageIndex, elapsedAt, paused, incidentTitle, feed, earned, agentCount, metrics }: LiveState & { feed: string[]; earned: string[]; agentCount: number; metrics: Metrics }) {
  const pipelineIndex = incidentTitle ? 2 : paused ? -1 : Math.floor(elapsedAt / 4) % PIPELINE.length;
  const pipelineCaption = incidentTitle ? "The agent is stuck talking to a server — that's the problem!" : paused ? "Everything is paused. Nothing is moving right now." : PIPELINE[pipelineIndex]?.caption ?? PIPELINE[0].caption;

  return (
    <div className={s.sidePanel}>
      <div className={s.pipeline} aria-label="What is happening right now">
        <span className={s.eyebrowSmall}>Right now</span>
        <div className={s.pipeRow}>
          {PIPELINE.map((step, i) => (
            <div key={step.label} className={s.pipeStep} data-active={i === pipelineIndex} data-trouble={i === pipelineIndex && Boolean(incidentTitle)}>
              <step.icon size={15} aria-hidden="true" />
              <span>{step.label}</span>
            </div>
          ))}
        </div>
        <p className={s.pipeCaption}>{pipelineCaption} <em>{agentCount} AI agent{agentCount === 1 ? "" : "s"} on this climb.</em></p>
      </div>

      <div aria-label="Live system parameters">
        <span className={s.eyebrowSmall}>Live parameters</span>
        <div className={shared.statsGrid}>
          {([
            ["p50 latency", `${(metrics.p50 / 1000).toFixed(2)} s`],
            ["Throughput", `${metrics.throughput.toFixed(1)} /s`],
            ["Queue", `${metrics.queueDepth} waiting`],
            ["Tool failures", `${metrics.toolFailureRate.toFixed(1)}%`],
            ["Cache hit rate", `${metrics.cacheHitRate}%`],
            ["Tokens / request", metrics.tokens.toLocaleString()],
          ] as const).map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}
        </div>
      </div>

      <div className={s.progress} aria-label={`Progress: camp ${stageIndex + 1} of ${STAGES.length}`}>
        {STAGES.map((stage, i) => (
          <div key={stage.id} className={s.dot} data-state={i < stageIndex ? "done" : i === stageIndex ? "current" : "upcoming"} title={stage.name} />
        ))}
      </div>

      {feed.length > 0 && (
        <div className={s.feed}>
          <span className={s.eyebrowSmall}>Radio chatter</span>
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
