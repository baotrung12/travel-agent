'use client';

import { useState } from 'react';
import {Tour} from "@/app/components/EditTourForm";
import {Category} from "@/app/generated/prisma/enums";
import {PastTour} from "@/app/generated/prisma/client";
import {buildDuration} from "@/utils/dateUtils";
import Link from "next/link";

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

export default function TourSection({ tours }: { tours: PastTour[] }) {
  const studentTours = tours.filter((tour) => tour.category === Category.STUDENT);
  const teacherTours = tours.filter((tour) => tour.category === Category.TEACHER);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* Left Column: STUDENT TOURS */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-800 mb-4 text-left border-b-2 border-sky-300">TOUR <span className="text-sky-600">HỌC TẬP DÀNH CHO HỌC SINH</span></h2>
        {studentTours.map((tour, index) => (
          <div key={`student-${index}`} className="bg-white rounded-lg shadow flex overflow-hidden">
            <img src={tour.tourImages[0]} alt={tour.title} className="w-1/3 h-full object-cover" />
            <div className="flex-1 p-4 flex flex-col items-start">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 text-left">{tour.title}</h3>
              <p className="text-xs text-gray-600 mb-3">Thời gian: <b>{buildDuration(new Date(tour.departureStart), new Date(tour.departureEnd))}</b></p>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-sky-600">Học tập trải nghiệm cho học sinh</span>
                <Link href={`/past-tours/${tour.slug}`}>
                  <button className="px-3 py-1 text-xs bg-sky-600 text-white rounded hover:bg-sky-700 cursor-pointer">Chi tiết</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column: TEACHER TOURS */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-800 mb-4 text-left border-b-2 border-sky-300">TOUR <span className="text-sky-600">THAM QUAN CHO GIÁO VIÊN</span></h2>
        {teacherTours.map((tour, index) => (
          <div key={`teacher-${index}`} className="bg-white rounded-lg shadow flex overflow-hidden">
            <img src={tour.tourImages[0]} alt={tour.title} className="w-1/3 h-32 object-cover" />
            <div className="flex-1 p-4 flex flex-col items-start">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 text-left">{tour.title}</h3>
              <p className="text-xs text-gray-600 mb-3">Thời gian: {buildDuration(new Date(tour.departureStart), new Date(tour.departureEnd))}</p>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-sky-600">Tham quan cho giáo viên</span>
                <Link href={`/past-tours/${tour.slug}`}>
                  <button className="px-3 py-1 text-xs bg-sky-600 font-semibold text-white rounded hover:bg-sky-700 cursor-pointer">Chi tiết</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}