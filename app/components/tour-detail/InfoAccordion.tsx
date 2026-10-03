"use client";

import {useState} from "react";
import {MinusIcon, PlusIcon} from "@heroicons/react/24/outline";

export type InfoItem = { title: string; content: React.ReactNode };

// Tailwind UI-style FAQ disclosure list
export default function InfoAccordion({ items }: { items: InfoItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <dl className="divide-y divide-slate-200 rounded-xl ring-1 ring-slate-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.title} className="px-4 py-3.5">
            <dt>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-x-4 text-left text-brand-950 hover:text-brand-700 cursor-pointer"
              >
                <span className="font-semibold">{item.title}</span>
                <span className="flex h-6 items-center text-brand-600">
                  {isOpen ? <MinusIcon className="size-5" /> : <PlusIcon className="size-5" />}
                </span>
              </button>
            </dt>
            {isOpen && <dd className="mt-2 pr-10 text-sm/7 text-slate-700">{item.content}</dd>}
          </div>
        );
      })}
    </dl>
  );
}
