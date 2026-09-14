import type { Metadata } from "next";
import { EverestSimulator } from "@/components/projects/everest/everest-simulator";

export const metadata: Metadata = {
  title: "EVEREST // AI in Production",
  description: "Climb the mountain. Operate the system. An interactive 3D expedition through AI agents, MCP tools, architecture trade-offs and production incidents.",
  alternates: { canonical: "/projects/everest-ai-production" },
  openGraph: {
    title: "EVEREST // AI in Production",
    description: "The mountain is the architecture. Explore agents, tools and production engineering in an interactive 3D simulator.",
    images: [{ url: "/projects/everest-ai-production/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function EverestPage() {
  return <EverestSimulator />;
}
