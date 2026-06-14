import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "blue" | "green" | "yellow" | "red" | "outline";
  className?: string;
}

const variants = {
  default: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300",
  blue: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
  green: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
  yellow: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  red: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
  outline: "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export const statusVariant: Record<string, BadgeProps["variant"]> = {
  live: "green",
  building: "blue",
  idea: "yellow",
  archived: "default",
  published: "green",
  draft: "yellow",
  "coming-soon": "outline",
};
