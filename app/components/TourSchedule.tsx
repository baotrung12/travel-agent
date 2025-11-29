"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export interface TourSchedule {
  date: string;
  title: string;
  description: string;
}

export default function TourSchedule({ schedule }: { schedule: TourSchedule[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white mt-12 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Lịch trình chi tiết</h2>
      <div className="space-y-4">
        {schedule.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">
                  {item.date}: {item.title}
                </span>
                <span className="text-blue-600">
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>

              <div
                className={`px-4 py-3 text-gray-700 border-t border-gray-200 transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
