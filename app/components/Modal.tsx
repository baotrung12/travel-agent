"use client";
import React, {useEffect} from "react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {Button} from "@/app/components/admin/ui";

// Slide-over panel (Tailwind UI pattern) used for editing records.
export default function Modal({
  title,
  description,
  children,
  formId,
  saving = false,
  onClose,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  formId?: string;
  saving?: boolean;
  onClose: () => void;
  actions?: React.ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="relative z-50" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/75" onClick={onClose} />
      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
        <div className="pointer-events-auto w-screen max-w-3xl">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="bg-brand-700 px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-3 rounded-md text-brand-200 hover:text-white cursor-pointer"
                  aria-label="Đóng"
                >
                  <XMarkIcon className="size-6" />
                </button>
              </div>
              {description && <p className="mt-1 text-sm text-brand-100">{description}</p>}
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 sm:px-6">{children}</div>

            {(actions || formId) && (
              <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
                {actions ?? (
                  <>
                    <Button variant="secondary" onClick={onClose}>Hủy</Button>
                    <Button type="submit" form={formId} disabled={saving}>
                      {saving ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
