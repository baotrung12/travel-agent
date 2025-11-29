"use client";

import { useState } from "react";

export default function BookingSection() {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);

  const adultPrice = 3990000;
  const childPrice = 1995000;

  const totalGuests = adults + children + babies;
  const totalPrice = adults * adultPrice + children * childPrice;

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md mt-10">
      {/* Tour Schedule */}
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Lịch khởi hành</h2>
      <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
        <p>Ngày khởi hành: <strong>22/11/2025</strong></p>
        <p>Ngày kết thúc: <strong>25/11/2025</strong></p>
        <p>Thời gian tour: <strong>4 ngày 3 đêm</strong></p>
        <p>Mã tour: <strong>STN084-2025-02789</strong></p>
      </div>

      {/* Pricing Section */}
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Giá tour</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-700">
        {/* Left: Adult + Children */}
        <div className="space-y-2">
          <p>Người lớn: <strong>3,990,000 đ</strong></p>
          <p>Trẻ em (05 - dưới 12 tuổi): <strong>1,995,000 đ</strong></p>
        </div>

        {/* Right: Baby Info */}
        <div className="space-y-2">
          <p>Trẻ em dưới 05 tuổi: <strong>Miễn phí</strong></p>
          <p className="text-sm text-gray-600">Bố mẹ tự lo cho bé</p>
          <p>Phụ thu phòng đơn: <strong>1,000,000 đ</strong></p>
        </div>
      </div>

      {/* Guest Selector */}
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Chọn số lượng khách</h2>
      <div className="space-y-4 mb-6">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Người lớn</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setAdults(Math.max(1, adults - 1))} className="px-3 py-1 bg-gray-300 rounded">−</button>
            <span>{adults}</span>
            <button onClick={() => setAdults(adults + 1)} className="px-3 py-1 bg-gray-300 rounded">+</button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Trẻ em (5 - 12 tuổi)</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setChildren(Math.max(0, children - 1))} className="px-3 py-1 bg-gray-300 rounded">−</button>
            <span>{children}</span>
            <button onClick={() => setChildren(children + 1)} className="px-3 py-1 bg-gray-300 rounded">+</button>
          </div>
        </div>

        {/* Babies */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Trẻ em dưới 5 tuổi</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setBabies(Math.max(0, babies - 1))} className="px-3 py-1 bg-gray-300 rounded">−</button>
            <span>{babies}</span>
            <button onClick={() => setBabies(babies + 1)} className="px-3 py-1 bg-gray-300 rounded">+</button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="text-lg text-gray-800 mb-6">
        <p>Tổng số khách: <strong>{totalGuests}</strong></p>
        <p>Tổng tiền: <strong>{totalPrice.toLocaleString("vi-VN")} đ</strong></p>
      </div>

      {/* Booking Button */}
      <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
        Đặt tour
      </button>
    </div>
  );
}
