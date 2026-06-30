import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { atlasPlaces, getPlace, allPlaceSlugs } from "@/lib/atlas";
import { PlaceWeb } from "@/components/atlas/place-web";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allPlaceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return {};
  return {
    title: `${place.name} — Atlas`,
    description: place.hook,
  };
}

export default async function AtlasPlacePage({ params }: Props) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const others = atlasPlaces.filter((p) => p.slug !== place.slug);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/atlas"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Atlas
      </Link>

      <p className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3">
        {place.region}
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
        {place.name}
      </h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400 italic leading-relaxed mb-6">
        {place.hook}
      </p>

      <PlaceWeb name={place.name} nodes={place.nodes} links={place.links} />

      <p className="text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-8">
        {place.significance}
      </p>

      {place.sources && place.sources.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {place.sources.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              {s.label} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className="mt-14 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4">
            Elsewhere on the map
          </p>
          <div className="flex flex-wrap gap-3">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/atlas/${p.slug}`}
                className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-12 text-xs text-zinc-400 flex items-start gap-2">
        <span className="text-cyan-500">✦</span>
        <span>
          A small experiment from Pranav&apos;s AI: every place this site
          mentions gets mapped like this. The diagram draws itself from a little
          knowledge graph — more places appear as they come up.
        </span>
      </p>
    </div>
  );
}
