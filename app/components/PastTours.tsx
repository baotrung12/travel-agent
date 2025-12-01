"use client";

import {useEffect, useState} from "react";
import PastTourCard from "@/app/components/PastTourCard";
import {Category} from "@/app/generated/prisma/enums";
import TourSection from "@/app/components/TourList";

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
    <section className="bg-gray-100 py-12" id="pastTours">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Title */}
        <h2 className="text-3xl font-bold mb-6">Chùm tours trường học</h2>

        {/* Tour Cards */}
        <TourSection tours={pastTours} />
      </div>
    </section>
  );
}