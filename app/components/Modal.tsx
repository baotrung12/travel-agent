import {XMarkIcon} from "@heroicons/react/16/solid";

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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white w-full ${widthClass} rounded-md shadow-lg flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-300 font-semibold text-lg sticky top-0 bg-white z-10">
          {title}
          <button
            onClick={onClose}
            className="absolute top-5 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>


        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">{children}</div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-300 sticky bottom-0 bg-white z-10">
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
