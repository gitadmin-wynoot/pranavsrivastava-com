import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/*
  cn() — merges Tailwind classes intelligently.
  clsx handles conditional classes, twMerge resolves conflicts.
  e.g. cn("text-sm", isLarge && "text-xl") → "text-xl"
*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
