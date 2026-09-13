# Signal

The project lives here. Routes are under `src/app/projects/signal/`.

- `signal-game.tsx`, `search-engine.ts`: human route plotting, A*/Dijkstra/weighted A*, replay and an independent Bellman–Ford certificate.
- `belief-game.tsx`, `belief-engine.ts`: hidden-world rescue, Bayesian prediction, packet deduplication, expected information gain, and a finite-horizon Bellman planner.
- `chapter-nav.tsx`: navigation between the two learning chapters.

Both engines are pure TypeScript. The belief planner assumes exactly one hidden station, known sensor rates, conditionally independent fresh readings, at most four scans, and a success reward of 100 minus scan costs. Scenarios use seeded separate random streams per station. Replaying an existing packet never advances a stream or changes the posterior.

The UI distinguishes arithmetic certificates, mathematical guarantees under assumptions, and uncertain outcomes. Do not describe posterior probabilities as proof of the hidden world. Do not treat a single successful run as proof of an algorithm's guarantee or a model's calibration.

Run `pnpm --filter @pranav/web test:signal` from the repository root. Tests cover search optimality against an independent all-pairs oracle, the counterexample map, Bayesian joint-probability enumeration, duplicate evidence, entropy, and explicit decision-tree expectations.

Browser checks: plot a search route; finish and verify it; scan Aster in the false-alarm case and reveal 30.8%; replay a packet without changing confidence or scan budget; exhaust the four-scan budget; dispatch and inspect the debrief; compare information gain with the stop recommendation in the third scenario. Check both themes, mobile, keyboard, and legacy redirects.
