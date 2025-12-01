"use client";
import React, { useState } from "react";
import {ConfirmReadyModal} from "@/app/components/ConfirmReadyModal";
import {Category} from "@/app/generated/prisma/enums";
import {TourSchedule} from "@/app/components/TourSchedule";

export interface Tour {
  id: string;
  title: string;
  slug: string;
  summary: string;
  promotion: string;
  tourSchedule: TourSchedule[];
  departureStart: string;
  departureEnd: string;
  departurePoint: string;
  duration: string;
  tourCode: string;
  price: string;
  ready: boolean;
  destination: string;
  category: Category;
  imageUrls: string[];
}


interface EditTourFormProps {
  tour: Tour;
  onClose: () => void;
}

export default function EditTourForm({ tour, onClose }: EditTourFormProps) {
  const [form, setForm] = useState({
    title: tour.title,
    slug: tour.slug,
    tourCode: tour.tourCode,
    departureStart: tour.departureStart.slice(0, 10),
    departureEnd: tour.departureEnd.slice(0, 10),
    duration: tour.duration,
    price: tour.price.toString(),
    tourSchedule: tour.tourSchedule || [],
    imageUrls: tour.imageUrls || [],
    images: [] as File[],
    destination: tour.destination,
    category: tour.category,
  });

  const [isReady, setIsReady] = useState(tour.ready);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ ...prev,  images: Array.from(e.target.files!) }));
    }
  };

  const addScheduleItem = () => {
    setForm((prev) => ({
      ...prev,
      tourSchedule: [...prev.tourSchedule, { date: "", title: "", description: "" }],
    }));
  };

  const formatDate = (date: string) => {
    return date.slice(0, 10);
  }

  const toggleReady = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`/api/admin/tours/${tour.id}/ready`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ready: !isReady }),
    });

    if (res.ok) {
      setIsReady(!isReady);
      setShowConfirm(false);
      alert(`Tour đã được ${!isReady ? "đánh dấu sẵn sàng" : "gỡ sẵn sàng"}`);
    } else {
      const data = await res.json();
      alert(data.error || "Thao tác thất bại");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sortedSchedule = [...form.tourSchedule].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("tourCode", form.tourCode);
    formData.append("departureStart", form.departureStart);
    formData.append("departureEnd", form.departureEnd);
    formData.append("duration", form.duration);
    formData.append("price", form.price);
    formData.append("tourSchedule", JSON.stringify(sortedSchedule));
    form.imageUrls.forEach((url) => formData.append("tourImages", url));
    formData.append("destination", form.destination);
    formData.append("category", form.category);
    form.images.forEach((file) => formData.append("images", file));

    await fetch(`/api/admin/tours/${tour.id}`, {
      method: "PATCH",
      body: formData as BodyInit,
    });

    onClose();
  };

  return (
    <form id="editTourForm" onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="text-gray-700 font-medium">Tên tour</span>
        <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border border-gray-400 rounded" />
      </label>

      <div className="flex items-center gap-3 mt-2">
        <span>
          Trạng thái:{" "}
          {isReady ? (
            <span className="text-green-600 font-bold">Đã sẵn sàng</span>
          ) : (
            <span className="text-red-600 font-bold">Chưa sẵn sàng</span>
          )}
        </span>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="px-3 py-1 rounded border text-sm bg-blue-600 text-white"
        >
          {isReady ? "Gỡ sẵn sàng" : "Đánh dấu sẵn sàng"}
        </button>
      </div>

      <label className="block">
        <span className="text-gray-700 font-medium">Slug (đường dẫn)</span>
        <input name="slug" value={form.slug} onChange={handleChange} className="w-full p-2 border border-gray-400 rounded" />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Mã tour</span>
        <input name="tourCode" value={form.tourCode} onChange={handleChange} className="w-full p-2 border border-gray-400 rounded" />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium w-32">Ngày khởi hành</span>
        <input type="date" name="departureStart" value={form.departureStart} onChange={handleChange} className="p-2 border border-gray-400 rounded" />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium w-32">Ngày kết thúc</span>
        <input type="date" name="departureEnd" value={form.departureEnd} onChange={handleChange} className="p-2 border border-gray-400 rounded" />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Thời lượng</span>
        <input name="duration" value={form.duration} onChange={handleChange} className="w-full p-2 border border-gray-400 rounded" />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Giá tour (VNĐ)</span>
        <input name="price" value={form.price} onChange={handleChange} className="w-full p-2 border border-gray-400 rounded" />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">Thêm ảnh mới</span>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-1 block w-full" />
      </label>

      <div className="flex gap-2 flex-wrap">
        {form.images.map((file, idx) => (
          <img key={idx} src={URL.createObjectURL(file)} alt="Preview" className="w-24 h-24 object-cover rounded border" />
        ))}
      </div>
      {form.imageUrls.map((url, idx) => (
        <div key={idx} className="relative">
          <img src={url} alt={`Image ${idx}`} className="w-24 h-24 object-cover rounded" />
          <button
            onClick={() => {
              const updated = form.imageUrls.filter((_, i) => i !== idx);
              setForm((prev) => ({ ...prev, imageUrls: updated }));
            }}
            className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Destination (optional) */}
      <div>
        <label htmlFor="destination">Điểm đến</label>
        <input
          type="text"
          id="destination"
          className="w-full border border-gray-400 rounded-md p-2"
          value={form.destination}
          name="destination"
          onChange={handleChange}
          placeholder="Ví dụ: Đà Nẵng"
        />
      </div>

      {/* Category (enum) */}
      <div>
        <label htmlFor="category">Loại tour</label>
        <select
          id="category"
          name="category"
          className="w-full border border-gray-400 rounded-md p-2"
          defaultValue={Category.STUDENT}
          onChange={(e) =>
            setForm({...form, category: e.target.value as Category}) // ✅ cast to enum
          }
        >
          <option value={Category.STUDENT}>Du lịch trải nghiệm cho HS</option>
          <option value={Category.TEACHER}>Du lịch giành cho giáo viên</option>
          <option value={Category.LONG_TRIP}>Du lịch dài ngày</option>
          <option value={Category.SHORT_TRIP}>Du lịch ngắn ngày</option>
          <option value={Category.SPECIAL}>Tour đặc biệt</option>
        </select>
      </div>

      <h3 className="font-semibold mt-4">Lịch trình tour</h3>
      {form.tourSchedule.map((day, index) => (
        <div key={index} className="mb-6">
          <label className="block font-semibold mb-2">Ngày {index + 1}:</label>
          <input
            type="date"
            value={formatDate(day.date)}
            onChange={(e) => {
              const updated = [...form.tourSchedule];
              updated[index].date = e.target.value;
              setForm((prev) => ({ ...prev, tourSchedule: updated }));
            }}
            className="border rounded px-3 py-2 w-full"
          />

          <label className="block mt-4">Địa điểm:</label>
          <input
            type="text"
            value={day.title}
            onChange={(e) => {
              const updated = [...form.tourSchedule];
              updated[index].title = e.target.value;
              setForm((prev) => ({ ...prev, tourSchedule: updated }));
            }}
            className="border rounded px-3 py-2 w-full"
          />

          <label className="block mt-4">Mô tả:</label>
          <textarea
            value={day.description}
            onChange={(e) => {
              const updated = [...form.tourSchedule];
              updated[index].description = e.target.value;
              setForm((prev) => ({ ...prev, tourSchedule: updated }));
            }}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      ))}
      <button type="button" onClick={addScheduleItem} className="text-blue-600 hover:underline">
        + Thêm ngày
      </button>
      {/* Confirmation Popup */}
      {showConfirm && (
        <ConfirmReadyModal
          show={showConfirm}
          message={
            <p>
              Bạn có chắc muốn{" "}
              <strong>{!isReady ? "đánh dấu là sẵn sàng" : "gỡ sẵn sàng"}</strong>{" "}
              cho tour này?
            </p>
          }
          onCancel={() => setShowConfirm(false)}
          onConfirm={toggleReady}
        />
      )}
    </form>
  );
}
