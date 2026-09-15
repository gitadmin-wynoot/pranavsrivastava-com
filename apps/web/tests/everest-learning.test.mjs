import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Test the shipped pure modules with the workspace compiler; no test-only engine copy.
function load(name) {
  const source = readFileSync(new URL(`../src/components/projects/everest/${name}.ts`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const result = {};
  new Function("exports", compiled.outputText)(result);
  return result;
}
const { QUESTS, PATHS, getQuest, dailySeed, emptyPassport, normalizePassport, recordLearning, knowledgeCounts, getLevel } = load("live-learning");
const { DEFAULT_ARCHITECTURE, simulate, normalizeArchitecture } = load("engine");
const { SCENARIOS } = load("content");
const metricsKeys = ["p50", "p95", "quality", "safety", "costPerRequest", "reliability", "tokens", "steps", "queueDepth", "throughput"];
const build = quest => ({ ...DEFAULT_ARCHITECTURE, ...quest.setup });
const evaluate = (quest, seed = 42) => {
  const before = simulate(build(quest), seed, quest.incidentId);
  const option = quest.options.find(item => item.correct);
  return { before, after: simulate({ ...build(quest), ...option.patch }, seed, quest.incidentId), option };
};

test("the curriculum has two complete, actionable quests at every camp", () => {
  assert.equal(QUESTS.length, 20);
  assert.equal(new Set(QUESTS.map(q => q.id)).size, 20);
  for (let stage = 0; stage < 10; stage++) assert.equal(QUESTS.filter(q => q.stageIndex === stage).length, 2);
  for (const quest of QUESTS) {
    for (const key of ["title", "concept", "story", "mission", "hint", "takeaway"]) assert.ok(quest[key].length >= 10, `${quest.id}: ${key}`);
    assert.equal(quest.options.filter(o => o.correct).length, 1, `${quest.id}: one task-appropriate choice`);
    assert.equal(new Set(quest.options.map(o => o.id)).size, quest.options.length);
    assert.equal(quest.recall.options.length, 3);
    assert.ok(Number.isInteger(quest.recall.answer) && quest.recall.answer >= 0 && quest.recall.answer < 3);
    assert.ok(quest.recall.explanation.length > 50);
    assert.ok(quest.fieldNote.length >= 2);
    assert.ok(quest.incidentId === null || SCENARIOS.some(s => s.id === quest.incidentId), `${quest.id}: incident exists`);
    assert.deepEqual(normalizeArchitecture(build(quest)), build(quest), `${quest.id}: setup is already valid`);
  }
});

test("all choices change actual engine values and replay identically under fixed conditions", () => {
  for (const seed of [0, 42, 89, 7109, dailySeed("2026-09-15")]) {
    for (const quest of QUESTS) {
      const architecture = build(quest);
      const baselineCopy = structuredClone(architecture);
      const before = simulate(architecture, seed, quest.incidentId);
      for (const option of quest.options) {
        const after = simulate({ ...architecture, ...option.patch }, seed, quest.incidentId);
        assert.deepEqual(after, simulate({ ...architecture, ...option.patch }, seed, quest.incidentId));
        assert.ok(metricsKeys.some(key => after[key] !== before[key]), `${quest.id}/${option.id}: dead experiment at seed ${seed}`);
        for (const key of metricsKeys) assert.ok(Number.isFinite(after[key]) && after[key] >= 0, `${quest.id}/${key}: finite non-negative result`);
        for (const key of ["quality", "safety", "reliability"]) assert.ok(after[key] <= 100);
        assert.ok(after.p95 >= after.p50);
        assert.ok(after.completed >= 0 && after.completed <= after.attempted);
      }
      assert.deepEqual(architecture, baselineCopy, `${quest.id}: engine never mutates experiment setup`);
    }
  }
});

test("model and training quests demonstrate capability versus runtime cost without pretending training runs per request", () => {
  const word = QUESTS.find(q => q.id === "word-builder");
  const { before, after } = evaluate(word);
  const largest = simulate({ ...build(word), ...word.options.find(o => !o.correct).patch }, 42);
  assert.ok(after.quality > before.quality);
  assert.ok(after.costPerRequest < largest.costPerRequest);
  assert.ok(after.p95 < largest.p95);
  const kit = QUESTS.find(q => q.id === "specialist-kit");
  const training = evaluate(kit);
  assert.ok(training.after.quality > training.before.quality);
  assert.equal(training.after.costPerRequest, training.before.costPerRequest, "adapter affects task quality; no invented per-request training charge");
  assert.match(kit.recall.explanation, /post-training/);
  assert.match(kit.recall.explanation, /not a safety button/);
  assert.match(kit.options[0].effect, /trained earlier/);
});

test("each correct action improves the stated learning target, including qualified recoveries", () => {
  const checks = {
    "test-the-tools": (b, a) => a.safety > b.safety && a.quality > b.quality,
    "fresh-release": (b, a) => a.safety > b.safety && a.reliability > b.reliability,
    "two-model-lanes": (b, a) => a.p95 < b.p95 && a.costPerRequest < b.costPerRequest,
    "crowded-ladder": (b, a) => a.queueDepth < b.queueDepth && a.throughput > b.throughput,
    "lighter-backpack": (b, a) => a.tokens < b.tokens && a.quality > b.quality,
    "yesterdays-weather": (b, a) => a.quality > b.quality && a.p50 > b.p50,
    "three-radio-checks": (b, a) => a.p95 < b.p95 && a.quality === b.quality,
    "stop-the-loop": (b, a) => a.steps < b.steps && a.tokens < b.tokens && a.reliability > b.reliability,
    "radio-menu": (b, a) => a.reliability > b.reliability && a.degraded,
    "one-reservation": (b, a) => a.safety > b.safety && a.safety === 100,
    "silent-station": (b, a) => a.p95 < b.p95 && a.reliability > b.reliability && a.circuitOpen && a.degraded,
    "find-the-slow-part": (b, a) => a.p95 < b.p95 && a.traces.find(t => t.id === "weather").duration < b.traces.find(t => t.id === "weather").duration,
    "bossy-route-note": (b, a) => a.safety > b.safety && a.safety === 100,
    "guides-disagree": (b, a) => a.safety > b.safety && a.quality > b.quality,
    "budget-with-quality": (b, a) => a.costPerRequest < b.costPerRequest && a.quality >= 90 && a.p95 < b.p95,
    "queue-budget": (b, a) => a.throughput > b.throughput && a.p95 < b.p95,
    "whole-expedition": (b, a) => a.p95 < b.p95 && a.costPerRequest < b.costPerRequest && a.slo.passed,
    "backup-promise": (b, a) => a.reliability > b.reliability && a.degraded && a.quality < 90,
  };
  assert.equal(Object.keys(checks).length, 18);
  for (const seed of [0, 42, 9909]) for (const [id, check] of Object.entries(checks)) {
    const quest = QUESTS.find(q => q.id === id);
    const { before, after } = evaluate(quest, seed);
    assert.ok(check(before, after), `${id}: correct action contradicts its learning target at seed ${seed}`);
  }
});

test("parallel tools really overlap and final validation remains after their results", () => {
  const { after } = evaluate(QUESTS.find(q => q.id === "three-radio-checks"));
  const calls = after.traces.filter(t => ["weather", "route", "logistics"].includes(t.id));
  assert.equal(new Set(calls.map(t => t.start)).size, 1);
  assert.ok(after.traces.find(t => t.id === "validation").start >= Math.max(...calls.map(t => t.start + t.duration)) - 1);
});

test("fresh variants are prioritised and seeded replay cannot be changed by irrelevant completion IDs", () => {
  for (let stage = 0; stage < 10; stage++) {
    const first = getQuest(stage, 42, []);
    assert.equal(getQuest(stage, 42, []).id, first.id);
    assert.equal(getQuest(stage, 42, ["unknown-quest"]).id, first.id);
    const second = getQuest(stage, 42, [first.id]);
    assert.notEqual(second.id, first.id);
    assert.equal(second.stageIndex, stage);
    const repeated = getQuest(stage, 42, [first.id, second.id]);
    assert.equal(repeated.id, first.id);
    const selected = new Set(Array.from({ length: 20 }, (_, seed) => getQuest(stage, seed, []).id));
    assert.equal(selected.size, 2, `stage ${stage}: both variants reachable by seed`);
  }
  assert.equal(getQuest(NaN, Infinity, []).stageIndex, 0);
  assert.equal(getQuest(999, 42, []).stageIndex, 9);
  assert.equal(getQuest(-999, 42, []).stageIndex, 0);
  assert.equal(PATHS.length, 3);
  assert.equal(new Set(PATHS.map(p => p.seedSalt)).size, 3);
  assert.equal(dailySeed("2026-09-15"), dailySeed("2026-09-15"));
  assert.notEqual(dailySeed("2026-09-15"), dailySeed("2026-09-16"));
  assert.equal(dailySeed("2026-02-30"), dailySeed("not-a-day"));
});

test("learning credit requires known quests and valid dates, and cannot be farmed on the same day", () => {
  const blank = emptyPassport();
  const first = recordLearning(blank, "word-builder", false, "2026-09-15");
  assert.equal(first.xp, 25);
  assert.deepEqual(blank, emptyPassport(), "recording never mutates old browser state");
  assert.deepEqual(first.stamps["word-builder"], { days: ["2026-09-15"], firstTryDays: [] });
  assert.deepEqual(recordLearning(first, "word-builder", true, "2026-09-15"), first, "a later duplicate cannot turn first-try failure into success");
  assert.deepEqual(recordLearning(first, "unknown", true, "2026-09-15"), first);
  assert.deepEqual(recordLearning(first, "word-builder", true, "2026-02-30"), first);
  assert.deepEqual(recordLearning(first, "word-builder", true, "yesterday"), first);
  let practiced = first;
  for (let pass = 0; pass < 50; pass++) for (const day of ["2026-09-16", "2026-09-17", "2026-09-18"]) practiced = recordLearning(practiced, "word-builder", true, day);
  assert.equal(practiced.xp, 75);
  assert.deepEqual(practiced.stamps["word-builder"].days, ["2026-09-15", "2026-09-16", "2026-09-17"]);
  assert.deepEqual(knowledgeCounts(practiced), { learned: 1, practised: 1, mastered: 1, stamps: 3, firstTry: 2, total: 20 });
});

test("invalid browser storage cannot inflate counters or inject unknown quest stamps", () => {
  for (const invalid of [null, undefined, [], "text", 7, { version: 99 }, { version: 1, stamps: [] }, { version: 1, stamps: null }]) assert.deepEqual(normalizePassport(invalid), emptyPassport());
  const dirty = {
    version: 1, xp: 999999999,
    stamps: {
      "word-builder": { days: ["2026-09-18", "invalid", "2026-09-15", "2026-09-15", "2026-02-30", "2026-09-17", "2026-09-16"], firstTryDays: ["2026-09-15", "2026-09-15", "2026-09-18", "invalid"] },
      "unknown-quest": { days: ["2026-09-15"], firstTryDays: ["2026-09-15"] },
      "specialist-kit": { days: "2026-09-15" },
      "test-the-tools": null,
    },
  };
  const result = normalizePassport(dirty);
  assert.equal(result.xp, 75);
  assert.deepEqual(Object.keys(result.stamps), ["word-builder"]);
  assert.deepEqual(result.stamps["word-builder"].days, ["2026-09-15", "2026-09-16", "2026-09-17"]);
  assert.deepEqual(result.stamps["word-builder"].firstTryDays, ["2026-09-15"]);
  assert.deepEqual(normalizePassport(JSON.parse(JSON.stringify(result))), result);
  const inherited = Object.create({ "word-builder": { days: ["2026-09-15"], firstTryDays: [] } });
  assert.equal(normalizePassport({ version: 1, stamps: inherited }).xp, 0);
});

test("levels and mastery are earned from capped learning stamps and remain bounded", () => {
  let passport = emptyPassport();
  for (const day of ["2026-09-15", "2026-09-16", "2026-09-17"]) for (const quest of QUESTS) passport = recordLearning(passport, quest.id, true, day);
  assert.equal(passport.xp, 1500);
  assert.deepEqual(knowledgeCounts(passport), { learned: 20, practised: 20, mastered: 20, stamps: 60, firstTry: 60, total: 20 });
  assert.equal(getLevel(passport).nextXp, null);
  assert.equal(getLevel(passport).progress, 1);
  assert.equal(getLevel(emptyPassport()).level, 1);
  assert.equal(getLevel({ ...emptyPassport(), xp: 1500 }).level, 1, "passport XP is never trusted without learning stamps");
  assert.equal(getLevel(NaN).xp, 0);
  assert.equal(getLevel(999999).xp, 1500);
  for (let xp = 0; xp <= 1500; xp += 25) {
    const level = getLevel(xp);
    assert.ok(level.progress >= 0 && level.progress <= 1);
    assert.ok(level.nextXp === null || level.nextXp > xp);
  }
});
