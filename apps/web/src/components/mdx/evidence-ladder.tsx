"use client";

import { useState } from "react";

/*
  EvidenceLadder — every headline claim about Jev, labelled by how well it is
  actually supported. Checked 25 September 2026, ten days after launch.
  Sources are third-party write-ups read on that date; not re-run by us.
*/

type Label = "holds" | "mixed" | "vendor" | "against" | "unknown";

const LABELS: Record<Label, { text: string; chip: string; card: string }> = {
  holds: { text: "Holds up", chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", card: "border-emerald-500/40" },
  mixed: { text: "Mixed evidence", chip: "bg-amber-500/15 text-amber-700 dark:text-amber-300", card: "border-amber-500/40" },
  vendor: { text: "Vendor claim only", chip: "bg-sky-500/15 text-sky-700 dark:text-sky-300", card: "border-sky-500/40" },
  against: { text: "Independent tests disagree", chip: "bg-rose-500/15 text-rose-700 dark:text-rose-300", card: "border-rose-500/40" },
  unknown: { text: "No evidence found", chip: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300", card: "border-zinc-400/40" },
};

const CLAIMS: { claim: string; label: Label; found: string; sources: { t: string; u: string }[] }[] = [
  {
    claim: "\"0 type errors, guaranteed\"",
    label: "holds",
    found: "True by construction: answers are forced into a schema you define. One independent review counted zero invalid answers across 23,703 calls. Note what this does not say: a well-formed answer can still be the wrong answer.",
    sources: [{ t: "TypeSafe launch post", u: "https://typesafe.ai/blog/introducing-system-one-models-and-jev" },{ t: "xbill, independent tests, 24 Sept 2026", u: "https://dev.to/aws-builders/jev-after-eight-days-of-independent-tests-level-with-mid-price-llms-behind-the-frontier-1c60" }],
  },
  {
    claim: "\"0 hallucinations\"",
    label: "mixed",
    found: "Jev cannot invent a citation because it cannot write text. It can still pick the wrong option. On one out-of-distribution ticket test it was right 75.1% of the time overall, and 44.7% on a question that could not be answered from the input, while averaging 0.74 probability on its chosen answer.",
    sources: [{ t: "The Register, 16 Sept 2026", u: "https://www.theregister.com/ai-and-ml/2026/09/16/typesafe-ai-debuts-model-for-machines-that-plays-doom/5296711" },{ t: "scienthoon, jev-ood-calibration", u: "https://github.com/scienthoon/jev-ood-calibration" }],
  },
  {
    claim: "\"70 to 500 ms end to end\"",
    label: "mixed",
    found: "Plausible, and reviewers saw big speed-ups over hosted frontier models. But speed-up varied from about 12x faster than a mid-size open model to slower than a local Gemma 4 26B. Network distance adds to it. Measure from your own region.",
    sources: [{ t: "xbill, independent tests, 24 Sept 2026", u: "https://dev.to/aws-builders/jev-after-eight-days-of-independent-tests-level-with-mid-price-llms-behind-the-frontier-1c60" },{ t: "Flavio Copes", u: "https://flaviocopes.com/jev/" }],
  },
  {
    claim: "\"193.6x faster, 444.6x cheaper\"",
    label: "vendor",
    found: "The comparator is not named. Averaged over all eight of TypeSafe's own workflow setups, one review computes 97.8x faster and 149.2x cheaper. Against Claude Haiku 4.5 on a phishing task the same review measured 2.9x faster and 12x cheaper.",
    sources: [{ t: "typesafe.ai", u: "https://typesafe.ai/" },{ t: "xbill, independent tests, 24 Sept 2026", u: "https://dev.to/aws-builders/jev-after-eight-days-of-independent-tests-level-with-mid-price-llms-behind-the-frontier-1c60" },{ t: "Layer3 Labs", u: "https://www.layer3labs.io/guides/jev-benchmarks" }],
  },
  {
    claim: "\"$0.042 per million input tokens, output free\"",
    label: "vendor",
    found: "TypeSafe's own list price for early access. TypeSafe itself writes that it cannot prove the price is not subsidised. A reseller site (jevtypesafeai.com, operated by CODEFASHION TECH LTD, not affiliated with TypeSafe) charges $0.25 to $0.42 per million.",
    sources: [{ t: "TypeSafe launch post", u: "https://typesafe.ai/blog/introducing-system-one-models-and-jev" },{ t: "jevtypesafeai.com pricing (reseller)", u: "https://jevtypesafeai.com/pricing" }],
  },
  {
    claim: "\"Calibrated probabilities\"",
    label: "against",
    found: "Independent tests found overconfidence on choice and score answers and underconfidence on yes/no. TypeSafe has published no calibration error, reliability plot, or Brier score. Treat the numbers as a ranking, and calibrate them on your own data.",
    sources: [{ t: "scienthoon, jev-ood-calibration", u: "https://github.com/scienthoon/jev-ood-calibration" },{ t: "Layer3 Labs", u: "https://www.layer3labs.io/guides/jev-benchmarks" }],
  },
  {
    claim: "\"Frontier-level intelligence for decisions\"",
    label: "mixed",
    found: "Level with a simple baseline on spam (98.33% versus 98.39% for TF-IDF logistic regression). Slightly behind Gemma 4 31B on a social-science annotation suite (median F1 58.1 versus 61.1). Behind Claude on a six-model suite (72.5% versus 84.0%). Strong on binary and few-class English tasks.",
    sources: [{ t: "xbill, independent tests, 24 Sept 2026", u: "https://dev.to/aws-builders/jev-after-eight-days-of-independent-tests-level-with-mid-price-llms-behind-the-frontier-1c60" }],
  },
  {
    claim: "\"Consistent, repeatable answers\"",
    label: "mixed",
    found: "Same question asked twice: only 1.33% of answers changed. But swapping which rubric sits behind \"yes\" and \"no\" changed 32.5% of answers. Repeatable is not the same as steady when the wording changes.",
    sources: [{ t: "xbill, independent tests, 24 Sept 2026", u: "https://dev.to/aws-builders/jev-after-eight-days-of-independent-tests-level-with-mid-price-llms-behind-the-frontier-1c60" }],
  },
  {
    claim: "Ready for production in high-stakes systems",
    label: "unknown",
    found: "typesafe.ai names no customers or production deployments. Its own page says early access, while Cloudflare's docs list the model as generally available. I found no audited high-stakes deployment as of 25 September 2026.",
    sources: [{ t: "typesafe.ai", u: "https://typesafe.ai/" },{ t: "Cloudflare model page", u: "https://developers.cloudflare.com/ai/models/typesafe/jev/" }],
  },
];

export function EvidenceLadder() {
  const [f, setF] = useState<Label | "all">("all");
  const [open, setOpen] = useState<number | null>(0);
  const list = CLAIMS.map((c, i) => ({ ...c, i })).filter((c) => f === "all" || c.label === f);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        How well proven is each claim? Checked 25 September 2026
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setF("all")} className={`rounded-full border px-2.5 py-1 text-[11px] ${f === "all" ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500"}`}>All ({CLAIMS.length})</button>
          {(Object.keys(LABELS) as Label[]).map((k) => (
            <button key={k} onClick={() => setF(k)} className={`rounded-full border px-2.5 py-1 text-[11px] ${f === k ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500"}`}>
              {LABELS[k].text} ({CLAIMS.filter((c) => c.label === k).length})
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {list.map((c) => (
            <li key={c.i} className={`rounded-xl border ${LABELS[c.label].card}`}>
              <button onClick={() => setOpen(open === c.i ? null : c.i)} className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left">
                <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">{c.claim}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${LABELS[c.label].chip}`}>{LABELS[c.label].text}</span>
              </button>
              {open === c.i && (
                <div className="border-t border-zinc-200/60 dark:border-zinc-800 px-3 py-2.5">
                  <p className="text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{c.found}</p>
                  <p className="mt-2 text-[10px] text-zinc-400">Sources:{" "}
                    {c.sources.map((x, n) => (
                      <span key={x.u}>{n > 0 && "; "}<a href={x.u} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 dark:hover:text-zinc-200">{x.t}</a></span>
                    ))}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] text-zinc-400">Third-party write-ups read on 25 September 2026. We did not re-run their tests. The product is ten days old, so expect this page to age quickly.</p>
      </div>
    </figure>
  );
}
