"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render nothing until client mounts
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  const cycles: Array<"system" | "light" | "dark"> = ["system", "light", "dark"];
  const current = (theme as "system" | "light" | "dark") ?? "system";
  const next = cycles[(cycles.indexOf(current) + 1) % cycles.length];

  const icons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
  };

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Theme: ${current} — click to switch to ${next}`}
      className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      {icons[current]}
    </button>
  );
}
