"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import AdminLoginForm from "@/app/components/AdminLoginForm";

export default function AdminAuthPopup({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Portal to <body> so ancestors with transforms/filters (e.g. the blurred navbar) can't clip the overlay
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <AdminLoginForm onSuccess={onSuccess} onCancel={onClose} />
      </div>
    </div>,
    document.body
  );
}
