import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Telescope, Lightbulb, Zap, Cpu, Boxes, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Research Interests — Pranav Srivastava",
  description:
    "Deep dive into computer vision, knowledge representation, metaheuristic optimization, deep learning, and decentralized systems — and how they connect to real-world products.",
};

/** A monospace ASCII diagram block, styled to match the site. */
function Diagram({
  title,
  children,
  accent = "text-zinc-400",
}: {
  title: string;
  children: string;
  accent?: string;
}) {
  return (
    <figure className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden">
      <figcaption className={`text-[10px] font-medium uppercase tracking-wider px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 ${accent}`}>
        {title}
      </figcaption>
      <div className="overflow-x-auto px-4 py-4">
        <pre className="text-[10.5px] sm:text-xs leading-[1.5] font-mono text-zinc-600 dark:text-zinc-300 whitespace-pre">
{children}
        </pre>
      </div>
    </figure>
  );
}

export default function ResearchPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to About
        </Link>
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-3">
          Research & Deep Interests
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          The areas of AI I keep coming back to
        </h1>
        <p className="text-xs text-zinc-400 italic mb-4">
          The rest of this site is in my words, his AI. This page is different —
          here Pranav takes over and goes deep himself, in his own voice.
        </p>
        <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
          My MSc in AI at MTU Cork was not just a qualification — it was a set
          of disciplines that genuinely changed how I reason about systems,
          problems, and uncertainty. Add a few side quests that never left me,
          and you get the map below. The further I get from graduation, the
          more I find myself applying these ideas as an architect — in
          production software, enterprise products, and my own startups.
        </p>
      </div>

      {/* ── Nav anchors ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-16">
        {[
          { href: "#computer-vision", label: "Computer Vision", color: "text-purple-600 dark:text-purple-400" },
          { href: "#knowledge-representation", label: "Knowledge Representation", color: "text-amber-600 dark:text-amber-400" },
          { href: "#metaheuristics", label: "Metaheuristic Optimization", color: "text-emerald-600 dark:text-emerald-400" },
          { href: "#deep-learning", label: "Deep Learning & NLP", color: "text-blue-600 dark:text-blue-400" },
          { href: "#decentralized", label: "Decentralized Systems", color: "text-rose-600 dark:text-rose-400" },
        ].map((a) => (
          <a
            key={a.href}
            href={a.href}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 ${a.color} hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors`}
          >
            {a.label}
          </a>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* COMPUTER VISION                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="computer-vision" className="mb-20 scroll-mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center shrink-0">
            <Telescope className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Computer Vision
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Thesis domain · real-time perception systems</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            Computer vision asks a deceptively simple question: how do you turn
            raw pixels into meaning? My MSc thesis answered a specific version
            of it — can we detect student engagement in a classroom using only
            a standard webcam?
          </p>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-3">
              Thesis — Student Engagement Detection
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
              The system used OpenFace 2.0 to extract three signals from each
              video frame: head pose (pitch, yaw, roll), gaze direction (where
              the eyes are pointing), and facial action units (the 44
              standardised muscle movements that encode expression). A
              classifier then mapped these signals to engagement levels in
              real-time.
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              What made it interesting was the failure modes. Lighting changes
              corrupt facial action units. Glasses scatter gaze estimation.
              Learners from different cultural backgrounds express attention
              differently. A system that works in a controlled lab fails in a
              real classroom — which is exactly the kind of gap between demo
              and production that I now think about in every AI system I build.
            </p>
          </div>

          <Diagram title="Engagement detection — pixels to decision" accent="text-purple-500">
{`   Webcam frame
        |
        v
   +--------------+
   | OpenFace 2.0 |   extract signals, every frame
   +------+-------+
          |
   +------+--------------+
   v      v              v
  Head   Gaze        Facial Action
  Pose   Direction   Units (44 muscles)
   +------+--------------+
          |
          v
   +--------------+
   |  Classifier  |
   +------+-------+
          |
          v
   Engaged  .  Neutral  .  Distracted`}
          </Diagram>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                3D Scene Reconstruction — KLT Optical Flow
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Tracking feature points across frames using the
                Kanade-Lucas-Tomasi algorithm, then using the motion parallax
                between matched points to reconstruct scene geometry. Camera
                calibration via checkerboard patterns to go from pixels to
                real-world coordinates.
              </p>
            </div>
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                SIFT-Inspired Feature Descriptor — Built from First Principles
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Implementing the full Scale-Invariant Feature Transform pipeline
                without a library: Gaussian blur scale-space, DoG interest
                point detection, dominant orientation assignment, and a
                128-dimensional descriptor for matching across images under
                rotation and scale changes.
              </p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl">
            <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">Where this could live</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Visual quality inspection, document and identity verification,
              object detection pipelines — any system that turns a camera feed
              into a decision. The deeper value of the MSc work was
              understanding the math, not just calling
              <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">cv2.detectAndCompute()</code>.
              That makes it much easier to know when a pre-trained model will fail.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* KNOWLEDGE REPRESENTATION                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="knowledge-representation" className="mb-20 scroll-mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Knowledge Representation & Planning
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Reasoning under uncertainty · formal world models</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            Before machine learning became the dominant lens, AI was largely
            about <em>representing what a system knows</em> — formally, precisely,
            and in a way that supports reasoning. Knowledge Representation and
            Planning (KR&P) deals with how to encode entities, relationships,
            rules, and assumptions about the world so that a system can draw
            conclusions, make decisions, and revise its beliefs when new
            information arrives.
          </p>
          <p>
            This is not an academic curiosity. It is the foundation of every
            system that does more than classify inputs — every system that
            needs to <em>reason</em>.
          </p>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3">
              Project — Mars Rover: Exploring for Water
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
              The rover has a mission: explore Martian terrain and locate water
              sources under a constrained energy budget. The system does not
              learn from data — it reasons from a formal knowledge base.
            </p>
            <div className="space-y-3 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-28 shrink-0">Knowledge base</span>
                <span>Formal assertions about the world — terrain types, sensor ranges, what water signatures look like in spectral data, which grid cells are passable.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-28 shrink-0">World state</span>
                <span>Current position, battery level, explored cells, detected anomalies. The rover tracks what it knows and what it has not yet observed.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-28 shrink-0">CWA</span>
                <span>Under the Closed World Assumption, anything not in the knowledge base is assumed false. The rover does not speculate — it reasons from known facts.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-28 shrink-0">Planning</span>
                <span>A search over possible action sequences (move north, sample, transmit) to find a plan that reaches water within energy constraints — similar to STRIPS planning.</span>
              </div>
            </div>
          </div>

          <Diagram title="The reasoning loop — sense, update, plan, act" accent="text-amber-500">
{`        +-----------------------------+
        |       KNOWLEDGE BASE        |
        | terrain . water signatures |
        | passable cells . rules     |
        +-------------+--------------+
                      | informs
                      v
  +-------+   +---------+   +--------+   +------+
  | SENSE |-->| UPDATE  |-->|  PLAN  |-->| ACT  |
  | probe |   | beliefs |   | search |   | move |
  +---^---+   +---------+   +--------+   +--+---+
      |                                     |
      +--------------  observe  <-----------+`}
          </Diagram>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3">
              Where KR shows up in production AI — three real applications
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">AI Guardrails</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Constitutional AI and semantic guardrails are essentially a
                  knowledge base of constraints — rules the system must never
                  violate, regardless of what the generative model wants to
                  produce. A guardrail system is a KR system: it encodes
                  permissible behaviours, checks outputs against them, and
                  rejects or reroutes on violation. The same formal machinery
                  from the Mars rover applies to keeping LLMs safe in
                  production.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Recommendation systems (Wynoot)</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  A naive recommendation system learns from co-occurrence. A
                  knowledge-augmented one knows that a user who books a 60-minute
                  deep tissue massage prefers evening slots, has a price
                  sensitivity around a certain range, and has previously chosen
                  the same therapist. Encoding this as a knowledge graph — with
                  nodes for users, services, time preferences, and constraints —
                  enables recommendations that are explainable, not just
                  statistically correlated. This is the direction Wynoot's AI
                  recommendation layer is taking.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">LLM agent tool selection</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  When an AI agent decides which tool to call next — MCP server,
                  API, database — it is doing a form of planning under a
                  knowledge base of tool capabilities and preconditions. The
                  architecture of reliable agent systems benefits enormously from
                  KR thinking: formal tool schemas, explicit preconditions, and
                  verified post-conditions reduce unpredictable behaviour.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* METAHEURISTIC OPTIMIZATION                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="metaheuristics" className="mb-20 scroll-mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Metaheuristic & Combinatorial Optimization
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">personal favourite · NP-hard problems · elegant solutions to impossible spaces</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            Most problems that matter in the real world are NP-hard. There is
            no polynomial-time algorithm that finds the perfect solution. The
            solution space is combinatorially explosive — for a routing problem
            with 50 stops, there are more possible orderings than atoms in the
            observable universe. Exact methods fail.
          </p>
          <p>
            This is where metaheuristics live. Rather than searching
            exhaustively, they guide a search process intelligently — accepting
            imperfection, avoiding local traps, and finding solutions that are
            very good rather than provably optimal. The elegance is that the
            best algorithms are often inspired by nature.
          </p>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">
              Genetic Algorithms — the one I built
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
              Inspired by biological evolution. You maintain a <em>population</em> of
              candidate solutions (not one solution, but many — diversity is
              the whole point). Each generation, better solutions are selected
              more often to reproduce. Crossover combines two parent solutions
              to create offspring that inherit traits from both. Mutation
              introduces small random changes to prevent stagnation. Over
              hundreds of generations, the population converges toward
              high-quality solutions.
            </p>
            <div className="space-y-3 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-24 shrink-0">Problem</span>
                <span>Travelling Salesman Problem — find the shortest route through N cities visiting each exactly once. Classic combinatorial benchmark, NP-hard.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-24 shrink-0">Encoding</span>
                <span>Each solution is a permutation of city indices. The challenge: crossover must produce valid permutations — no city visited twice, none skipped.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-24 shrink-0">Crossover</span>
                <span>Implemented Partially Mapped Crossover (PMX) — preserves relative order of cities from both parents while guaranteeing a valid offspring permutation.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-24 shrink-0">Selection</span>
                <span>Tournament selection — pick a random subset, take the best. Simpler than roulette wheel and less prone to premature convergence.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 w-24 shrink-0">Result</span>
                <span>Reached near-optimal solutions for 50-city instances in under 200 generations. The fitness curve is genuinely beautiful to watch — steep early gains, then refinement.</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic border-t border-zinc-200 dark:border-zinc-700 pt-3">
              The lesson that stayed: diversity in a population prevents getting
              stuck. Too much selection pressure and everyone converges on a
              local optimum. Too little and nothing improves. The right balance
              between exploration and exploitation is a design problem, not a
              parameter to tune blindly — and it maps directly to how I think
              about technical architecture decisions.
            </p>
          </div>

          <Diagram title="Genetic algorithm — the evolution loop" accent="text-emerald-500">
{`   Initialise population
   (random valid tours)
            |
            v
   +--> Evaluate fitness --------+  shorter tour = fitter
   |    (total distance)         |
   |                             v
   |               Selection (tournament)
   |                             |
   |                             v
   |               Crossover (PMX, valid perms)
   |                             |
   |                             v
   |               Mutation (swap two cities)
   |                             |
   +-----------------------------+
        repeat ~200 generations
            |
            v
   Near-optimal route`}
          </Diagram>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3">
              Other metaheuristics worth understanding
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Simulated Annealing
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Inspired by the controlled cooling of metals. The algorithm
                  occasionally accepts a <em>worse</em> solution — with a probability
                  that decreases as a "temperature" parameter drops. Early in
                  the search, it wanders freely. As temperature falls, it
                  becomes increasingly greedy. This escapes local optima that
                  purely greedy search cannot. The cooling schedule is the art.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Ant Colony Optimization
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Ants find the shortest path to food through pheromone
                  reinforcement — shorter paths accumulate pheromone faster
                  because ants traverse them more frequently. The algorithm
                  models this: artificial ants probabilistically build
                  solutions, pheromone trails are updated proportionally to
                  solution quality, and evaporation prevents premature
                  convergence. Excellent for routing and scheduling.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Particle Swarm Optimization
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  A swarm of particles moves through the solution space, each
                  remembering its own best-found position and the swarm's
                  global best. Velocity updates pull each particle toward both.
                  Elegant for continuous optimization — particularly useful in
                  neural architecture search and hyperparameter tuning.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
              Where combinatorial optimization shows up in production — and in my work
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Wynoot scheduling</p>
                <p className="leading-relaxed">Booking optimization is a constraint satisfaction + scheduling problem: therapist availability, room capacity, service duration, client preferences, minimising gaps. Exact solvers break down at scale. Metaheuristics find good schedules fast.</p>
              </div>
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">API call sequencing</p>
                <p className="leading-relaxed">In complex integrations, the order of API calls affects latency, error recovery, and cost. Finding the optimal sequence under dependency and retry constraints is a combinatorial problem disguised as engineering.</p>
              </div>
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fraud rule ordering</p>
                <p className="leading-relaxed">Anti-fraud rules applied in the wrong order miss signals or trigger false positives. The optimal evaluation order — given rule cost, catch rate, and volume — is a sequencing problem that benefits from search heuristics.</p>
              </div>
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">LLM hyperparameter search</p>
                <p className="leading-relaxed">Prompt templates, temperature, chunk size, retrieval top-k — the joint search space for a RAG pipeline is vast. Bayesian optimization (a cousin of metaheuristics) navigates it efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DEEP LEARNING & NLP                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="deep-learning" className="mb-20 scroll-mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Deep Learning & NLP
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">CNNs · transfer learning · dialogue systems</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            Deep learning is the domain most people enter AI through today. I
            came to it already knowing how feature extractors worked from the
            computer vision work — which means I never had to treat neural
            networks as magic. Understanding what a convolutional filter is
            actually doing makes it much easier to know when to use
            pre-trained features versus training from scratch, and why.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">CNN Image Classification</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Built a flower classification system comparing two approaches:
                training a CNN from scratch vs. fine-tuning a pre-trained model
                (transfer learning). The result confirmed what the literature
                says — transfer learning wins for small labelled datasets
                because the lower layers (edge, texture, colour detectors) are
                already learnt. But building from scratch teaches you exactly
                why that is, which matters when you need to make architectural
                decisions on novel problems.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Personality-Driven Dialogue System</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Built an NLP chatbot that went beyond intent-response mapping —
                the system maintained a personality model that shaped how it
                responded, not just what it said. Speech-to-text input (live
                microphone) + intent classification + dynamic response
                generation based on personality parameters. An early
                exploration of what would later become the prompt engineering
                and persona work in modern LLM systems.
              </p>
            </div>
          </div>

          <Diagram title="Transfer learning — why fine-tuning wins on small data" accent="text-blue-500">
{`  Pre-trained CNN (learned on millions of images)
  +---------+---------+---------+------------+
  |  edges  | texture | shapes  | classifier |
  +---------+---------+---------+------------+
       \\_________ keep (freeze) ________/    \\__ retrain
        these layers already know vision      on your classes

  From scratch:  must learn edges AND your task  -> needs huge data
  Fine-tuning:   reuse vision, learn only task   -> wins on small data`}
          </Diagram>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Where this connects now</p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              LLM orchestration, RAG pipelines, and AI agents are the current
              frontier — but the underlying instincts are the same: what does
              the model actually know, what does it hallucinate, and how do you
              design the system so that failure is recoverable? The MSc work on
              CNNs and NLP built the mental models. Enterprise systems and
              Wynoot stress-test them in production.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DECENTRALIZED SYSTEMS & BLOCKCHAIN                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section id="decentralized" className="mb-20 scroll-mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
            <Boxes className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Decentralized Systems & Blockchain
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">2019 hackathon · trust as infrastructure · a use case I still think about</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            Not every favourite project comes from a classroom. At a 2019
            hackathon, a small team and I built a food traceability system on
            Hyperledger Fabric — a permissioned blockchain. The question was
            simple and the implications were not: <em>can you prove where your
            food actually came from?</em>
          </p>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-3">
              Hackathon — Farm-to-Fork Traceability
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
              In a normal supply chain, every actor keeps their own records.
              When something goes wrong — contamination, fraud, a broken cold
              chain — nobody can reconstruct the full history quickly, and
              everyone can quietly edit their own version of events. A shared,
              tamper-proof ledger removes that ambiguity. Every handoff from
              farm to processor to distributor to retailer becomes a signed,
              timestamped transaction that all parties can see but none can
              rewrite.
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              We chose Hyperledger Fabric over a public chain deliberately —
              supply chains need known, permissioned participants and private
              channels, not anonymous miners. That choice itself is the
              interesting architecture lesson: the technology must fit the
              trust model of the actual problem.
            </p>
          </div>

          <Diagram title="Food traceability on a shared ledger" accent="text-rose-500">
{`  Farm --> Processor --> Distributor --> Retailer --> You
   |           |             |             |          |
   v           v             v             v          v
 +------------------------------------------------------+
 |  Hyperledger Fabric  -  shared tamper-proof ledger   |
 |  every handoff = a signed, timestamped transaction   |
 +------------------------------------------------------+
                       | scan QR at any point
                       v
   "This mango: farm in Ratnagiri, picked 4 days ago,
    cold-chain unbroken, zero tampering events."`}
          </Diagram>

          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl">
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mb-2">
              Where my head goes next — the smart fridge
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              It was relevant in 2019. It is more relevant now. Trace the
              source far enough and it stops being about tracking and starts
              being about intelligence: a fridge that knows what is inside it,
              where each item came from, when it will spoil, and what you can
              cook before it does. Provenance data plus a few sensors plus a
              recommendation layer — suddenly the boring ledger becomes a
              everyday product. That jump, from infrastructure to lived
              experience, is exactly the kind of leap I find irresistible.
            </p>
          </div>

          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed italic border-l-2 border-rose-400 pl-4">
            The honest reason this stuck: I love use cases where trust,
            transparency, and the physical world meet code. That instinct shows
            up everywhere in my work — in anti-fraud systems, in API governance,
            in how I think about AI guardrails. Different domains, same value.
          </p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10 flex flex-wrap gap-3">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to About
        </Link>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          See the courses built on this <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
