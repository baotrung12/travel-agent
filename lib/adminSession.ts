import jwt from "jsonwebtoken";

// Server-only helpers for the admin session cookie.
export const SESSION_COOKIE = "admin_session";
// Legacy readable flag cookie, no longer set; logout still clears it from older sessions
export const SESSION_HINT_COOKIE = "admin_logged_in";
export const SESSION_MAX_AGE = 8 * 60 * 60; // seconds

const ISSUER = "edutour";
const AUDIENCE = "edutour-admin";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }
  return secret;
}

export function signSession(email: string) {
  return jwt.sign({ sub: email, role: "admin" }, getSecret(), {
    algorithm: "HS256",
    expiresIn: SESSION_MAX_AGE,
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const payload = jwt.verify(token, getSecret(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return typeof payload === "object" && payload.role === "admin";
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
