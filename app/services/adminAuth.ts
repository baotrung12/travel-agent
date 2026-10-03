// Client-side helpers. The session itself lives in an httpOnly cookie the browser sends automatically.

export async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/session", { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function logoutAdmin() {
  await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
}
