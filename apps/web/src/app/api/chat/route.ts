import { NextRequest, NextResponse } from "next/server";
import { generateReply, type ChatMessage } from "@/lib/site-assistant";

// Simple in-memory rate limit (per IP, per minute). Good enough for a scaffold;
// swap for a durable store (Redis/Upstash) before relying on it in production.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Slow down a moment — too many messages." },
      { status: 429 }
    );
  }

  let body: { messages?: ChatMessage[]; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const lastUser =
    body.message ??
    [...(body.messages ?? [])].reverse().find((m) => m.role === "user")?.content ??
    "";

  if (!lastUser || lastUser.length > 1000) {
    return NextResponse.json(
      { error: "Send a short message (under 1000 characters)." },
      { status: 400 }
    );
  }

  // ── Scaffold: deterministic, voice-matched reply (no model call). ──────────
  // To go live, replace this line with a call to your provider using
  // SYSTEM_PROMPT from "@/lib/site-assistant" and the conversation history.
  const reply = generateReply(lastUser);

  return NextResponse.json({ reply });
}
