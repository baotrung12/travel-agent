import { NextResponse } from "next/server";

// Reaching this handler means proxy.ts already verified the session cookie
export async function GET() {
  return NextResponse.json({ authenticated: true });
}
