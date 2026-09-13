import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const engine = {};
new Function("exports", ts.transpileModule(readFileSync(new URL("../src/components/projects/signal/belief-engine.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText)(engine);
const { updateBelief, entropy, informationGain, plan, incorporate, SCENARIOS, sensorReading, hiddenStation } = engine;
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);

test("base-rate trap: an 80%-sensitive detector gives only 4/13 confidence after a rare-station ping", () => {
  const result = updateBelief([.1, .45, .45], 0, true, { sensitivity: .8, falseAlarm: .2 });
  near(result.evidence, .26);
  near(result.posterior[0], 4 / 13);
  near(result.posterior.reduce((a, b) => a + b, 0), 1);
});
test("Bayesian updates agree with independently enumerated joint probabilities for all preset reading pairs", () => {
  for (const scenario of SCENARIOS) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (const yes of [true, false]) for (const yes2 of [true, false]) {
    const weights = scenario.prior.map((p, hidden) => {
      const rateA = hidden === a ? scenario.sensor.sensitivity : scenario.sensor.falseAlarm;
      const rateB = hidden === b ? scenario.sensor.sensitivity : scenario.sensor.falseAlarm;
      return p * (yes ? rateA : 1 - rateA) * (yes2 ? rateB : 1 - rateB);
    });
    const sum = weights.reduce((a, b) => a + b, 0);
    const actual = updateBelief(updateBelief(scenario.prior, a, yes, scenario.sensor).posterior, b, yes2, scenario.sensor).posterior;
    actual.forEach((p, i) => near(p, weights[i] / sum));
  }
});
test("replaying a packet leaves belief unchanged; a fresh independent reading changes it", () => {
  const scenario = SCENARIOS[1];
  const packet = { id: "0-1", station: 0, positive: true };
  const first = incorporate(scenario.prior, packet, [], scenario.sensor);
  const duplicate = incorporate(first.belief, packet, first.seen, scenario.sensor);
  assert.equal(duplicate.duplicate, true);
  assert.strictEqual(duplicate.belief, first.belief);
  assert.equal(duplicate.seen.length, 1);
  const fresh = incorporate(first.belief, { ...packet, id: "0-2" }, first.seen, scenario.sensor);
  assert.ok(fresh.belief[0] > first.belief[0]);
});
test("an individual reading can increase entropy, while expected information gain stays nonnegative", () => {
  const scenario = SCENARIOS[2];
  const surprising = updateBelief(scenario.prior, 0, false, scenario.sensor);
  assert.ok(entropy(surprising.posterior) > entropy(scenario.prior));
  for (const s of SCENARIOS) for (let i = 0; i < 3; i++) assert.ok(informationGain(s.prior, i, s.sensor) >= -1e-12);
  near(informationGain([.2, .3, .5], 0, { sensitivity: .5, falseAlarm: .5 }), 0);
});
test("planner stops when information costs more than its decision value", () => {
  const scenario = SCENARIOS[2];
  const policy = plan(scenario.prior, 4, scenario.sensor, scenario.scanCost);
  assert.equal(policy.shouldScan, false);
  near(policy.rescueValue, 80);
  near(plan(scenario.prior, 1, scenario.sensor, 12).scanValues[0], 68);
  assert.ok(informationGain(scenario.prior, 0, scenario.sensor) > 0);
  assert.equal(plan(scenario.prior, 0, scenario.sensor, 0).shouldScan, false);
});
test("one-step planner matches a hand-calculated rescue tree", () => {
  const policy = plan([1 / 3, 1 / 3, 1 / 3], 1, { sensitivity: .8, falseAlarm: .2 }, 5);
  // Positive: .4 × 2/3 success. Negative: .6 × 4/9 success.
  near(policy.scanValues[0], 100 * (.4 * 2 / 3 + .6 * 4 / 9) - 5);
  assert.equal(policy.shouldScan, true);
});
test("seeded worlds and sensor readings are reproducible without coupling to scan order", () => {
  assert.notEqual(hiddenStation(SCENARIOS[0].prior, SCENARIOS[0].seed), 0);
  assert.equal(sensorReading(SCENARIOS[0], SCENARIOS[0].seed, 0, 0), true, "opening scenario must demonstrate a real false alarm");
  for (const scenario of SCENARIOS) {
    assert.ok([0, 1, 2].includes(hiddenStation(scenario.prior, scenario.seed)));
    for (let i = 0; i < 3; i++) for (let n = 0; n < 4; n++) assert.equal(sensorReading(scenario, scenario.seed, i, n), sensorReading(scenario, scenario.seed, i, n));
  }
});
