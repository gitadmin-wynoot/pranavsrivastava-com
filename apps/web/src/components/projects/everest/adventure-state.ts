import { DEFAULT_ARCHITECTURE, normalizeArchitecture, simulate } from "./engine";
import { PATHS, QUESTS, dailySeed, getQuest } from "./live-learning";
import type { Architecture, DecisionRecord, HistoryEvent } from "./types";

export type AdventureRun = {
  version: 1;
  missionId: string;
  seed: number;
  day: string;
  questIds: string[];
  step: number;
  completed: string[];
  selectedOptionId: string | null;
  baseline: Architecture;
  architecture: Architecture;
  decisions: DecisionRecord[];
  history: HistoryEvent[];
  finished: boolean;
};

export function currentQuest(run: AdventureRun) { return QUESTS.find(q => q.id === run.questIds[run.step])!; }
export function buildAdventure(missionId: string, seed: number, day: string, learnedIds: string[] = []): AdventureRun {
  const path = PATHS.find(p => p.id === missionId) ?? PATHS[0];
  const daily = missionId === "daily";
  const runSeed = daily ? dailySeed(day) : seed >>> 0;
  const stages = daily ? [runSeed % 3, 3 + ((runSeed >>> 3) % 3), 6 + ((runSeed >>> 6) % 4)] : Array.from({ length: 10 }, (_, i) => i);
  // A daily route is identical for everyone on the same day. Other routes favour unseen lessons.
  const questIds = stages.map(i => getQuest(i, runSeed + (daily ? 0 : path.seedSalt), daily ? [] : learnedIds).id);
  const first = QUESTS.find(q => q.id === questIds[0])!;
  const architecture = normalizeArchitecture({ ...DEFAULT_ARCHITECTURE, ...path.setup, ...first.setup });
  return { version: 1, missionId: daily ? "daily" : path.id, seed: runSeed, day, questIds, step: 0, completed: [], selectedOptionId: null, baseline: architecture, architecture, decisions: [], history: [{ at: 0, message: `Mission started: ${daily ? "Today's mini-climb" : path.title}. Each camp is a controlled experiment.` }], finished: false };
}

export function buildPractice(questId: string, seed: number, day: string): AdventureRun {
  const quest = QUESTS.find(q => q.id === questId) ?? QUESTS[0];
  const run = buildAdventure(PATHS[0].id, seed, day);
  const architecture = normalizeArchitecture({ ...DEFAULT_ARCHITECTURE, ...quest.setup });
  return { ...run, missionId: "practice", questIds: [quest.id], baseline: architecture, architecture, history: [{ at: 0, message: `Practice mission: ${quest.concept}.` }] };
}

export function tryOption(run: AdventureRun, optionId: string): AdventureRun {
  const quest = currentQuest(run);
  const option = quest.options.find(o => o.id === optionId);
  if (!option || run.finished || run.completed.includes(quest.id)) return run;
  // Every option is compared with the same checkpoint. Previous wrong attempts never poison the next test.
  const architecture = normalizeArchitecture({ ...run.baseline, ...option.patch });
  const before = simulate(run.baseline, run.seed, quest.incidentId);
  const after = simulate(architecture, run.seed, quest.incidentId);
  const at = (run.history.at(-1)?.at ?? 0) + 5;
  const stageId = ["training", "base", "icefall", "camp1", "camp2", "camp3", "lhotse", "camp4", "hillary", "summit"] as const;
  return { ...run, architecture, selectedOptionId: option.id, decisions: [...run.decisions, { id: option.id, stageId: stageId[quest.stageIndex], label: option.label, explanation: option.effect, at, incidentId: quest.incidentId, before, after }].slice(-100), history: [...run.history, { at, message: `${quest.title}: ${option.label}. ${option.effect}`, incidentId: quest.incidentId }].slice(-150) };
}

