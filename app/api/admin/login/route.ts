import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  signSession,
} from "@/lib/adminSession";

// Brute-force protection: max attempts per IP within the window (in-memory, per server instance)
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

// Constant-time comparison so response timing doesn't leak how much of a value matched
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    const minutes = Math.ceil((entry.resetAt - now) / 60000);
    return NextResponse.json(
      { error: `Bạn đã thử quá nhiều lần. Vui lòng thử lại sau ${minutes} phút.` },
      { status: 429, headers: { "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)) } }
    );
  }

  const { email, password } = await req.json().catch(() => ({}));
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  const valid =
    typeof email === "string" && typeof password === "string" && !!expectedEmail && !!expectedPassword &&
    // evaluate both so timing doesn't reveal which one was wrong
    [safeEqual(email.trim().toLowerCase(), expectedEmail.toLowerCase()), safeEqual(password, expectedPassword)].every(Boolean);

  if (!valid) {
    const current = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(ip, { ...current, count: current.count + 1 });
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, signSession(expectedEmail), sessionCookieOptions);
  return res;
}
