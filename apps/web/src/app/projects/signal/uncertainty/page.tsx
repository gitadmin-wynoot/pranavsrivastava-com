import type { Metadata } from "next";
import { BeliefGame } from "@/components/projects/signal/belief-game";
export const metadata: Metadata = {
  title: "Signal: Question the signal — Bayesian rescue game",
  description: "Find a hidden signal with noisy sensors. Predict Bayesian updates, expose duplicate evidence, and weigh information against its cost in a playable AI experiment.",
  alternates: { canonical: "/projects/signal/uncertainty" },
};
export default function UncertaintyPage() { return <BeliefGame />; }
