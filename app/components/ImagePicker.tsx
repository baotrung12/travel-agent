"use client";
import { useState } from "react";

interface ImagePickerProps {
  initialFiles?: string[];
  onChange: (files: File[], urls: string[]) => void;
}

export default function ImagePicker({ initialFiles = [], onChange }: ImagePickerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialFiles);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);

      // tạo preview nội bộ cho hiển thị
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);

      // emit: chỉ gửi File[] và danh sách URL cũ (không blob URL)
      onChange(updatedFiles, initialFiles);
    }
  };

  const handleDelete = (index: number) => {
    const initialCount = initialFiles.length;
    let updatedFiles = [...files];
    let updatedUrls = [...initialFiles];

    if (index < initialCount) {
      // xoá ảnh cũ → cập nhật danh sách URL
      updatedUrls = initialFiles.filter((_, i) => i !== index);
    } else {
      // xoá ảnh mới → xoá File tương ứng
      const fileIndex = index - initialCount;
      updatedFiles = files.filter((_, i) => i !== fileIndex);
    }

    // xoá preview nội bộ
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFiles(updatedFiles);

    // emit: gửi File[] và danh sách URL mới (chỉ khi xoá ảnh cũ)
    onChange(updatedFiles, updatedUrls);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="w-full border border-gray-400 rounded-md p-2"
      />

      <div className="grid grid-cols-3 gap-4">
        {previewUrls.map((url, idx) => (
          <div key={idx} className="relative group">
            <img src={url} alt={`preview-${idx}`} className="w-full h-32 object-cover rounded" />
            <button
              type="button"
              onClick={() => handleDelete(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-80 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
