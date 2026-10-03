'use client';

import { useState } from 'react';
import {Tour} from "@/app/components/EditTourForm";
import {Category} from "@/app/generated/prisma/enums";
import {PastTour} from "@/app/generated/prisma/client";
import {buildDuration} from "@/utils/dateUtils";
import Link from "next/link";
import {ClockIcon} from "@heroicons/react/24/outline";

const tabs = ['Miền Tây', 'Miền Nam', 'Miền Trung'];

const tours = {
  'Miền Tây': [
    { title: 'Tour Cần Thơ – Chợ Nổi', duration: '2N1Đ', price: '1.200.000đ', image: '/cantho.jpg' },
    { title: 'Tour Bến Tre – Trà Vinh', duration: '3N2Đ', price: '1.450.000đ', image: '/bentre.jpg' },
  ],
  'Miền Nam': [
    { title: 'Tour Vũng Tàu – Biển Xanh', duration: '2N1Đ', price: '1.600.000đ', image: '/vungtau.jpg' },
    { title: 'Tour Tây Ninh – Núi Bà Đen', duration: '1N', price: '1.300.000đ', image: '/tayninh.jpg' },
  ],
  'Miền Trung': [
    { title: 'Tour Đà Nẵng – Hội An', duration: '3N2Đ', price: '2.800.000đ', image: '/danang.jpg' },
    { title: 'Tour Huế – Di sản', duration: '2N1Đ', price: '2.500.000đ', image: '/hue.jpg' },
  ],
};

function PastTourRow({ tour, label }: { tour: PastTour; label: string }) {
  const duration = tour.departureStart && tour.departureEnd
    ? buildDuration(new Date(tour.departureStart), new Date(tour.departureEnd))
    : tour.duration || "Chưa xác định";
  return (
    <Link
      href={`/past-tours/${tour.slug}`}
      className="group flex overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
    >
      <div className="relative w-1/3 flex-none bg-brand-50">
        {tour.tourImages?.[0] && (
          <img src={tour.tourImages[0]} alt={tour.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="flex min-h-32 flex-1 flex-col p-4">
        <h4 className="line-clamp-2 text-sm font-semibold text-brand-950 group-hover:text-brand-700">{tour.title}</h4>
        <p className="mt-2 inline-flex items-center gap-x-1 text-xs text-slate-500">
          <ClockIcon className="size-4" />{duration}
        </p>
        <div className="mt-auto flex items-center justify-between gap-x-2 pt-3">
          <span className="text-xs font-medium text-slate-500">{label}</span>
          <span className="text-xs font-semibold whitespace-nowrap text-brand-600 group-hover:text-brand-500">Chi tiết →</span>
        </div>
      </div>
    </Link>
  );
}

function Column({ title, highlight, tours, label }: { title: string; highlight: string; tours: PastTour[]; label: string }) {
  return (
    <div>
      <h3 className="border-b-2 border-brand-600 pb-2 text-base font-bold text-brand-950">
        {title} <span className="text-brand-600">{highlight}</span>
      </h3>
      <div className="mt-5 space-y-4">
        {tours.length > 0
          ? tours.map((tour) => <PastTourRow key={tour.id} tour={tour} label={label} />)
          : <p className="text-sm text-slate-500">Đang cập nhật.</p>}
      </div>
    </div>
  );
}

export default function TourSection({ tours }: { tours: PastTour[] }) {
  const studentTours = tours.filter((tour) => tour.category === Category.STUDENT);
  const teacherTours = tours.filter((tour) => tour.category === Category.TEACHER);

  return (
    <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
      <Column title="TOUR" highlight="HỌC TẬP DÀNH CHO HỌC SINH" tours={studentTours} label="Học tập trải nghiệm cho học sinh" />
      <Column title="TOUR" highlight="THAM QUAN CHO GIÁO VIÊN" tours={teacherTours} label="Tham quan cho giáo viên" />
    </div>
  );
}
