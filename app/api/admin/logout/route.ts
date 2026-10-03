import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_HINT_COOKIE } from "@/lib/adminSession";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(SESSION_HINT_COOKIE);
  return res;
}
