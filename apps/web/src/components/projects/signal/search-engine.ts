/** Deterministic classical AI search. No model, network, or hidden randomness. */
export type Terrain = "floor" | "wall" | "mud";
export type Strategy = "astar" | "dijkstra" | "weighted";
export interface Board {
  width: number;
  height: number;
  cells: Terrain[];
  start: number;
  goal: number;
}
export interface Candidate { id: number; g: number; h: number; f: number }
export interface Frame {
  current: Candidate | null;
  frontier: Candidate[];
  closed: number[];
  scores: Record<number, number>;
  path: number[];
  changed: number[];
  status: "searching" | "found" | "blocked";
}
export interface Mission {
  name: string;
  subtitle: string;
  brief: string;
  lesson: string;
  map: string[];
}

export const MISSIONS: Mission[] = [
  {
    name: "First contact",
    subtitle: "Learn to think ahead",
    brief: "A broken relay stands between you and the signal. Plot a route from S to G, then let the AI show its work. Can you match the cheapest route?",
    lesson: "The route that looks closest can still need a detour. A* combines what a route has cost with an optimistic guess of what remains.",
    map: [
      "...........", ".....#.....", ".....#.....", ".....#.....",
      ".S...#...G.", ".....#.....", "...........", "...........", "...........",
    ],
  },
  {
    name: "The tempting shortcut",
    subtitle: "Catch the AI being wrong",
    brief: "Amber terrain costs 5 energy to enter. A longer walk can be cheaper. Find a good route, then try Overconfident AI and expose its expensive shortcut.",
    lesson: "Multiplying a lower bound by 3 can turn it into an overestimate. The search may rush toward the goal and miss a cheaper path.",
    map: [
      "...........", "...........", "...........", "...........",
      ".S...mm..G.", "...........", "...........", "...........", "...........",
    ],
  },
  {
    name: "Into the unknown",
    subtitle: "Put the theorem to work",
    brief: "Thread the relay corridors. Find a route, compare both careful strategies, and verify the result. Then open the sandbox and build your own challenge.",
    lesson: "Dijkstra expands by cost so far. A* adds a safe estimate. Both guarantee minimum energy here, though their search footprints can differ.",
    map: [
      "...#.......", "...#..#....", "......#....", ".####.#.m..",
      ".S....#..G.", "...m..#.#..", "...#....#..", "...#.####..", "...........",
    ],
  },
];

export function makeBoard(mission: number): Board {
  const map = MISSIONS[mission].map;
  const flat = map.join("");
  return {
    width: map[0].length, height: map.length,
    start: flat.indexOf("S"), goal: flat.indexOf("G"),
    cells: [...flat].map(c => c === "#" ? "wall" : c === "m" ? "mud" : "floor"),
  };
}

export function neighbours(board: Board, id: number): number[] {
  const x = id % board.width;
  const y = Math.floor(id / board.width);
  return [[x + 1, y], [x, y - 1], [x, y + 1], [x - 1, y]]
    .filter(([cx, cy]) => cx >= 0 && cx < board.width && cy >= 0 && cy < board.height)
    .map(([cx, cy]) => cy * board.width + cx)
    .filter(next => board.cells[next] !== "wall");
}

export function energy(board: Board, id: number): number {
  return board.cells[id] === "mud" ? 5 : 1;
}

export function manhattan(board: Board, id: number): number {
  return Math.abs(id % board.width - board.goal % board.width)
    + Math.abs(Math.floor(id / board.width) - Math.floor(board.goal / board.width));
}

export function coordinate(board: Board, id: number): string {
  return `${String.fromCharCode(65 + id % board.width)}${Math.floor(id / board.width) + 1}`;
}

export function routeCost(board: Board, path: number[]): number {
  return path.slice(1).reduce((cost, id) => cost + energy(board, id), 0);
}

export function validRoute(board: Board, path: number[]): boolean {
  return path[0] === board.start && path[path.length - 1] === board.goal
    && path.every((id, i) => i === 0 || neighbours(board, path[i - 1]).includes(id));
}

export function search(board: Board, strategy: Strategy): Frame[] {
  const weight = strategy === "dijkstra" ? 0 : strategy === "weighted" ? 3 : 1;
  const scores: Record<number, number> = { [board.start]: 0 };
  const parents: Record<number, number> = {};
  const open = new Set([board.start]);
  const closed = new Set<number>();
  const candidate = (id: number): Candidate => ({ id, g: scores[id], h: weight * manhattan(board, id), f: scores[id] + weight * manhattan(board, id) });
  // Deterministic tie-break: lower f, then lower h, then row-major coordinate.
  const frontier = () => [...open].map(candidate).sort((a, b) => a.f - b.f || a.h - b.h || a.id - b.id);
  const frames: Frame[] = [{ current: null, frontier: frontier(), closed: [], scores: { ...scores }, path: [], changed: [], status: "searching" }];
  while (open.size) {
    const current = frontier()[0];
    open.delete(current.id);
    closed.add(current.id);
    const changed: number[] = [];
    const path: number[] = [];
    if (current.id === board.goal) {
      let cursor = board.goal;
      path.push(cursor);
      while (cursor !== board.start) { cursor = parents[cursor]; path.unshift(cursor); }
    } else {
      for (const next of neighbours(board, current.id)) {
        const cost = current.g + energy(board, next);
        if (cost < (scores[next] ?? Infinity)) {
          scores[next] = cost;
          parents[next] = current.id;
          // Reopen improved nodes, including for the inconsistent weighted heuristic.
          closed.delete(next);
          open.add(next);
          changed.push(next);
        }
      }
    }
    const status = path.length ? "found" : open.size ? "searching" : "blocked";
    frames.push({ current, frontier: frontier(), closed: [...closed], scores: { ...scores }, path, changed, status });
    if (status !== "searching") break;
  }
  return frames;
}

/** Independent verifier: reverse Bellman-Ford relaxation, NOT another A* run.
 * d(u) = min over neighbours v of [cost of entering v + d(v)].
 * Nonnegative costs and at most |V|-1 edges in a shortest simple path.
 */
export function exactDistances(board: Board): number[] {
  const distances = board.cells.map(() => Infinity);
  distances[board.goal] = 0;
  for (let pass = 0; pass < board.cells.length - 1; pass++) {
    let changed = false;
    for (let id = 0; id < board.cells.length; id++) {
      if (board.cells[id] === "wall" || id === board.goal) continue;
      for (const next of neighbours(board, id)) {
        const cost = energy(board, next) + distances[next];
        if (cost < distances[id]) { distances[id] = cost; changed = true; }
      }
    }
    if (!changed) break;
  }
  return distances;
}

export function auditHeuristic(board: Board, strategy: Strategy, distances: number[]) {
  const weight = strategy === "dijkstra" ? 0 : strategy === "weighted" ? 3 : 1;
  const violations = board.cells.flatMap((cell, id) => cell !== "wall" && weight * manhattan(board, id) > distances[id] ? [id] : []);
  let edges = 0;
  let inconsistent = 0;
  board.cells.forEach((cell, id) => {
    if (cell === "wall") return;
    for (const next of neighbours(board, id)) {
      edges++;
      if (weight * manhattan(board, id) > energy(board, next) + weight * manhattan(board, next)) inconsistent++;
    }
  });
  return { violations, edges, inconsistent };
}
