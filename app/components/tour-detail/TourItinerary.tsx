"use client";

import {useState} from "react";
import {ChevronDownIcon} from "@heroicons/react/24/outline";

type Day = { title: string; description: string };

// Styles for the rich-text HTML produced by the admin editor
export const richTextClass =
  "text-sm/7 text-slate-700 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 " +
  "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-gray-900 " +
  "[&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-gray-900 [&_h2]:mb-2 [&_h2]:text-base " +
  "[&_h2]:font-semibold [&_h2]:text-gray-900 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-gray-900 " +
  "[&_blockquote]:border-l-4 [&_blockquote]:border-brand-200 [&_blockquote]:pl-4 [&_blockquote]:italic";

export default function TourItinerary({ days, heading }: { days: Day[]; heading: React.ReactNode }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(days.map((_, i) => i)));
  const allOpen = open.size === days.length;

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div>
      <div className="flex items-center justify-between gap-x-4">
        {heading}
        <button
          onClick={() => setOpen(allOpen ? new Set() : new Set(days.map((_, i) => i)))}
          className="text-sm font-semibold text-brand-600 hover:text-brand-500 cursor-pointer"
        >
          {allOpen ? "Thu gọn tất cả" : "Mở rộng tất cả"}
        </button>
      </div>

      <ol className="mt-4 space-y-4">
        {days.map((day, index) => {
          const isOpen = open.has(index);
          return (
            <li key={index} className="overflow-hidden rounded-xl ring-1 ring-slate-200">
              <button
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-x-3 bg-slate-50 px-4 py-3 text-left hover:bg-brand-50 cursor-pointer"
              >
                <span className="flex-none rounded-md bg-brand-600 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-white">
                  NGÀY {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-semibold text-brand-950">{day.title || "Đang cập nhật"}</span>
                <ChevronDownIcon className={`size-5 flex-none text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && day.description && (
                <div
                  className={`border-t border-slate-200 bg-white px-5 py-4 ${richTextClass}`}
                  dangerouslySetInnerHTML={{ __html: day.description }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
