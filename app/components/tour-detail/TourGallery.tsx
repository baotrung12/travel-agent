"use client";

import {useCallback, useState} from "react";
import Image from "next/image";
import {PhotoIcon, Squares2X2Icon} from "@heroicons/react/24/outline";
import Lightbox from "@/app/components/tour-detail/Lightbox";

// Thumbnails fill a 2x2 area beside the main photo
function thumbSpan(count: number, index: number) {
  if (count === 1) return "sm:col-span-2 sm:row-span-2";
  if (count === 2) return "sm:col-span-2";
  if (count === 3 && index === 2) return "sm:col-span-2";
  return "";
}

// Hero gallery: one large photo + up to four thumbnails, with a full-screen viewer.
export default function TourGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const close = useCallback(() => setOpenIndex(null), []);
  const markFailed = (src: string) => setFailed((prev) => new Set(prev).add(src));

  // Hide photos whose files no longer exist
  const visible = images.filter((src) => !failed.has(src));

  if (visible.length === 0) {
    return (
      <div className="flex aspect-[16/7] items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200">
        <PhotoIcon className="size-16 text-brand-400" />
      </div>
    );
  }

  const thumbs = visible.slice(1, 5);

  return (
    <>
      <div className="relative grid gap-2 overflow-hidden rounded-2xl sm:grid-cols-4 sm:grid-rows-2 sm:aspect-[16/7]">
        <button
          onClick={() => setOpenIndex(0)}
          className={`group relative aspect-[4/3] overflow-hidden cursor-zoom-in sm:aspect-auto sm:row-span-2 ${thumbs.length ? "sm:col-span-2" : "sm:col-span-4"}`}
        >
          <Image
            src={visible[0]}
            alt={title}
            onError={() => markFailed(visible[0])}
            fill
            priority
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </button>
        {thumbs.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpenIndex(i + 1)}
            className={`group relative hidden overflow-hidden cursor-zoom-in sm:block ${thumbSpan(thumbs.length, i)}`}
          >
            <Image
              src={src}
              alt={`${title} – ảnh ${i + 2}`}
              onError={() => markFailed(src)}
              fill
              sizes="25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </button>
        ))}
        {visible.length > 1 && (
          <button
            onClick={() => setOpenIndex(0)}
            className="absolute right-4 bottom-4 inline-flex items-center gap-x-2 rounded-lg bg-white/95 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:bg-white cursor-pointer"
          >
            <Squares2X2Icon className="size-5" />
            Xem tất cả {visible.length} ảnh
          </button>
        )}
      </div>

      {openIndex !== null && (
        <Lightbox images={visible} index={openIndex} title={title} onChange={setOpenIndex} onClose={close} />
      )}
    </>
  );
}
