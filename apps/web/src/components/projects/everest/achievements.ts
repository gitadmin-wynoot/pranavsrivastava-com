import { SCENARIOS, STAGES } from "./content";
import type { Architecture, DecisionRecord, Metrics } from "./types";

/**
 * Small, honest badges — no coins or XP. Each one is earned by a real, checkable
 * architecture decision, and the label doubles as the one-line lesson.
 */
export type Achievement = { id: string; label: string; blurb: string; icon: string };

export const ACHIEVEMENTS: Achievement[] = [
  { id: "quick-thinker", label: "Quick Thinker", blurb: "You picked a fix during your first incident instead of freezing up.", icon: "⚡" },
  { id: "smart-fix", label: "Smart Fix", blurb: "You chose the mitigation the AI itself would have recommended.", icon: "🧠" },
  { id: "no-infinite-retries", label: "No Infinite Retries", blurb: "You kept retries small and spaced out instead of hammering a broken service.", icon: "🔁" },
  { id: "graceful-degradation", label: "Graceful Degradation", blurb: "You turned on a fallback, so the system kept working — just a little humbler.", icon: "🪂" },
  { id: "least-privilege", label: "Least Privilege", blurb: "You kept AI agents from having more power than they actually need.", icon: "🔒" },
  { id: "cost-aware", label: "Cost-Aware Architect", blurb: "You kept the run under budget while it was still working well.", icon: "💰" },
  { id: "summit", label: "Summit!", blurb: "You reached the top of Everest.", icon: "🏔️" },
];

const ALL_CHOICES = [...STAGES.flatMap((stage) => stage.choices), ...SCENARIOS.flatMap((scenario) => scenario.choices)];
const isRecommended = (id: string) => ALL_CHOICES.some((choice) => choice.id === id && choice.recommended);

export function qualifiedAchievements(ctx: { architecture: Architecture; metrics: Metrics; decisions: DecisionRecord[]; stageIndex: number }): string[] {
  const earned: string[] = [];
  if (ctx.decisions.some((d) => d.incidentId)) earned.push("quick-thinker");
  if (ctx.decisions.some((d) => d.incidentId && isRecommended(d.id))) earned.push("smart-fix");
  if (ctx.architecture.retries <= 2 && ctx.architecture.retryStrategy === "backoff") earned.push("no-infinite-retries");
  if (ctx.architecture.fallbackEnabled) earned.push("graceful-degradation");
  if (ctx.architecture.toolPermissions !== "unrestricted") earned.push("least-privilege");
  if (ctx.metrics.slo.cost) earned.push("cost-aware");
  if (ctx.stageIndex >= STAGES.length - 1) earned.push("summit");
  return earned;
}
