"use client";

import {useEffect, useState} from "react";
import TourCard from "@/app/components/TourCard";
import TourList from "@/app/components/TourList";
import TourSection from "@/app/components/TourList";
import PastTourCard from "@/app/components/PastTourCard";

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
    <section className="py-16 bg-white" id="tourForSale">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">✨ Chùm tour phổ biến</h2>
        {tours.map((tour) => (
          <PastTourCard tour={tour} />
        ))}
      </div>
    </section>
  );
}
