"use client";

/*
  EigenQuestionExplainer — the honest version of the metaphor. An eigenvector
  is the direction a transformation doesn't rotate — everything else gets
  spun and stretched, that one direction just scales. The visual shows a
  messy cluster of sub-questions getting pulled every which way by new
  information, and one question that holds its direction no matter what.
  Static, no interaction needed — the point is legibility, not play.
  SSR-stable.
*/

export function EigenQuestionExplainer() {
  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The borrowed idea, stated honestly
      </div>

      <div className="p-4 sm:p-5">
        <svg viewBox="0 0 640 220" className="w-full h-auto" fill="none" role="img">
          {/* the messy, rotating sub-questions */}
          <g opacity="0.85">
            {[
              [130, 60, 30], [95, 110, -20], [150, 150, 55], [70, 60, 80], [110, 175, -40],
            ].map(([x, y, rot], i) => (
              <g key={i} transform={`rotate(${rot} ${x} ${y})`}>
                <line x1="120" y1="110" x2={x} y2={y} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
              </g>
            ))}
          </g>
          <circle cx="120" cy="110" r="5" className="fill-zinc-400 dark:fill-zinc-500" />
          <text x="120" y="205" textAnchor="middle" className="fill-zinc-400" fontSize="11">the sub-questions — pricing, timing, optics, budget…</text>
          <text x="120" y="30" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="11" fontWeight="600">rotate with every new fact</text>

          {/* the invariant direction — the eigen question */}
          <line x1="450" y1="180" x2="590" y2="45" className="stroke-amber-500" strokeWidth="3" strokeLinecap="round" />
          <circle cx="450" cy="180" r="5" className="fill-amber-500" />
          <circle cx="590" cy="45" r="5" className="fill-amber-500" />
          <text x="520" y="205" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="11" fontWeight="600">the eigen question</text>
          <text x="520" y="24" textAnchor="middle" className="fill-zinc-400" fontSize="11">holds its direction, whatever changes around it</text>

          <line x1="260" y1="110" x2="360" y2="110" className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="1" strokeDasharray="3 5" />
          <text x="310" y="102" textAnchor="middle" className="fill-zinc-400" fontSize="10" fontStyle="italic">vs.</text>
        </svg>

        <p className="mt-3 text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-300">
          In linear algebra, most vectors change direction when you apply a transformation — an eigenvector doesn't; it only stretches or shrinks. Applied loosely to a decision, most sub-questions shift as new facts arrive — the eigen question is the one whose answer stays the load-bearing one no matter how the argument gets reframed. It's a borrowed metaphor, not a theorem — the value is in the discipline of looking for it, not in the maths being literal.
        </p>
      </div>
    </figure>
  );
}
