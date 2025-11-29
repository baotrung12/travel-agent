"use client";
import { useEffect, useState } from "react";
import AdminAuthPopup from "@/app/components/AdminAuthPopup";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <div>
      {authenticated ? (
        children
      ) : (
        <div className="flex items-center justify-center h-screen">
          <AdminAuthPopup />
        </div>
      )}
    </div>
  );
}
