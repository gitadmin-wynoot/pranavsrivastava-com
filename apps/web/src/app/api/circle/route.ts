import { NextRequest, NextResponse } from "next/server";

// Invite requests for the Eindhoven circle. Same honest, provider-agnostic
// approach as /api/subscribe: tags the request in Buttondown when configured,
// otherwise refuses cleanly (503) instead of dropping it. Kept deliberately
// low-volume — this is an invitation funnel, not a newsletter.

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 4;
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
  let note = "";
  try {
    const body = await req.json();
    email = body?.email?.toString().trim().toLowerCase() ?? "";
    note = body?.note?.toString().trim().slice(0, 600) ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "not_configured", message: "Requests are not open yet." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: { Authorization: `Token ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email_address: email,
        tags: ["circle"],
        notes: note,
      }),
    });
    if (res.ok || res.status === 400) {
      // 400 commonly means already on file — treat as received.
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Could not submit. Try again later." }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Network error. Try again later." }, { status: 502 });
  }
}
