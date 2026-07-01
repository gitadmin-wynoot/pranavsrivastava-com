// The site assistant's persona and (for now) a deterministic, voice-matched
// responder. No LLM is called yet — this is the scaffold. When you wire a real
// provider, keep SYSTEM_PROMPT and swap `generateReply` to call the model with
// it. The voice rules below mirror docs/voice-and-style.md.

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * System prompt for when a real model is wired in. It encodes who is speaking,
 * what it may say, and — critically — how it must sound (not like a default bot).
 */
export const SYSTEM_PROMPT = `You are the guide to Pranav Srivastava's personal site (an AI lab, portfolio, and course platform).

WHO PRANAV IS (only state what is here or on the site):
- Software engineer and product thinker. 15+ years across telecom, banking, automotive, and finance. Architect by instinct, not by title.
- Helped grow the KPN developer portal (developer.kpn.com) from a small incubator to a revenue-generating enterprise product. Works on CPaaS, anti-fraud APIs, AWS serverless.
- MSc in AI (MTU Cork). Loves computer vision, knowledge representation, and metaheuristic optimization. Built a Mars-rover knowledge-representation project and a genetic-algorithm TSP solver.
- Founder of Wynoot (AI platform for service businesses); takes on a little independent consulting. Grew up in Jhansi, India; in the Netherlands since 2016. Picked up skiing at 40.

HOW YOU SPEAK:
- Like Pranav would: grounded, curious, plain, quietly confident. Short answers.
- You speak ABOUT Pranav warmly; you never pretend to be him or to be human.
- Specific over grand. Point people to real pages: /about, /about/research, /learn, /ai-lab, /blog, his Medium, /contact.
- If you don't know, say so plainly and suggest /contact. Never invent facts.

NEVER USE: "Certainly!", "Great question!", "I'd be happy to", "As an AI", "Let me break this down", "cutting-edge", "revolutionary", "leverage", "seamless", "unlock", "supercharge". Don't end every message with a follow-up question. If a sentence could come from any generic bot, rewrite it.`;

const PROFILE_URL_MEDIUM = "https://pranav-srivastava.medium.com";

/** Deterministic, voice-matched replies for the scaffold (no model call). */
export function generateReply(userMessage: string): string {
  const m = userMessage.toLowerCase().trim();

  // Whole-word / phrase match so "him" doesn't trigger "hi" and "about" in
  // "tell me about skiing" doesn't hijack the bio intent.
  const has = (...words: string[]) =>
    words.some((w) => new RegExp(`(^|[^a-z])${w}($|[^a-z])`).test(m));

  if (!m) {
    return "Type a question and I'll point you to the right corner of the site.";
  }

  // Specific intents first, generic ones (bio, greeting) last.

  if (has("contact", "email", "reach", "reach out", "get in touch", "hire", "talk to him", "connect", "meet")) {
    return "Easiest is /contact. He's also on LinkedIn and Medium — links are at the bottom of /about.";
  }

  if (has("ski", "skiing", "tennis", "travel", "hobby", "hobbies", "fun", "family", "podcast", "outside work")) {
    return "Beyond the code: skiing (picked it up at 40), tennis, travel, and the occasional podcast — one recorded mid-run on a slope. The 'Beyond the code' section on /about has it.";
  }

  if (
    has("research", "msc", "masters", "thesis", "computer vision", "optimization", "optimisation", "metaheuristic", "knowledge representation", "blockchain", "genetic", "rover")
  ) {
    return "That's his favourite territory. The MSc work — computer vision, knowledge representation (a Mars-rover project), genetic algorithms, plus a blockchain food-traceability hackathon — is written up properly at /about/research.";
  }

  if (has("course", "courses", "learn", "teach", "training", "tutorial", "mcp", "agent", "agents", "semantic search")) {
    return "The courses live at /learn — practical tracks on MCP, AI agents, and semantic search. Built from real production experience, not filler.";
  }

  if (has("wynoot")) {
    return "Wynoot is Pranav's AI platform for service businesses — booking, calendar, no-code, LMS, with AI use cases in active development. It's still finding its shape. More at wynoot.com.";
  }

  if (has("consult", "consulting", "freelance", "engagement", "hire")) {
    return "Pranav takes on a small number of consulting engagements — taking AI from experiment to production: agent architecture, API design, cloud, observability. Start a conversation at /contact.";
  }

  if (has("project", "projects", "building", "lab", "ai lab", "experiment", "experiments")) {
    return "The live experiments and projects are in the AI Lab — /ai-lab. Agents, MCP, computer vision, the things currently in the oven.";
  }

  if (has("fraud", "api", "apis", "kpn", "cpaas", "telecom", "enterprise", "aws", "cloud", "serverless")) {
    return "That's his day-to-day: enterprise-scale systems — CPaaS, anti-fraud APIs, API platforms, AWS serverless. The 'Selected impact' section on /about has the specifics.";
  }

  if (has("medium", "writing", "write", "blog", "essay", "essays", "article", "articles")) {
    return `Shorter notes are on the /blog, longer essays on Medium — ${PROFILE_URL_MEDIUM}. Recent ones cover production-ready AI agents and the GenAI landscape in 2026.`;
  }

  if (has("who", "background", "yourself", "story", "career", "experience", "pranav", "about him", "about pranav", "bio")) {
    return "Pranav is a software engineer and product thinker — 15+ years across telecom, banking, automotive, and finance, now deep in applied AI. Founder of Wynoot. The full arc — small-town India to the Netherlands, enterprise to his own products — is on /about.";
  }

  if (has("hi", "hello", "hey", "hiya", "greetings", "good morning", "good evening")) {
    return "Hey. I'm the guide to Pranav's site. Ask about his work, his AI research, the courses, or how to reach him.";
  }

  if (has("thanks", "thank you", "thank", "cheers", "appreciate")) {
    return "Anytime. Have a look around — /about and /ai-lab are good places to start.";
  }

  return "I can point you to Pranav's background (/about), his AI research (/about/research), courses (/learn), projects (/ai-lab), or how to reach him (/contact). What are you after?";
}
