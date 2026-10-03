"use client";

import {useEffect, useState} from "react";
import PastTourCard from "@/app/components/PastTourCard";
import {Category} from "@/app/generated/prisma/enums";
import TourSection from "@/app/components/TourList";
import SectionHeading from "@/app/components/SectionHeading";

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
    <section className="scroll-mt-16 bg-slate-50 py-20" id="pastTours">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tour trường học"
          title="Chùm tours trường học"
          subtitle="Các chuyến đi chúng tôi đã tổ chức cho học sinh và giáo viên."
        />

        <div className="mt-12">
          <TourSection tours={pastTours} />
        </div>
      </div>
    </section>
  );
}