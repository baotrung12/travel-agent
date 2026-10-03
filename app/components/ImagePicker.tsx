"use client";
import React, {useEffect, useRef, useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon, PhotoIcon, StarIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {StarIcon as StarSolidIcon} from "@heroicons/react/24/solid";
import type {ImageItem} from "@/app/services/uploadImage";

interface ImagePickerProps {
  // Ordered images: uploaded URLs and/or new files. The first one is the cover image.
  value: ImageItem[];
  onChange: (items: ImageItem[]) => void;
}

export default function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const previews = useRef(new Map<File, string>());

  // Object URLs for new files, created once per file and released when removed
  const previewOf = (item: ImageItem) => {
    if (typeof item === "string") return item;
    let url = previews.current.get(item);
    if (!url) {
      url = URL.createObjectURL(item);
      previews.current.set(item, url);
    }
    return url;
  };

  useEffect(() => {
    const map = previews.current;
    for (const [file, url] of map) {
      if (!value.includes(file)) {
        URL.revokeObjectURL(url);
        map.delete(file);
      }
    }
  }, [value]);

  useEffect(() => {
    const map = previews.current;
    return () => map.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addFiles = (list: FileList | null) => {
    const images = Array.from(list ?? []).filter((file) => file.type.startsWith("image/"));
    if (images.length) onChange([...value, ...images]);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length || from === to) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => { if (dragIndex === null) { e.preventDefault(); setDragging(true); } }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { if (dragIndex !== null) return; e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
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

      {value.length > 0 && (
        <>
          <p className="text-xs text-gray-500">
            Ảnh đầu tiên là <span className="font-semibold text-gray-700">ảnh bìa</span>. Nhấn ☆ để chọn ảnh bìa, hoặc kéo thả / dùng mũi tên để sắp xếp.
          </p>
          <ul role="list" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {value.map((item, idx) => {
              const isCover = idx === 0;
              const src = previewOf(item);
              return (
                <li
                  key={`${src}-${idx}`}
                  draggable
                  onDragStart={() => setDragIndex(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (dragIndex !== null) move(dragIndex, idx); setDragIndex(null); }}
                  onDragEnd={() => setDragIndex(null)}
                  className={`group relative overflow-hidden rounded-lg ring-2 ${isCover ? "ring-brand-600" : "ring-transparent"} ${dragIndex === idx ? "opacity-50" : ""}`}
                >
                  <img src={src} alt={`Ảnh ${idx + 1}`} className="aspect-[4/3] w-full cursor-grab bg-gray-100 object-cover" />

                  {/* Top-left labels */}
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    {isCover && (
                      <span className="inline-flex items-center gap-x-1 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        <StarSolidIcon className="size-3" />Ảnh bìa
                      </span>
                    )}
                    {item instanceof File && (
                      <span className="rounded bg-gray-900/70 px-1.5 py-0.5 text-[10px] font-medium text-white">Mới</span>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, i) => i !== idx))}
                    aria-label="Xoá ảnh"
                    title="Xoá ảnh"
                    className="absolute top-1.5 right-1.5 rounded-full bg-white/90 p-1 text-gray-700 shadow-sm hover:bg-red-600 hover:text-white cursor-pointer"
                  >
                    <XMarkIcon className="size-4" />
                  </button>

                  {/* Bottom toolbar */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent px-1.5 pt-6 pb-1.5">
                    <button
                      type="button"
                      onClick={() => move(idx, idx - 1)}
                      disabled={idx === 0}
                      aria-label="Chuyển sang trái"
                      title="Chuyển sang trái"
                      className="rounded bg-white/90 p-1 text-gray-700 hover:bg-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="size-3.5" />
                    </button>
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => move(idx, 0)}
                        title="Đặt làm ảnh bìa"
                        className="inline-flex items-center gap-x-1 rounded bg-white/90 px-1.5 py-1 text-[11px] font-semibold whitespace-nowrap text-brand-700 hover:bg-white cursor-pointer"
                      >
                        <StarIcon className="size-3.5" />Đặt bìa
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => move(idx, idx + 1)}
                      disabled={idx === value.length - 1}
                      aria-label="Chuyển sang phải"
                      title="Chuyển sang phải"
                      className="ml-auto rounded bg-white/90 p-1 text-gray-700 hover:bg-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="size-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
