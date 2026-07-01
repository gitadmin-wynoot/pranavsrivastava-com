import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Wrench, FlaskConical } from "lucide-react";
import { getLabs, isLabAvailable, type Lab } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Hands-on, build-this-one-thing tutorials on AI systems — short, runnable, outcome-first. Build something real in under an hour.",
};

const levelColor: Record<string, "blue" | "yellow" | "red" | "default"> = {
  Beginner: "default",
  Intermediate: "blue",
  Advanced: "red",
};

export default function LabsPage() {
  const labs = getLabs();
  const available = labs.filter(isLabAvailable);
  const roadmap = labs.filter((l) => !isLabAvailable(l));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Labs
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Build something real, in under an hour.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
          Short, hands-on labs with code that runs as-is. Each one ends with a
          working thing you built yourself — not a slideshow. The fastest way to
          learn a system is to make it do something.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-3">
          Labs are quick, single-session builds. For the deep, structured path,
          see the full courses in{" "}
          <Link href="/learn" className="text-blue-600 dark:text-blue-400 hover:underline">
            Learn
          </Link>
          .
        </p>
      </div>

      {/* ── Available now ─────────────────────────────────────────────────── */}
      <div className="mb-14">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Available now
          </h2>
          <span className="text-xs text-zinc-400">{available.length} ready to build</span>
        </div>

        {available.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <FlaskConical className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">First labs publishing soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {available.map((lab) => (
              <Link
                key={lab.slug}
                href={`/labs/${lab.slug}`}
                className="group flex flex-col p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {lab.durationMin} min
                  </span>
                  <span>·</span>
                  <Badge variant={levelColor[lab.level] ?? "default"}>{lab.level}</Badge>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lab.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 flex-1">
                  {lab.summary}
                </p>
                {lab.outcome && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-3 flex items-start gap-1.5">
                    <span className="font-semibold shrink-0">You build:</span>
                    {lab.outcome}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {lab.tools.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Wrench className="w-2.5 h-2.5" /> {t}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── On the roadmap ───────────────────────────────────────────────── */}
      {roadmap.length > 0 && (
        <div className="mb-14">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              On the roadmap
            </h2>
            <span className="text-xs text-zinc-400">{roadmap.length} planned</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 max-w-2xl">
            Labs I am building next. Want one of these sooner? Tell me.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roadmap.map((lab: Lab) => (
              <div
                key={lab.slug}
                className="flex flex-col p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl opacity-90"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-snug">
                    {lab.title}
                  </h3>
                  <Badge variant="outline">Soon</Badge>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {lab.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-6 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          Want a lab on something specific?
        </p>
        <Link href="/contact" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Tell me what you want to build →
        </Link>
      </div>
    </div>
  );
}
