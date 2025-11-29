import Modal from "@/app/components/Modal";
import React from "react";

export function ConfirmReadyModal({show, message, onConfirm, onCancel}: {
  show: boolean;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!show) return null;

  return (
    <Modal
      title="Xác nhận"
      onClose={onCancel}
      size="sm"
      actions={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Xác nhận
          </button>
        </>
      }
    >
      {message}
    </Modal>
  );
}
