"use client";

import {useEffect, useState} from "react";
import TourCard from "@/app/components/TourCard";

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
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">✨ Chùm tour phổ biến</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
