"use client";

import { useState } from "react";

/*
  InventorsGallery — a deliberately global, cross-century cast. Each carries the
  breakthrough, a human detail, the transferable lesson, and the interconnection
  (what they built on → what grew from them). The point of the whole set: nobody
  invents alone. SSR-stable, no API.
*/

type Inventor = {
  emoji: string;
  name: string;
  place: string;
  era: string;
  accent: string;
  what: string;
  human: string;
  lesson: string;
  roots: string;
  branches: string;
};

const PEOPLE: Inventor[] = [
  {
    emoji: "🧮",
    name: "al-Khwārizmī",
    place: "Baghdad",
    era: "c. 820 CE",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "Wrote the books that gave us the words algebra (al-jabr) and, from his own Latinised name, algorithm. He didn't invent from nothing — he fused Indian numerals, Greek geometry, and Babylonian method into one system.",
    human: "A librarian at the House of Wisdom, his real genius was translation — carrying ideas across languages and cultures until they became something new.",
    lesson: "The bridge is the breakthrough. Synthesis across traditions is invention.",
    roots: "Brahmagupta's zero (Deep Roots, part 1)",
    branches: "Fibonacci, and all of computing",
  },
  {
    emoji: "🔬",
    name: "Ibn al-Haytham",
    place: "Cairo",
    era: "c. 1020 CE",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "In his Book of Optics he did something radical: he tested. Controlled experiments on light and vision, with the explicit rule that evidence outranks authority — arguably the scientific method, six centuries early.",
    human: "Legend says he feigned madness for years to escape a caliph's impossible engineering commission — and did his best science under that house arrest.",
    lesson: "Test, don't trust. Evidence beats the loudest expert in the room.",
    roots: "Greek optics (Euclid, Ptolemy)",
    branches: "the scientific method; every A/B test and AI eval",
  },
  {
    emoji: "➗",
    name: "Mādhava",
    place: "Kerala, India",
    era: "c. 1380 CE",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    what: "Founded the Kerala school and wrote infinite series for π, sine and cosine — the seeds of calculus — around 250 years before Newton and Leibniz.",
    human: "He worked far from any imperial capital, in a quiet southern town, and much of his work survives only because his students wrote it down.",
    lesson: "The frontier is not only at the centre. Great work happens off the map.",
    roots: "Indian trigonometry and astronomy",
    branches: "calculus — re-found in Europe centuries later",
  },
  {
    emoji: "🎨",
    name: "Leonardo da Vinci",
    place: "Florence / Milan",
    era: "c. 1500",
    accent: "border-violet-500/40 bg-violet-500/5",
    what: "Painter, anatomist, engineer, hydrologist — he refused to pick a lane, and his notebooks (thousands of pages) cross-pollinated every field he touched.",
    human: "He dissected corpses to paint muscles, studied bird flight to design machines, and left most projects gloriously unfinished.",
    lesson: "Breadth is a superpower. The best analogy usually comes from another field.",
    roots: "the whole Renaissance workshop tradition",
    branches: "the ideal of the cross-domain maker",
  },
  {
    emoji: "💻",
    name: "Ada Lovelace",
    place: "London",
    era: "1843",
    accent: "border-rose-500/40 bg-rose-500/5",
    what: "Wrote what many call the first computer program — for a machine that was never built — and saw further than its inventor: that it could manipulate any symbols, not just numbers. Music, art, anything encodable.",
    human: "Daughter of the poet Byron, she called her approach 'poetical science' — and imagined general-purpose computing a century before the computer.",
    lesson: "See what the tool could become, not just what it does today.",
    roots: "Babbage's Analytical Engine",
    branches: "the very idea of software",
  },
  {
    emoji: "💡",
    name: "Thomas Edison",
    place: "Menlo Park, USA",
    era: "1876",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "His real invention wasn't the bulb (others had versions) — it was the industrial research lab: a team, a system, and relentless iteration turning invention into a repeatable process.",
    human: "His 'invention factory' ran on a crew he called the muckers, and on testing thousands of filament materials until one lasted.",
    lesson: "Invention is a system and a team, not a lone spark.",
    roots: "the telegraph industry he grew up in",
    branches: "the modern R&D lab; every product team",
  },
  {
    emoji: "✈️",
    name: "The Wright brothers",
    place: "Dayton / Kitty Hawk, USA",
    era: "1903",
    accent: "border-sky-500/40 bg-sky-500/5",
    what: "Two bicycle makers beat far better-funded rivals to powered flight — by building their own wind tunnel, testing ~200 wing shapes, and solving the problem everyone else ignored: control.",
    human: "They spent roughly a thousand dollars; the government-backed rival spent about fifty times that, and crashed into the Potomac days before them.",
    lesson: "Attack the real hard problem, and iterate cheaply. Budget is not conviction.",
    roots: "gliding pioneers (Lilienthal) and their own bike shop",
    branches: "aviation; the lean, test-fast startup",
  },
  {
    emoji: "⚙️",
    name: "Grace Hopper",
    place: "USA",
    era: "1952",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    what: "Built the first compiler, letting people write in something like English instead of raw machine code — and drove the creation of COBOL. She made computing speak human.",
    human: "She kept a taped-in moth in a logbook — the original 'bug' — and lived by 'it's easier to ask forgiveness than permission.'",
    lesson: "Build the layer that lets others build. Abstraction is a gift.",
    roots: "Pāṇini → BNF → formal grammars (Deep Roots, part 2)",
    branches: "every programming language since",
  },
  {
    emoji: "🖱️",
    name: "Douglas Engelbart",
    place: "California, USA",
    era: "1968",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "In one 1968 demo he showed the mouse, hypertext, windows, video-conferencing and live collaboration — a whole future at once. His goal was never automation; it was augmenting human intellect.",
    human: "Nicknamed 'the Mother of All Demos', it was decades ahead — and he spent much of his life watching others commercialise what he'd given away.",
    lesson: "The best tools amplify people, not replace them. Aim there.",
    roots: "wartime radar screens and a vision of collective IQ",
    branches: "the personal computer; the web",
  },
  {
    emoji: "🌐",
    name: "Tim Berners-Lee",
    place: "CERN, Geneva",
    era: "1991",
    accent: "border-violet-500/40 bg-violet-500/5",
    what: "Invented the World Wide Web — and then, with CERN, put it in the public domain for free. No patent, no toll booth. The openness is why it became the web and not a walled product.",
    human: "He built it partly to help scientists share papers, and has spent the decades since fighting to keep the web open.",
    lesson: "Giving it away can be the most powerful move you make.",
    roots: "Engelbart's hypertext; the internet",
    branches: "the open web; open-source everything",
  },
  {
    emoji: "🧠",
    name: "Geoffrey Hinton",
    place: "Toronto / London",
    era: "1986 → 2012",
    accent: "border-rose-500/40 bg-rose-500/5",
    what: "Kept working on neural networks through two 'AI winters' when the field had written them off — helped make backpropagation practical in 1986, and in 2012 his students' model crushed the ImageNet contest and lit the fuse of modern AI.",
    human: "For decades this was deeply unfashionable work. He was right, and patient, for about thirty years before the world agreed.",
    lesson: "Conviction through the winter. Being early looks identical to being wrong.",
    roots: "backprop's own long lineage (Cauchy → Werbos)",
    branches: "deep learning; the model answering you now",
  },
  {
    emoji: "🖼️",
    name: "Fei-Fei Li",
    place: "Stanford, USA",
    era: "2009",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "Bet that the missing piece in AI wasn't a cleverer algorithm but better data — and built ImageNet, millions of labelled images. It became the benchmark that deep learning needed to prove itself.",
    human: "Peers thought labelling millions of images was a waste of time. She crowdsourced it anyway — and reset the whole field.",
    lesson: "Sometimes the breakthrough is the substrate — the data, not the model.",
    roots: "decades of computer-vision research",
    branches: "the 2012 deep-learning boom; today's models",
  },
];

export function InventorsGallery() {
  const [i, setI] = useState(0);
  const p = PEOPLE[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        A global cast — nobody in it invented alone
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {PEOPLE.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${p.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{p.emoji}</span> {p.name}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400 text-right">{p.place} · {p.era}</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.what}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400 italic">{p.human}</p>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            <span className="font-semibold">Lesson: </span>{p.lesson}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-zinc-400">
            <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5">stood on: {p.roots}</span>
            <span aria-hidden="true">→</span>
            <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5">grew into: {p.branches}</span>
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Twelve people, four continents, twelve centuries — and not one of them started from a blank page. Every &ldquo;stood on&rdquo; is someone else's &ldquo;grew into.&rdquo;
        </p>
      </div>
    </figure>
  );
}
