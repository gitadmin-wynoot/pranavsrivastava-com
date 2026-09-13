/** Bayesian rescue simulator. Exactly one station contains the signal. */
export const STATIONS = ["Aster", "Boreal", "Cygnus"];
export interface Sensor { sensitivity: number; falseAlarm: number }
export interface Scenario {
  title: string; lesson: string; brief: string; prior: number[];
  sensor: Sensor; scanCost: number; budget: number; seed: number;
}
export const SCENARIOS: Scenario[] = [
  { title: "The false alarm", lesson: "A positive signal is not an 80% certainty.", brief: "Most rescuers would guess the beacon isn't at Aster — it starts out the least likely spot. But scan it anyway, and watch: the detector can still \"hear\" a ping there even when nothing's there. Make your own guess first, then see what the math actually says.", prior: [.1, .45, .45], sensor: { sensitivity: .8, falseAlarm: .2 }, scanCost: 8, budget: 4, seed: 9 },
  { title: "The echo chamber", lesson: "Repeated evidence is not independent evidence.", brief: "All three stations start out equally likely. Scan one, then press \"Replay last packet\" to look at that exact same clue again. Does hearing it twice make you more sure? A careless helper might think so — this scenario shows you why that's a trap.", prior: [1 / 3, 1 / 3, 1 / 3], sensor: { sensitivity: .85, falseAlarm: .15 }, scanCost: 6, budget: 4, seed: 42 },
  { title: "The price of certainty", lesson: "More clues aren't always worth their cost.", brief: "Aster is already the top suspect — but this sensor is shaky, and every scan costs a hefty 12 points. Is it worth scanning again just to feel extra sure, or is it smarter to call the rescue now? This one's about knowing when \"good enough\" beats \"perfect.\"", prior: [.8, .1, .1], sensor: { sensitivity: .7, falseAlarm: .3 }, scanCost: 12, budget: 4, seed: 81 },
];
export function likelihood(hidden: number, scanned: number, positive: boolean, sensor: Sensor) {
  const p = hidden === scanned ? sensor.sensitivity : sensor.falseAlarm;
  return positive ? p : 1 - p;
}
export function updateBelief(prior: number[], scanned: number, positive: boolean, sensor: Sensor) {
  const mass = prior.map((p, hidden) => p * likelihood(hidden, scanned, positive, sensor));
  const evidence = mass.reduce((sum, p) => sum + p, 0);
  return { posterior: mass.map(p => p / evidence), evidence, mass };
}
export function entropy(belief: number[]) {
  return -belief.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
}
export function informationGain(belief: number[], scanned: number, sensor: Sensor) {
  const yes = updateBelief(belief, scanned, true, sensor);
  const no = updateBelief(belief, scanned, false, sensor);
  return entropy(belief) - yes.evidence * entropy(yes.posterior) - no.evidence * entropy(no.posterior);
}
export function bestStation(belief: number[]) {
  return belief.indexOf(Math.max(...belief));
}

/** Bellman recursion evaluates ALL scan/outcome branches through the remaining
 * budget, then permits rescue at any stage. Utility: 100 on success, 0 on failure,
 * minus scan costs. This policy optimises expected score, not guaranteed success.
 */
export function plan(belief: number[], remaining: number, sensor: Sensor, scanCost: number) {
  function value(b: number[], k: number): number {
    const rescue = 100 * Math.max(...b);
    if (!k) return rescue;
    return Math.max(rescue, ...b.map((_, station) => scanValue(b, station, k)));
  }
  function scanValue(b: number[], station: number, k: number): number {
    const yes = updateBelief(b, station, true, sensor);
    const no = updateBelief(b, station, false, sensor);
    return -scanCost + yes.evidence * value(yes.posterior, k - 1) + no.evidence * value(no.posterior, k - 1);
  }
  const rescueValue = 100 * Math.max(...belief);
  const scanValues = belief.map((_, station) => remaining > 0 ? scanValue(belief, station, remaining) : -Infinity);
  const bestScan = scanValues.indexOf(Math.max(...scanValues));
  return { rescueValue, scanValues, bestScan, shouldScan: scanValues[bestScan] > rescueValue + 1e-9, rescueStation: bestStation(belief) };
}

// Separate seeded streams for the hidden station and each station's readings.
// A repeat run gives the same world and outcomes for the same sequence of scans.
function random(seed: number) {
  let n = seed | 0;
  n = Math.imul(n ^ (n >>> 16), 0x21f0aaad);
  n = Math.imul(n ^ (n >>> 15), 0x735a2d97);
  return ((n ^ (n >>> 15)) >>> 0) / 4294967296;
}
export function hiddenStation(prior: number[], seed: number) {
  const r = random(seed);
  let cumulative = 0;
  return prior.findIndex((p, i) => { cumulative += p; return r < cumulative || i === prior.length - 1; });
}
export function sensorReading(scenario: Scenario, seed: number, station: number, reading: number) {
  const hidden = hiddenStation(scenario.prior, seed);
  return random(seed + (station + 1) * 100003 + (reading + 1) * 7919) < likelihood(hidden, station, true, scenario.sensor);
}

export interface Packet { id: string; station: number; positive: boolean }
/** Duplicate packet IDs carry no new evidence. Fresh readings have new IDs. */
export function incorporate(belief: number[], packet: Packet, seen: string[], sensor: Sensor) {
  if (seen.includes(packet.id)) return { belief, seen, duplicate: true };
  return { belief: updateBelief(belief, packet.station, packet.positive, sensor).posterior, seen: [...seen, packet.id], duplicate: false };
}
