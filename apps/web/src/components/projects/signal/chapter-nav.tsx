import Link from "next/link";
import { ArrowRight, Route, Radar } from "lucide-react";
import styles from "./signal-game.module.css";

export function ChapterNav({ current }: { current: "search" | "uncertainty" }) {
  return <nav className={styles.chapters} aria-label="Signal chapters">
    <Link href="/projects/signal" aria-current={current === "search" ? "page" : undefined}><Route size={20} /><span><b>01 · Find a path</b><small>Search, heuristics, and a guarantee you can prove</small></span><ArrowRight size={15} /></Link>
    <Link href="/projects/signal/uncertainty" aria-current={current === "uncertainty" ? "page" : undefined}><Radar size={20} /><span><b>02 · Question the signal</b><small>Bayes, information, and the price of certainty</small></span><ArrowRight size={15} /></Link>
  </nav>;
}
