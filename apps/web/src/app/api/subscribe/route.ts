import { NextRequest, NextResponse } from "next/server";

// Email capture. Provider-agnostic by design: it talks to Buttondown when
// BUTTONDOWN_API_KEY is set, and otherwise refuses honestly (503) rather than
// silently dropping signups. Swap the provider call below for ConvertKit,
// Resend Audiences, etc. without touching the UI.

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || now > e.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  e.count += 1;
  return e.count > MAX_PER_WINDOW;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
  }

  let email = "";
  try {
    email = (await req.json())?.email?.toString().trim().toLowerCase() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    // Honest failure: not wired yet. The UI shows a friendly "opening soon".
    return NextResponse.json(
      { error: "not_configured", message: "Signups are not open yet." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });

    // 201 = new subscriber. 400 with a duplicate often means already subscribed.
    if (res.ok) {
      return NextResponse.json({ ok: true });
    }
    if (res.status === 400) {
      return NextResponse.json({ ok: true, message: "You are already on the list." });
    }
    return NextResponse.json({ error: "Subscription failed. Try again later." }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Network error. Try again later." }, { status: 502 });
  }
}
