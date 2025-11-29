"use client";

import {useEffect, useState} from "react";
import PastTourCard from "@/app/components/PastTourCard";
import {Category} from "@/app/generated/prisma/enums";

export default function PastTours() {
  const [pastTours, setPastTours] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const resPast = await fetch("/api/v1/past-tours");
      setPastTours(await resPast.json());
    };
    fetchData();
  }, []);

  const [activeTab, setActiveTab] = useState<Category>(Category.STUDENT);

  const filteredTours = pastTours.filter((tour) => tour.category === activeTab);


  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6">Chùm tours trường học</h2>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-10">
          <button
            onClick={() => setActiveTab("STUDENT")}
            className={`px-6 py-2 rounded-full font-semibold transition cursor-pointer ${
              activeTab === "STUDENT"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 border hover:bg-gray-100"
            }`}
          >
            Học tập trải nghiệm cho học sinh
          </button>
          <button
            onClick={() => setActiveTab("TEACHER")}
            className={`px-6 py-2 rounded-full font-semibold transition cursor-pointer ${
              activeTab === "TEACHER"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 border hover:bg-gray-100"
            }`}
          >
            Chương trình tham quan giáo viên
          </button>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <PastTourCard tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}