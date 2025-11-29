"use client";
import {useEffect, useState} from "react";
import Modal from "./Modal";
import EditPastTourForm from "./EditPastTourForm";
import EditTourForm from "@/app/components/EditTourForm";

export default function AdminPastToursTable() {
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      const res = await fetch("/api/admin/past-tours");
      const data = await res.json();
      setTours(data);
    };
    fetchTours();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản trị – Tour đã tổ chức</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2">Tên tour</th>
          <th className="border px-4 py-2">Mã tour</th>
          <th className="border px-4 py-2">Ngày khởi hành</th>
          <th className="border px-4 py-2">Giá</th>
          <th className="border px-4 py-2">Thao tác</th>
        </tr>
        </thead>
        <tbody>
        {tours.map((tour) => (
          <tr key={tour.id}>
            <td className="border px-4 py-2">{tour.title}</td>
            <td className="border px-4 py-2">{tour.tourCode}</td>
            <td className="border px-4 py-2">
              {new Date(tour.departureStart).toLocaleDateString("vi-VN")} –{" "}
              {new Date(tour.departureEnd).toLocaleDateString("vi-VN")}
            </td>
            <td className="border px-4 py-2">{tour.price} VNĐ</td>
            <td className="border px-4 py-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => setSelectedTourId(tour.id)}
              >
                Sửa
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      {/* Modal chỉnh sửa */}
      {selectedTourId && (
        <Modal
          title="Cập nhật tour"
          formId="editTourForm"
          onClose={() => setSelectedTourId(null)}
        >
          <EditPastTourForm tourId={selectedTourId} />
        </Modal>
      )}
    </div>
  );
}