export function packLesson(run: AdventureRun): AdventureRun {
  const quest = currentQuest(run);
  if (run.finished || run.completed.includes(quest.id) || !quest.options.some(o => o.id === run.selectedOptionId && o.correct)) return run;
  return { ...run, completed: [...run.completed, quest.id], history: [...run.history, { at: (run.history.at(-1)?.at ?? 0) + 5, message: `Lesson packed: ${quest.concept}. ${quest.takeaway}`, incidentId: quest.incidentId }] };
}

export function advanceAdventure(run: AdventureRun): AdventureRun {
  if (run.finished || !run.completed.includes(currentQuest(run).id)) return run;
  if (run.step === run.questIds.length - 1) return { ...run, finished: true };
  const next = QUESTS.find(q => q.id === run.questIds[run.step + 1])!;
  // Carry the learner's design forward, then apply the next camp's stated challenge conditions.
  const baseline = normalizeArchitecture({ ...run.architecture, ...next.setup });
  return { ...run, step: run.step + 1, baseline, architecture: baseline, selectedOptionId: null, history: [...run.history, { at: (run.history.at(-1)?.at ?? 0) + 5, message: `Arrived at ${next.title}. ${next.story}`, incidentId: next.incidentId }] };
}

export function resetExperiment(run: AdventureRun): AdventureRun {
  if (run.finished || run.completed.includes(currentQuest(run).id)) return run;
  return { ...run, architecture: run.baseline, selectedOptionId: null };
}

/** Invalid or old save data is ignored; a restored route cannot jump over unfinished camps. */
export function normalizeAdventure(raw: unknown): AdventureRun | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Partial<AdventureRun>;
  if (v.version !== 1 || typeof v.missionId !== "string" || (!PATHS.some(p => p.id === v.missionId) && !["daily", "practice"].includes(v.missionId)) || typeof v.day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v.day) || !Number.isInteger(v.seed)) return null;
  if (!Array.isArray(v.questIds) || ![1,3,10].includes(v.questIds.length) || v.questIds.some(id => !QUESTS.some(q => q.id === id)) || new Set(v.questIds).size !== v.questIds.length) return null;
  if (!Number.isInteger(v.step) || v.step! < 0 || v.step! >= v.questIds.length) return null;
  const expectedLength = v.missionId === "daily" ? 3 : v.missionId === "practice" ? 1 : 10;
  if (v.questIds.length !== expectedLength) return null;
  const completed = Array.isArray(v.completed) ? v.completed.filter((id, i) => id === v.questIds![i]).slice(0, v.step! + 1) : [];
  if (completed.length < v.step!) return null;
  const quest = QUESTS.find(q => q.id === v.questIds![v.step!])!;
  const selectedOptionId = quest.options.some(o => o.id === v.selectedOptionId) ? v.selectedOptionId! : null;
  if (completed.includes(quest.id) && !quest.options.some(o => o.id === selectedOptionId && o.correct)) return null;
  const baseline = normalizeArchitecture(v.baseline && typeof v.baseline === "object" ? v.baseline : {});
  const option = quest.options.find(o => o.id === selectedOptionId);
  const architecture = normalizeArchitecture({ ...baseline, ...(option?.patch ?? {}) });
  const metricsValid = (x: unknown) => !!x && typeof x === "object" && ["p95", "p50", "quality", "reliability", "safety", "costPerRequest", "totalCost", "completed"].every(key => Number.isFinite((x as Record<string, unknown>)[key]));
  const decisions = Array.isArray(v.decisions) ? v.decisions.filter(d => d && typeof d.id === "string" && typeof d.label === "string" && typeof d.explanation === "string" && Number.isFinite(d.at) && metricsValid(d.before) && metricsValid(d.after)).slice(-100) : [];
  const history = Array.isArray(v.history) ? v.history.filter(h => h && typeof h.message === "string" && Number.isFinite(h.at)).slice(-150) : [];
  return { version: 1, missionId: v.missionId, seed: v.seed! >>> 0, day: v.day, questIds: v.questIds, step: v.step!, completed, selectedOptionId, baseline, architecture, decisions, history, finished: v.finished === true && completed.length === v.questIds.length };
}
