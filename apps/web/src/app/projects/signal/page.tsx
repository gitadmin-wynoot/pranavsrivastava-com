import type { Metadata } from "next";
import { SignalGame } from "@/components/projects/signal/signal-game";

export const metadata: Metadata = {
  title: "Signal — a human + AI search game",
  description: "Plot a rescue route, watch A* reason, challenge an overconfident AI, and prove when the cheapest-path guarantee holds. A playable experiment in AI.",
  alternates: { canonical: "/projects/signal" },
};

export default function SignalPage() {
  return <SignalGame />;
}
