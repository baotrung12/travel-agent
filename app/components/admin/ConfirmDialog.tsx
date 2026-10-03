"use client";
import React, {useEffect} from "react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";
import {Button} from "@/app/components/admin/ui";

// Alert dialog (Tailwind UI "simple alert with gray footer" pattern).
export default function ConfirmDialog({title, message, confirmLabel = "Xác nhận", busy = false, onConfirm, onCancel}: {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div className="relative z-[60]" role="alertdialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/75" onClick={onCancel} />
      <div className="pointer-events-none fixed inset-0 flex items-end justify-center p-4 sm:items-center">
        <div className="pointer-events-auto w-full overflow-hidden rounded-lg bg-white text-left shadow-xl sm:max-w-lg">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                <ExclamationTriangleIcon className="size-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <div className="mt-2 text-sm text-gray-500">{message}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 bg-gray-50 px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
            <Button variant="secondary" onClick={onCancel} disabled={busy}>Hủy</Button>
            <Button variant="danger" onClick={onConfirm} disabled={busy}>
              {busy ? "Đang xử lý..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
