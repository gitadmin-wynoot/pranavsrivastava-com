"use client";

import { useCallback, useEffect, useState } from "react";

// Per-course lesson completion, persisted in localStorage. No login needed —
// progress just follows the student in their browser. All instances on the page
// stay in sync via a custom event, so ticking a lesson updates the sidebar too.

const storageKey = (slug: string) => `course-progress:${slug}`;
const SYNC_EVENT = "course-progress-change";

function read(slug: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function useCourseProgress(slug: string) {
  // Start empty so server and first client render match (no hydration flash).
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setCompleted(read(slug));
    refresh();
    const onSync = (e: Event) => {
      if (e.type === "storage" || (e as CustomEvent).detail?.slug === slug) refresh();
    };
    window.addEventListener(SYNC_EVENT, onSync);
    window.addEventListener("storage", onSync);
    return () => {
      window.removeEventListener(SYNC_EVENT, onSync);
      window.removeEventListener("storage", onSync);
    };
  }, [slug]);

  const setComplete = useCallback(
    (id: string, value: boolean) => {
      try {
        const set = read(slug);
        if (value) set.add(id);
        else set.delete(id);
        localStorage.setItem(storageKey(slug), JSON.stringify([...set]));
        window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { slug } }));
      } catch {
        /* storage unavailable — progress just won't persist */
      }
    },
    [slug]
  );

  return { completed, setComplete };
}
