import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-28 text-center">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
        404
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
        This page took a wrong turn.
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-md mx-auto">
        Nothing lives here — maybe it moved, maybe it never did. No harm done.
        Here&apos;s where the good stuff actually is:
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { label: "Labs", href: "/labs" },
          { label: "Learn", href: "/learn" },
          { label: "Writing", href: "/blog" },
          { label: "About", href: "/about" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back home <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
