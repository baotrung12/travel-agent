import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/adminSession";

// Public admin endpoints: everything else under /api/admin requires a valid session
const PUBLIC_PATHS = new Set(["/api/admin/login", "/api/admin/logout"]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Reject cross-site writes (CSRF defence in depth on top of SameSite=Strict)
  if (req.method !== "GET" && req.method !== "HEAD") {
    const origin = req.headers.get("origin");
    if (origin && new URL(origin).host !== req.headers.get("host")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  if (!verifySession(req.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
