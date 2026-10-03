"use client";

import {useState} from "react";
import Image from "next/image";
import Lightbox from "@/app/components/tour-detail/Lightbox";

const PREVIEW_COUNT = 6;

// Photo grid for one itinerary day; hides photos that fail to load and opens a full-screen viewer.
export default function DayPhotos({images, title}: { images: string[]; title: string }) {
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = images.filter((src) => !failed.has(src));
  if (visible.length === 0) return null;

  const preview = visible.slice(0, PREVIEW_COUNT);
  const hidden = visible.length - preview.length;

  return (
    <>
      <ul role="list" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {preview.map((src, i) => {
          const isLastWithMore = hidden > 0 && i === preview.length - 1;
          return (
            <li key={src}>
              <button
                onClick={() => setOpenIndex(i)}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 cursor-zoom-in"
              >
                <Image
                  src={src}
                  alt={`${title} – ảnh ${i + 1}`}
                  fill
                  sizes="(min-width: 640px) 220px, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  onError={() => setFailed((prev) => new Set(prev).add(src))}
                />
                {isLastWithMore && (
                  <span className="absolute inset-0 flex items-center justify-center bg-brand-950/60 text-lg font-semibold text-white">
                    +{hidden} ảnh
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {openIndex !== null && (
        <Lightbox images={visible} index={openIndex} title={title} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
