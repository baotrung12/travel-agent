"use client";
import { useEffect, useState } from "react";
import AdminLoginForm from "@/app/components/AdminLoginForm";
import { checkAdminSession } from "@/app/services/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // null = not checked yet, avoids flashing the login form for logged-in users
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminSession().then(setAuthenticated);
  }, []);

  if (authenticated === null) return null;

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 px-4">
        <AdminLoginForm onSuccess={() => setAuthenticated(true)} />
      </div>
    );
  }

  return <>{children}</>;
}
