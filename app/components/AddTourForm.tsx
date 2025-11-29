"use client";
import { useState, useEffect } from "react";
import slugify from "slugify";
import { PlusIcon } from "@heroicons/react/24/solid";
import {TrashIcon} from "@heroicons/react/16/solid";
import {Category} from "@/app/generated/prisma/enums";

interface FormState {
  title: string;
  slug: string;
  summary: string;
  promotion: string;
  tourSchedule: { date: string; title: string; description: string }[];
  departureStart: string;
  departureEnd: string;
  departurePoint: string;
  duration: string;
  tourCode: string;
  price: string;
  destination: string;
  category: Category;   // ✅ allow both STUDENT and TEACHER
  images: File[];
}

export default function AddTourForm() {
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    summary: "",
    promotion: "",
    tourSchedule: [{ date: "", title: "", description: "" }],
    departureStart: "",
    departureEnd: "",
    departurePoint: "",
    duration: "",
    tourCode: "",
    price: "",
    destination: "",
    category: Category.STUDENT,
    images: [] as File[],
  });

  // Auto-generate slug and tour ID
  useEffect(() => {
    const slug = generateSlug(form.title);
    const tourCode = generateTourCode();
    setForm((prev) => ({ ...prev, slug, tourCode }));
  }, [form.title]);

  // Auto-calculate duration
  useEffect(() => {
    if (form.departureStart && form.departureEnd) {
      const start = new Date(form.departureStart);
      const end = new Date(form.departureEnd);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setForm((prev) => ({ ...prev, duration: `${diff} ngày` }));
    }
  }, [form.departureStart, form.departureEnd]);

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

    return `TOUR-${year}-${dd}-${mm}-${random}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, images: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("departureStart", form.departureStart);
    formData.append("departureEnd", form.departureEnd);
    formData.append("duration", form.duration);
    formData.append("price", form.price);
    formData.append("tourCode", form.tourCode);
    formData.append("summary", form.summary);
    formData.append("promotion", form.promotion);
    formData.append("departurePoint", form.departurePoint);
    formData.append("destination", form.destination);
    formData.append("category", form.category);

    // 👇 stringify the array of schedule objects
    formData.append("tourSchedule", JSON.stringify(form.tourSchedule));

    form.images.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch("/api/tours", {
      method: "POST",
      body: formData as BodyInit,
    });

    const result = await response.json();
    console.log("Saved tour:", result);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white  p-6 rounded-xl shadow-md space-y-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold text-blue-700">Thêm tour mới</h2>

      {/* Title & Slug */}
      <input
        type="text"
        placeholder="Tiêu đề tour"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full border border-gray-400 rounded-md p-2"
      />
      <p className="text-sm text-gray-500">Slug: {form.slug}</p>

      <label className="block">
        <span className="text-gray-700">Tour Images</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </label>

      {/* Preview */}
      <div className="flex gap-4 flex-wrap">
        {form.images.map((file, idx) => (
          <img
            key={idx}
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border"
          />
        ))}
      </div>

      <input
        type="text"
        placeholder="Khởi hành"
        value={form.departurePoint}
        onChange={(e) => setForm({ ...form, departurePoint: e.target.value })}
        className="w-full border border-gray-400 rounded-md p-2"
      />

      {/* Summary & Promotion */}
      <textarea
        placeholder="Tóm tắt tour"
        value={form.summary}
        onChange={(e) => setForm({ ...form, summary: e.target.value })}
        className="w-full border border-gray-400 rounded-md p-2"
        rows={2}
      />
      <textarea
        placeholder="Chính sách khuyến mãi"
        value={form.promotion}
        onChange={(e) => setForm({ ...form, promotion: e.target.value })}
        className="w-full border border-gray-400 rounded-md p-2"
        rows={2}
      />

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

      {/* Tour Schedule */}
      <div className="space-y-2">
        <label className="font-semibold text-blue-700">Lịch trình tour</label>
        {form.tourSchedule.map((item, index) => (
          <div key={index} className="bg-white border border-gray-400 rounded-lg shadow-sm p-4 space-y-2 mt-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-600">Ngày {index + 1}</span>
              <button
                type="button"
                onClick={() => {
                  const updated = [...form.tourSchedule];
                  updated.splice(index, 1);
                  setForm({ ...form, tourSchedule: updated });
                }}
                className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm"
              >
                <TrashIcon className="w-4 h-4" />
                Xoá
              </button>
            </div>

            <input
              type="date"
              value={item.date}
              onChange={(e) => {
                const updated = [...form.tourSchedule];
                updated[index].date = e.target.value;
                setForm({ ...form, tourSchedule: updated });
              }}
              className="border border-gray-400 rounded-md p-2 text-sm w-40"
            />

            <input
              type="text"
              placeholder="Tiêu đề ngắn (VD: Khởi hành)"
              value={item.title}
              onChange={(e) => {
                const updated = [...form.tourSchedule];
                updated[index].title = e.target.value;
                setForm({ ...form, tourSchedule: updated });
              }}
              className="w-full border border-gray-400 rounded-md p-2 text-sm"
            />

            <textarea
              placeholder="Mô tả hoạt động trong ngày"
              value={item.description}
              onChange={(e) => {
                const updated = [...form.tourSchedule];
                updated[index].description = e.target.value;
                setForm({ ...form, tourSchedule: updated });
              }}
              className="w-full border border-gray-400 rounded-md p-2 text-sm"
              rows={3}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              tourSchedule: [...form.tourSchedule, { date: "", title: "", description: "" }],
            })
          }
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Thêm ngày
        </button>
      </div>

      {/* Departure Schedule */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-blue-700">Lịch khởi hành</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-600">Ngày bắt đầu</label>
            <input
              type="date"
              value={form.departureStart}
              onChange={(e) => setForm({ ...form, departureStart: e.target.value })}
              className="border border-gray-200 rounded-md p-2 text-sm w-40"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm text-gray-600">Ngày kết thúc</label>
            <input
              type="date"
              value={form.departureEnd}
              onChange={(e) => setForm({ ...form, departureEnd: e.target.value })}
              className="border border-gray-200 rounded-md p-2 text-sm w-40"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <p className="text-sm text-gray-500">🕒 Thời gian tour: <span className="font-medium text-gray-700">{form.duration}</span></p>
          <p className="text-sm text-gray-500">🆔 Mã tour: <span className="font-medium text-gray-700">{form.tourCode}</span></p>
        </div>
      </div>


      <div>
        <label className="font-semibold text-blue-700">Gia Tour</label>
        <input
          type="text"
          placeholder="Giá tour (VND)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border border-gray-400 rounded-md p-2"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Lưu tour
      </button>
    </form>
  );
}
