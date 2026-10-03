"use client";

import {useEffect} from "react";
import Image from "next/image";
import {ChevronLeftIcon, ChevronRightIcon, XMarkIcon} from "@heroicons/react/24/outline";

// Full-screen photo viewer with arrows, thumbnails and keyboard navigation.
export default function Lightbox({images, index, title, onChange, onClose}: {
  images: string[];
  index: number;
  title: string;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const step = (delta: number) => onChange((index + delta + images.length) % images.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, images.length, onChange, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-gray-950/95" role="dialog" aria-modal="true">
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-300 sm:px-6">
        <span>{index + 1} / {images.length}</span>
        <button onClick={onClose} aria-label="Đóng" className="rounded-full p-2 hover:bg-white/10 hover:text-white cursor-pointer">
          <XMarkIcon className="size-6" />
        </button>
      </div>
      <div className="relative flex-1" onClick={onClose}>
        <Image
          src={images[index]}
          alt={`${title} – ảnh ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Ảnh trước"
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-6 cursor-pointer"
            >
              <ChevronLeftIcon className="size-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Ảnh sau"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-6 cursor-pointer"
            >
              <ChevronRightIcon className="size-6" />
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-6">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => onChange(i)}
            className={`relative h-14 w-20 flex-none overflow-hidden rounded-md cursor-pointer ${i === index ? "ring-2 ring-white" : "opacity-50 hover:opacity-100"}`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
