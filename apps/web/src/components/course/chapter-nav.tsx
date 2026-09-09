"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, List } from "lucide-react";

/*
  Chapter table-of-contents for single-file, chapter-based courses. Generic on
  purpose: it reads its chapter list straight off the rendered DOM (every
  <ChapterHeader> leaves an id + number + title behind), so any course using
  ChapterHeader gets a working index with zero extra wiring.

  Two components share one hook so each can sit where it belongs in the page
  grid:
  - ChapterNavSidebar — desktop (lg+), a sticky column with scroll-spy.
  - ChapterNavMobile — a collapsible bar above the article, closed by default.
*/

interface ChapterEntry {
  id: string;
  number: string;
  title: string;
}

function useChapters() {
  const [chapters, setChapters] = useState<ChapterEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Read the chapter list off the DOM once the article has rendered.
  // ChapterHeader puts the id on the wrapping div, not the h2 itself.
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("article.course-content [id^='ch-']")
    );
    const entries: ChapterEntry[] = nodes.map((node) => {
      const h2 = node.querySelector("h2");
      const numberMatch = node.id.match(/^ch-(\d+)-/);
      return {
        id: node.id,
        number: numberMatch ? numberMatch[1] : "",
        title: h2?.textContent?.trim() ?? node.id,
      };
    });
    setChapters(entries);
    if (entries.length > 0) setActiveId(entries[0].id);
  }, []);

  // Scroll-spy: highlight whichever chapter heading is nearest the top.
  useEffect(() => {
    if (chapters.length === 0) return;
    const nodes = chapters
      .map((c) => document.getElementById(c.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    nodes.forEach((n) => observer.observe(n));
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [chapters]);

  const jumpTo = (id: string, after?: () => void) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    after?.();
  };

  return { chapters, activeId, jumpTo };
}

function ChapterList({
  chapters,
  activeId,
  onJump,
}: {
  chapters: ChapterEntry[];
  activeId: string | null;
  onJump: (id: string) => void;
}) {
  return (
    <ol className="space-y-0.5">
      {chapters.map((c) => {
        const isActive = c.id === activeId;
        return (
          <li key={c.id}>
            <button
              onClick={() => onJump(c.id)}
              className={`group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] leading-snug transition-colors ${
                isActive
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <span
                className={`mt-px shrink-0 font-mono text-[11px] ${
                  isActive ? "text-white/70 dark:text-zinc-900/60" : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {c.number.padStart(2, "0")}
              </span>
              <span>{c.title}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** Desktop — sticky sidebar alongside the article, always visible at lg+. */
export function ChapterNavSidebar() {
  const { chapters, activeId, jumpTo } = useChapters();
  if (chapters.length === 0) return null;

  return (
    <nav className="hidden lg:block" aria-label="Chapters">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          On this page
        </p>
        <ChapterList chapters={chapters} activeId={activeId} onJump={(id) => jumpTo(id)} />
      </div>
    </nav>
  );
}

/** Mobile / tablet — collapsible bar above the article, closed by default. */
export function ChapterNavMobile() {
  const { chapters, activeId, jumpTo } = useChapters();
  const [open, setOpen] = useState(false);
  if (chapters.length === 0) return null;

  return (
    <div className="lg:hidden mb-6 not-prose">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
          <List className="h-4 w-4 text-zinc-400" />
          Chapters
          <span className="text-xs font-normal text-zinc-400">({chapters.length})</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 max-h-72 overflow-y-auto">
          <ChapterList chapters={chapters} activeId={activeId} onJump={(id) => jumpTo(id, () => setOpen(false))} />
        </div>
      )}
    </div>
  );
}
