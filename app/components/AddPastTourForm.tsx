"use client";
import { useState } from "react";
import ImagePicker from "./ImagePicker";
import slugify from "slugify";
import {PlusIcon} from "@heroicons/react/24/solid";
import {Category} from "@/app/generated/prisma/enums";

interface FormState {
  title: string;
  tourCode: string;
  departureStart: string;
  departureEnd: string;
  duration: string;
  price: string;
  participants: string;
  feedback: string;
  destination: string;
  category: Category;        // ✅ allow both STUDENT and TEACHER
  tourImages: File[];
  pastSchedule: { date: string; title: string; description: string; imageFiles: File[] }[];
}

export default function AddPastTourForm() {
  const [form, setForm] = useState<FormState>({
    title: "",
    tourCode: "",
    departureStart: "",
    departureEnd: "",
    duration: "",
    price: "",
    participants: "",
    feedback: "",
    destination: "",
    category: Category.STUDENT,
    tourImages: [] as File[],
    pastSchedule: [{ date: "", title: "", description: "", imageFiles: [] as File[] }],
  });

  const handleTourImagesChange = (files: File[], urls: string[]) => {
    setForm((prev) => ({ ...prev, tourImages: files }));
  };

  const handleScheduleImagesChange = (index: number, files: File[], urls: string[]) => {
    const updated = [...form.pastSchedule];
    updated[index].imageFiles = files;
    setForm((prev) => ({ ...prev, pastSchedule: updated }));
  };

  const addScheduleDay = () => {
    setForm((prev) => ({
      ...prev,
      pastSchedule: [...prev.pastSchedule, { date: "", title: "", description: "", imageFiles: [] }],
    }));
  };

  const generateSlug = (title: string) => {
    return slugify(title, {
      lower: true,
      locale: "vi",
      remove: /[*+~.()'"!:@]/g,
    });
  };

  const generateTourCode = () => {
    const now = new Date();

    const year = now.getFullYear();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-based

    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

    return `PAST-TOUR-${year}-${dd}-${mm}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("tourCode", form.tourCode);
    formData.append("slug", generateSlug(form.title));
    formData.append("tourCode", generateTourCode())
    formData.append("departureStart", form.departureStart);
    formData.append("departureEnd", form.departureEnd);
    formData.append("duration", form.duration);
    formData.append("price", form.price);
    formData.append("participants", form.participants);
    formData.append("feedback", form.feedback);
    formData.append("destination", form.destination);
    formData.append("category", form.category);

    form.tourImages.forEach((file) => formData.append("tourImages", file));

    // stringify schedule (không bao gồm File)
    const scheduleWithoutFiles = form.pastSchedule.map((day) => ({
      date: day.date,
      title: day.title,
      description: day.description,
    }));
    formData.append("pastSchedule", JSON.stringify(scheduleWithoutFiles));

    // append file ảnh cho từng ngày schedule
    form.pastSchedule.forEach((day, idx) => {
      day.imageFiles.forEach((file: File) => {
        formData.append(`scheduleImages_${idx}`, file);
      });
    });

    await fetch("/api/admin/past-tours", { method: "POST", body: formData as BodyInit });
    alert("Past tour submitted!");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white  p-6 rounded-xl shadow-md space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Past Tour</h2>

      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input type="text" value={form.title}
               onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
               className="w-full border border-gray-400 rounded-md p-2" />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tour Code</label>
        <input type="text" value={form.tourCode}
               onChange={(e) => setForm((prev) => ({ ...prev, tourCode: e.target.value }))}
               className="w-full border border-gray-400 rounded-md p-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Departure Start</label>
          <input type="date" value={form.departureStart}
                 onChange={(e) => setForm((prev) => ({ ...prev, departureStart: e.target.value }))}
                 className="w-full border border-gray-400 rounded-md p-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Departure End</label>
          <input type="date" value={form.departureEnd}
                 onChange={(e) => setForm((prev) => ({ ...prev, departureEnd: e.target.value }))}
                 className="w-full border border-gray-400 rounded-md p-2" />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Duration (days)</label>
        <input type="number" value={form.duration}
               onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
               className="w-full border border-gray-400 rounded-md p-2" />
      </div>

      <div>
        <label className="block font-semibold mb-1">Price</label>
        <input type="number" value={form.price}
               onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
               className="w-full border border-gray-400 rounded-md p-2" />
      </div>

      <div>
        <label className="block font-semibold mb-1">Participants</label>
        <input type="number" value={form.participants}
               onChange={(e) => setForm((prev) => ({ ...prev, participants: e.target.value }))}
               className="w-full border border-gray-400 rounded-md p-2" />
      </div>

      <div>
        <label className="block font-semibold mb-1">Feedback</label>
        <textarea value={form.feedback}
                  onChange={(e) => setForm((prev) => ({ ...prev, feedback: e.target.value }))}
                  className="w-full border border-gray-400 rounded-md p-2" />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tour Images</label>
        <ImagePicker initialFiles={[]} onChange={handleTourImagesChange} />
      </div>

      {/* Destination (optional) */}
      <div>
        <label htmlFor="destination">Điểm đến</label>
        <input
          type="text"
          id="destination"
          className="w-full border border-gray-400 rounded-md p-2"
          name="destination"
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
          placeholder="Ví dụ: Đà Nẵng"
        />
      </div>

      {/* Category (enum) */}
      <div>
        <label htmlFor="category">Loại tour</label>
        <select id="category"
                name="category"
                className="w-full border border-gray-400 rounded-md p-2"
                defaultValue={Category.STUDENT}
                value={form.category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setForm({ ...form, category: e.target.value as Category });
                }}
        >
          <option value={Category.STUDENT}>Du lịch trải nghiệm cho HS</option>
          <option value={Category.TEACHER}>Du lịch giành cho giáo viên</option>
        </select>
      </div>

      <div className="border border-gray-400 rounded-md p-4 mb-4">
        <h3 className="text-lg font-semibold">Schedule</h3>
        {form.pastSchedule.map((day, index) => (
          <div key={index}>
            <label className="block font-semibold mb-1">Date</label>
            <input type="date" value={day.date}
                   onChange={(e) => {
                     const updated = [...form.pastSchedule];
                     updated[index].date = e.target.value;
                     setForm((prev) => ({ ...prev, pastSchedule: updated }));
                   }}
                   className="w-full border border-gray-400 rounded-md p-2" />

            <label className="block font-semibold mb-1">Location</label>
            <input type="text" value={day.title}
                   onChange={(e) => {
                     const updated = [...form.pastSchedule];
                     updated[index].title = e.target.value;
                     setForm((prev) => ({ ...prev, pastSchedule: updated }));
                   }}
                   className="w-full border border-gray-400 rounded-md p-2" />

            <label className="block font-semibold mb-1">Description</label>
            <textarea value={day.description}
                      onChange={(e) => {
                        const updated = [...form.pastSchedule];
                        updated[index].description = e.target.value;
                        setForm((prev) => ({ ...prev, pastSchedule: updated }));
                      }}
                      className="w-full border border-gray-400 rounded-md p-2" />

            <label className="block font-semibold mb-1">Schedule Images</label>
            <ImagePicker
              initialFiles={[]}
              onChange={(files, urls) => handleScheduleImagesChange(index, files, urls)}
            />
          </div>
        ))}
        <button type="button" onClick={addScheduleDay} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm">
          <PlusIcon className="w-4 h-4" />
          Thêm ngày
        </button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Past Tour</button>
    </form>
  );
}
