import {useEffect, useState} from "react";
import EditTourForm from "@/app/components/EditTourForm";
import Modal from "@/app/components/Modal";

export function ManageTours({ title }: { title: string }) {
  const [tours, setTours] = useState([]);

  const [editingTour, setEditingTour] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      const res = await fetch("/api/admin/tours");
      const data = await res.json();
      setTours(data);
    };

    fetchTours();
  }, []);


  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-blue-700 mb-4">{title}</h3>
      <table className="w-full table-auto border-collapse">
        <thead>
        <tr className="bg-blue-50 text-left">
          <th className="p-2">Tiêu đề</th>
          <th className="p-2">Ngày</th>
          <th className="p-2">Thời gian</th>
          <th className="p-2">Phương tiện</th>
          <th className="p-2">Hành động</th>
        </tr>
        </thead>
        <tbody>
        {tours.map((tour) => (
          <tr key={tour.id} className="border-t">
            <td className="p-2">{tour.title}</td>
            <td className="p-2">{tour.date}</td>
            <td className="p-2">{tour.duration}</td>
            <td className="p-2">{tour.departurePoint}</td>
            <td className="p-2 space-x-2">
              <button
                onClick={() => setEditingTour(tour)}
                className="text-blue-600 hover:underline"
              >
                Sửa
              </button>
              <button className="text-red-600 hover:underline">Xoá</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      {editingTour && (
        <Modal
          title="Cập nhật tour"
          formId="editTourForm"
          onClose={() => setEditingTour(null)}
        >
          <EditTourForm tour={editingTour} onClose={() => setEditingTour(null)} />
        </Modal>
      )}
    </div>
  );
}
