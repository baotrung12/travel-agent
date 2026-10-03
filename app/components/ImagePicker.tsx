"use client";
import React, {useEffect, useMemo, useState} from "react";
import {PhotoIcon, XMarkIcon} from "@heroicons/react/24/outline";

interface ImagePickerProps {
  initialFiles?: string[];
  // files = new local files to upload, urls = already-uploaded images that are kept
  onChange: (files: File[], urls: string[]) => void;
}

export default function ImagePicker({ initialFiles = [], onChange }: ImagePickerProps) {
  const [existing, setExisting] = useState<string[]>(initialFiles);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const filePreviews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  useEffect(() => () => filePreviews.forEach((url) => URL.revokeObjectURL(url)), [filePreviews]);

  const update = (nextFiles: File[], nextExisting: string[]) => {
    setFiles(nextFiles);
    setExisting(nextExisting);
    onChange(nextFiles, nextExisting);
  };

  const addFiles = (list: FileList | null) => {
    const images = Array.from(list ?? []).filter((file) => file.type.startsWith("image/"));
    if (images.length) update([...files, ...images], existing);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const previews = [
    ...existing.map((url, i) => ({url, remove: () => update(files, existing.filter((_, j) => j !== i))})),
    ...filePreviews.map((url, i) => ({url, remove: () => update(files.filter((_, j) => j !== i), existing), isNew: true})),
  ];

  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={
          "flex cursor-pointer justify-center rounded-lg border border-dashed px-6 py-8 transition " +
          (dragging ? "border-brand-500 bg-brand-50" : "border-gray-900/25 hover:border-brand-400 hover:bg-gray-50")
        }
      >
        <div className="text-center">
          <PhotoIcon aria-hidden="true" className="mx-auto size-10 text-gray-300" />
          <div className="mt-3 text-sm/6 text-gray-600">
            <span className="font-semibold text-brand-600">Chọn ảnh</span> hoặc kéo thả vào đây
          </div>
          <p className="text-xs/5 text-gray-500">PNG, JPG, WEBP — có thể chọn nhiều ảnh</p>
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
        />
      </label>

      {previews.length > 0 && (
        <ul role="list" className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {previews.map((preview, idx) => (
            <li key={preview.url} className="group relative">
              <img
                src={preview.url}
                alt={`Ảnh ${idx + 1}`}
                className="aspect-[4/3] w-full rounded-lg bg-gray-100 object-cover ring-1 ring-gray-900/5"
              />
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-gray-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Ảnh bìa
                </span>
              )}
              {"isNew" in preview && (
                <span className="absolute top-1.5 left-1.5 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Mới
                </span>
              )}
              <button
                type="button"
                onClick={preview.remove}
                aria-label="Xoá ảnh"
                className="absolute top-1.5 right-1.5 rounded-full bg-white/90 p-1 text-gray-700 shadow-sm opacity-100 hover:bg-red-600 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
              >
                <XMarkIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
