import { MCP_SERVERS, MCP_TOOLS } from "@/lib/everest-mcp";
import { SCENARIOS, STAGES } from "./content";
import type { Scenario, StageId } from "./types";

function stageIndexOf(id: StageId): number { return STAGES.findIndex((s) => s.id === id); }

/** Calm at the trailhead; genuinely risky by the death zone. One roll per tick. */
const INCIDENT_CHANCE = [0, 0.03, 0.18, 0.2, 0.22, 0.26, 0.3, 0.32, 0.24, 0];
export function incidentChance(stageIndex: number): number {
  return INCIDENT_CHANCE[Math.min(Math.max(stageIndex, 0), INCIDENT_CHANCE.length - 1)];
}

/** Only scenarios reachable at or just behind the climber's current altitude, and not yet seen this run. */
export function pickNextIncident(stageIndex: number, used: string[], rng: () => number): Scenario | null {
  const reachable = SCENARIOS.filter((s) => !used.includes(s.id) && stageIndexOf(s.stageId) <= stageIndex);
  if (!reachable.length) return null;
  return reachable[Math.floor(rng() * reachable.length)] ?? null;
}

/** Short, true-to-the-system radio chatter — real tool and agent names, no invented jargon. */
export function chatterLine(stageIndex: number, rng: () => number): string {
  const tool = MCP_TOOLS[Math.floor(rng() * MCP_TOOLS.length)];
  const server = MCP_SERVERS.find((candidate) => candidate.id === tool.server)!;
  const here = STAGES[Math.min(Math.max(stageIndex, 0), STAGES.length - 1)].name;
  const templates = [
    `${server.agent} calls ${tool.name}() on the ${server.name.toLowerCase()} server.`,
    `Lead Sherpa delegates a check to ${server.agent}.`,
    `${server.agent} reports back near ${here}.`,
    `Route Sherpa retrieves the next relevant note for the climb ahead.`,
    `${server.agent} validates the last response before passing it upstream.`,
  ];
  return templates[Math.floor(rng() * templates.length)];
}

/** A short, varied line for reaching a new camp — avoids the same sentence every time. */
export function arrivalLine(stageIndex: number, rng: () => number): string {
  const name = STAGES[stageIndex].name;
  const templates = [
    `The team reaches ${name}.`,
    `Sherpas and requests both arrive at ${name}.`,
    `${name} in sight — the cohort presses on.`,
  ];
  return templates[Math.floor(rng() * templates.length)];
}
