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

// Tolerates values pasted into a hosting dashboard with surrounding quotes or whitespace
function envValue(name: string) {
  return process.env[name]?.trim().replace(/^(["'])(.*)\1$/, "$2").trim() || undefined;
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
  const expectedEmail = envValue("ADMIN_EMAIL");
  const expectedPassword = envValue("ADMIN_PASSWORD");
  if (!expectedEmail || !expectedPassword) {
    console.error("Admin login unavailable: ADMIN_EMAIL and/or ADMIN_PASSWORD is not set for this environment");
  }

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
  let token: string;
  try {
    token = signSession(expectedEmail);
  } catch (error) {
    // e.g. JWT_SECRET missing or shorter than 32 characters in production
    console.error("Admin login failed to create session:", error);
    return NextResponse.json({ error: "Máy chủ chưa được cấu hình đăng nhập. Vui lòng liên hệ quản trị kỹ thuật." }, { status: 500 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}
