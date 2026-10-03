import { NextResponse } from "next/server";
import { prisma } from "@/app/prisma";
import { sendContactNotification } from "@/lib/mailer";

// Spam protection: max submissions per IP within the window (in-memory, per server instance)
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000;
const submissions = new Map<string, { count: number; resetAt: number }>();

const PHONE_RE = /^(\+84|84|0)\d{9,10}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });

  // Honeypot: real users never fill this hidden field
  if (body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 20).replace(/[\s.\-()]/g, "");
  const email = clean(body.email, 150).toLowerCase();
  const message = clean(body.message, 2000) || null;
  const tourTitle = clean(body.tourTitle, 200) || null;

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Vui lòng nhập họ và tên";
  if (!PHONE_RE.test(phone)) errors.phone = "Số điện thoại không hợp lệ";
  if (!EMAIL_RE.test(email)) errors.email = "Email không hợp lệ";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const entry = submissions.get(ip);
  if (entry && entry.resetAt > now && entry.count >= MAX_PER_WINDOW) {
    return NextResponse.json({ error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." }, { status: 429 });
  }
  submissions.set(ip, entry && entry.resetAt > now ? { ...entry, count: entry.count + 1 } : { count: 1, resetAt: now + WINDOW_MS });

  const contact = await prisma.contactRequest.create({
    data: { name, phone, email, message, tourTitle },
  });

  // Saved first, so a mail failure never loses the request
  try {
    if (await sendContactNotification(contact)) {
      await prisma.contactRequest.update({ where: { id: contact.id }, data: { emailSent: true } });
    }
  } catch (error) {
    console.error("Failed to send contact email:", error);
  }

  return NextResponse.json({ ok: true });
}
