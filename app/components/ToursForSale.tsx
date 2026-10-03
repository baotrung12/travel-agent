"use client";

import {useEffect, useState} from "react";
import TourCard from "@/app/components/TourCard";
import SectionHeading from "@/app/components/SectionHeading";

export default function ToursForSale() {
  const [tours, setTours] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const resTours = await fetch("/api/v1/tours");
      setTours(await resTours.json());
    };
    fetchData();
  }, []);

  return (
    <section className="scroll-mt-16 bg-white py-20" id="tourForSale">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tour nổi bật"
          title="Chùm tour phổ biến"
          subtitle="Những hành trình học tập và trải nghiệm được nhiều trường học lựa chọn."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
