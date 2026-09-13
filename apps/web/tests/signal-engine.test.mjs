import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Execute the actual engine with the workspace compiler; no extra test dependency.
const source = readFileSync(new URL("../src/components/projects/signal/search-engine.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
const engine = {};
new Function("exports", compiled.outputText)(engine);
const { makeBoard, search, routeCost, validRoute, exactDistances, auditHeuristic, neighbours, energy, manhattan } = engine;
const last = frames => frames[frames.length - 1];

// Independent dense all-pairs oracle (Floyd–Warshall), including directed entry costs.
function oracle(board) {
  const size = board.cells.length;
  const d = Array.from({ length: size }, (_, i) => Array.from({ length: size }, (_, j) => i === j ? 0 : Infinity));
  for (let i = 0; i < size; i++) {
    if (board.cells[i] === "wall") continue;
    for (let j = 0; j < size; j++) {
      if (board.cells[j] === "wall") continue;
      const distance = Math.abs(i % board.width - j % board.width) + Math.abs(Math.floor(i / board.width) - Math.floor(j / board.width));
      if (distance === 1) d[i][j] = board.cells[j] === "mud" ? 5 : 1;
    }
  }
  for (let k = 0; k < size; k++) for (let i = 0; i < size; i++) for (let j = 0; j < size; j++) d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
  return d;
}

test("all missions are solvable and careful AI routes satisfy the minimum-energy objective", () => {
  for (let mission = 0; mission < 3; mission++) {
    const board = makeBoard(mission);
    const optimum = exactDistances(board)[board.start];
    assert.ok(Number.isFinite(optimum));
    for (const strategy of ["astar", "dijkstra"]) {
      const frames = search(board, strategy);
      const result = last(frames);
      assert.equal(result.status, "found");
      assert.ok(validRoute(board, result.path));
      assert.equal(routeCost(board, result.path), optimum);
      const audit = auditHeuristic(board, strategy, exactDistances(board));
      assert.equal(audit.violations.length, 0);
      assert.equal(audit.inconsistent, 0);
      assert.equal(frames[0].closed.length, 0, "later decisions must not mutate the initial snapshot");
      for (let i = 1; i < frames.length; i++) {
        assert.equal(frames[i].current.id, frames[i - 1].frontier[0].id, "explanation must match the actual lowest-priority selection");
        assert.equal(frames[i].current.g + frames[i].current.h, frames[i].current.f);
      }
    }
  }
});

test("mission two is a genuine, reproducible counterexample to weighted A* optimality", () => {
  const board = makeBoard(1);
  const result = last(search(board, "weighted"));
  const optimum = exactDistances(board)[board.start];
  assert.equal(optimum, 10);
  assert.ok(validRoute(board, result.path));
  assert.ok(routeCost(board, result.path) > optimum);
  const audit = auditHeuristic(board, "weighted", exactDistances(board));
  assert.ok(audit.violations.length > 0);
  assert.ok(audit.inconsistent > 0);
});

test("blocked maps terminate without a fabricated path", () => {
  const board = { width: 3, height: 3, start: 0, goal: 8, cells: ["floor", "wall", "floor", "wall", "wall", "floor", "floor", "floor", "floor"] };
  assert.equal(exactDistances(board)[0], Infinity);
  for (const strategy of ["astar", "dijkstra", "weighted"]) {
    const result = last(search(board, strategy));
    assert.equal(result.status, "blocked");
    assert.deepEqual(result.path, []);
    assert.deepEqual(result.frontier, []);
  }
});

test("costs count destination terrain, exclude start, and reject diagonal or disconnected human routes", () => {
  const board = { width: 2, height: 2, start: 0, goal: 3, cells: ["mud", "mud", "floor", "floor"] };
  assert.equal(routeCost(board, [0, 1, 3]), 6);
  assert.equal(routeCost(board, [0, 2, 3]), 2);
  assert.equal(validRoute(board, [0, 3]), false);
  assert.equal(validRoute(board, [0, 1]), false);
  assert.equal(validRoute(board, [0, 2, 3]), true);
  assert.deepEqual(neighbours(board, 1), [3, 0]);
  assert.equal(energy(board, 1), 5);
  assert.equal(manhattan(board, 0), 2);
});

test("every wall arrangement on a 3×3 grid agrees with the independent oracle", () => {
  for (let mask = 0; mask < 128; mask++) {
    const cells = Array.from({ length: 9 }, (_, id) => id > 0 && id < 8 && (mask & (1 << (id - 1))) ? "wall" : "floor");
    const board = { width: 3, height: 3, start: 0, goal: 8, cells };
    const expected = oracle(board);
    const exact = exactDistances(board);
    for (let i = 0; i < 9; i++) if (cells[i] !== "wall") assert.equal(exact[i], expected[i][8]);
    for (const strategy of ["astar", "dijkstra"]) {
      const result = last(search(board, strategy));
      assert.equal(result.status, Number.isFinite(expected[0][8]) ? "found" : "blocked");
      if (result.status === "found") assert.equal(routeCost(board, result.path), expected[0][8]);
    }
  }
});

test("weighted random maps: verifier and safe strategies agree with an independent all-pairs oracle", () => {
  let seed = 713;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; };
  for (let trial = 0; trial < 120; trial++) {
    const cells = Array.from({ length: 20 }, () => { const r = random(); return r < .22 ? "wall" : r < .47 ? "mud" : "floor"; });
    cells[0] = cells[19] = "floor";
    const board = { width: 5, height: 4, start: 0, goal: 19, cells };
    const expected = oracle(board);
    const distances = exactDistances(board);
    for (let i = 0; i < cells.length; i++) if (cells[i] !== "wall") assert.equal(distances[i], expected[i][19]);
    for (const strategy of ["astar", "dijkstra", "weighted"]) {
      const result = last(search(board, strategy));
      assert.equal(result.status, Number.isFinite(expected[0][19]) ? "found" : "blocked");
      if (result.status === "found") {
        assert.ok(validRoute(board, result.path));
        if (strategy !== "weighted") assert.equal(routeCost(board, result.path), expected[0][19]);
      }
    }
  }
});
