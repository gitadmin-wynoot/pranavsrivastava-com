import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { atlasPlaces } from "@/lib/atlas";

export const metadata: Metadata = {
  title: "Atlas",
  description:
    "Every place this site mentions, mapped — a small sci-fi knowledge graph of why it matters.",
};

export default function AtlasIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">
        Atlas
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
        Places, mapped.
      </h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-2xl">
        A place name is rarely just a place name. When this site mentions one, I
        map it — a small knowledge graph of what makes it matter, drawn on the
        fly. Start with the one Pranav grew up in.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {atlasPlaces.map((p) => (
          <Link
            key={p.slug}
            href={`/atlas/${p.slug}`}
            className="group rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-cyan-500/40 hover:shadow-sm transition-all"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 mb-2">
              {p.region}
            </p>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-1.5">
              {p.name}
              <ArrowRight className="w-4 h-4 text-cyan-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
              {p.hook}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
