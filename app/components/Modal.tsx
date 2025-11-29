export default function Modal({
                                title,
                                children,
                                formId,
                                onClose,
                                actions, // optional array of buttons
                                size = "lg", // optional size
                              }: {
  title: string;
  children: React.ReactNode;
  formId?: string;
  onClose: () => void;
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const widthClass =
    size === "sm"
      ? "max-w-md"
      : size === "md"
        ? "max-w-2xl"
        : "max-w-4xl";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white w-full ${widthClass} rounded-lg shadow-lg flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b font-semibold text-lg sticky top-0 bg-white z-10">
          {title}
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">{children}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t sticky bottom-0 bg-white z-10">
          <div className="flex gap-4 mt-4">
            {actions ? (
              actions
            ) : formId ? (
              <>
                <button
                  type="submit"
                  form={formId}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-600 hover:underline"
                >
                  Hủy
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
