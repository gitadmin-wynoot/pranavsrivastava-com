"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

// A plain light/dark toggle. Deliberately NOT a three-way system/light/dark
// cycle: that version showed the icon for the raw `theme` setting and
// advanced through "system" on every click — so the first click from
// "system" often changed the setting but not the pixels on screen (system
// was already resolving to the theme you were about to set explicitly),
// which reads as the button doing nothing, or the opposite of what you
// clicked. Using resolvedTheme (what's actually on screen right now) and
// always flipping straight to its opposite means every click is a real,
// visible change. The OS preference still drives the *first* visit via
// defaultTheme="system" on the provider — this toggle just takes over once
// someone has an opinion.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render nothing until client mounts
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Currently ${resolvedTheme} — click to switch to ${next}`}
      className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
