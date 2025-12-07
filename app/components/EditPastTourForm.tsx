"use client";
import React, { useState, useEffect } from "react";
import ImagePicker from "./ImagePicker";
import {ConfirmReadyModal} from "@/app/components/ConfirmReadyModal";
import {Category} from "@/app/generated/prisma/enums";
import toast from "react-hot-toast";
import {uploadImages} from "@/app/services/uploadImage";

interface PastSchedule {
  id: string | null;
  date: string;
  title: string;
  description: string;
  imageUrls: string[];
}

export interface PastTour {
  id: string;
  title: string;
  tourCode: string;
  departureStart: string;
  departureEnd: string;
  duration: number;
  destination: string;
  category: Category;
  price: number;
  participants: number | null;
  feedback: string | null;
  tourImages: string[];
  pastSchedule: PastSchedule[];
}

export default function EditPastTourForm({ tourId }: { tourId: string }) {
  const [form, setForm] = useState<PastTour | null>(null);
  const [newTourImages, setNewTourImages] = useState<File[]>([]);
  const [scheduleFiles, setScheduleFiles] = useState<Record<number, File[]>>({});
  const [isReady, setIsReady] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Load existing tour data
  useEffect(() => {
    const fetchTour = async () => {
      const res = await fetch(`/api/admin/past-tours/${tourId}`);
      const data = await res.json();
      setForm(data);
      setIsReady(data.ready);
    };
    fetchTour();
  }, [tourId]);

  const handleTourImagesChange = (files: File[], urls: string[]) => {
    setNewTourImages(files);
    setForm((prev) => prev ? { ...prev, tourImages: urls } : prev);
  };

  const handleScheduleImagesChange = (index: number, files: File[], urls: string[]) => {
    setScheduleFiles((prev) => ({ ...prev, [index]: files }));
    if (form) {
      const updated = [...form.pastSchedule];
      updated[index].imageUrls = urls;
      setForm({ ...form, pastSchedule: updated });
    }
  };

  const toggleReady = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`/api/admin/past-tours/${tourId}/ready`, {
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
    e.preventDefault()
    if (!form) return

    try {
      // 1. Upload new tour images
      const newTourImageUrls = await uploadImages(newTourImages, "past-tour-images")

      // Merge old + new tour images
      const tourImageUrls = [
        ...(form.tourImages.filter((url) => typeof url === "string") as string[]),
        ...newTourImageUrls,
      ]

      // 2. Upload new schedule images per day
      const pastSchedule = await Promise.all(
        form.pastSchedule.map(async (day, idx) => {
          const newDayImageUrls = await uploadImages(scheduleFiles[idx] || [], "past-tour-images")
          return {
            id: day.id,
            date: day.date,
            title: day.title,
            description: day.description,
            imageUrls: [...(day.imageUrls || []), ...newDayImageUrls],
          }
        })
      )

      // 3. Build JSON payload
      const payload = {
        title: form.title,
        tourCode: form.tourCode,
        departureStart: form.departureStart,
        departureEnd: form.departureEnd,
        duration: form.duration,
        price: form.price,
        participants: form.participants,
        feedback: form.feedback || "",
        destination: form.destination,
        category: form.category,
        tourImages: tourImageUrls,
        pastSchedule,
      }

      // 4. Send JSON to backend
      const res = await fetch(`/api/admin/past-tours/${tourId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success("Past tour updated successfully!")
      } else {
        toast.error("Failed to update past tour")
      }
    } catch (err) {
      console.error(err)
      toast.error("Unexpected error occurred")
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <form id="editPastTourForm" onSubmit={handleSubmit} className="space-y-6 p-6 rounded">
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-400 rounded-md p-2"
        />
      </div>

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

      {/* Destination (optional) */}
      <div>
        <label htmlFor="destination">Điểm đến</label>
        <input
          type="text"
          id="destination"
          className="w-full border border-gray-400 rounded-md p-2"
          value={form.destination}
          name="destination"
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
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
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Tour Code</label>
        <input
          type="text"
          value={form.tourCode}
          onChange={(e) => setForm({ ...form, tourCode: e.target.value })}
          className="w-full border border-gray-400 rounded-md p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Departure Start</label>
          <input
            type="date"
            value={form.departureStart.split("T")[0]}
            onChange={(e) => setForm({ ...form, departureStart: e.target.value })}
            className="w-full border border-gray-400 rounded-md p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Departure End</label>
          <input
            type="date"
            value={form.departureEnd.split("T")[0]}
            onChange={(e) => setForm({ ...form, departureEnd: e.target.value })}
            className="w-full border border-gray-400 rounded-md p-2"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Duration (days)</label>
        <input
          type="number"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
          className="w-full border border-gray-400 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Price</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="w-full border border-gray-400 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Participants</label>
        <input
          type="number"
          value={form.participants ?? ""}
          onChange={(e) => setForm({ ...form, participants: Number(e.target.value) })}
          className="w-full border border-gray-400 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Feedback</label>
        <textarea
          value={form.feedback ?? ""}
          onChange={(e) => setForm({ ...form, feedback: e.target.value })}
          className="w-full border border-gray-400 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tour Images</label>
        <ImagePicker initialFiles={form.tourImages} onChange={handleTourImagesChange} />
      </div>

      <h3 className="text-lg font-semibold">Schedule</h3>
      {form.pastSchedule.map((day, index) => (
        <div key={index} className="border border-gray-400 p-4 mb-4 rounded">
          <label className="block font-semibold mb-1">Date</label>
          <input
            type="date"
            value={day.date.split("T")[0]}
            onChange={(e) => {
              const updated = [...form.pastSchedule];
              updated[index].date = e.target.value;
              setForm({ ...form, pastSchedule: updated });
            }}
            className="w-full border border-gray-400 rounded-md p-2 mb-2"
          />

          <label className="block font-semibold mb-1">Location</label>
          <input
            type="text"
            value={day.title}
            onChange={(e) => {
              const updated = [...form.pastSchedule];
              updated[index].title = e.target.value;
              setForm({ ...form, pastSchedule: updated });
            }}
            className="w-full border border-gray-400 rounded-md p-2 mb-2"
          />

          <label className="block font-semibold mb-1">Description</label>
          <textarea
            value={day.description}
            onChange={(e) => {
              const updated = [...form.pastSchedule];
              updated[index].description = e.target.value;
              setForm({ ...form, pastSchedule: updated });
            }}
            className="w-full border border-gray-400 rounded-md p-2 mb-2"
          />

          <label className="block font-semibold mb-1">Schedule Images</label>
          <ImagePicker
            initialFiles={day.imageUrls}
            onChange={(files, urls) => handleScheduleImagesChange(index, files, urls)}
          />
        </div>
      ))}

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
