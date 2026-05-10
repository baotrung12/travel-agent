"use client";
import {useEffect, useState} from "react";
import slugify from "slugify";
import {PlusIcon} from "@heroicons/react/24/solid";
import {Category} from "@/app/generated/prisma/enums";
import StarterKit from "@tiptap/starter-kit";
import {TextStyleKit} from '@tiptap/extension-text-style'
import ScheduleItem from "@/app/components/ScheduleItem";
import {supabase} from "@/app/services/supabaseClient";
import {uploadImages} from "@/app/services/uploadImage";
import toast from "react-hot-toast";

interface FormState {
  title: string;
  slug: string;
  summary: string;
  promotion: string;
  tourSchedule: { title: string; description: string }[];
  departurePoint: string;
  duration: string;
  tourCode: string;
  price: string;
  destination: string;
  category: Category;
  images: File[];
}

const extensions = [TextStyleKit, StarterKit]


export default function AddTourForm({ onSaved }: { onSaved?: () => void }) {
  const [form, setForm] = useState<FormState>({
    title: "",
    slug: "",
    summary: "",
    promotion: "",
    tourSchedule: [{ title: "", description: "" }],
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
    const imageUrls: string[] | null = await uploadImages(form.images, "tour-images");
    const payload = {
      title: form.title,
      slug: form.slug,
      duration: form.duration,
      price: form.price,
      tourCode: form.tourCode,
      summary: form.summary,
      promotion: form.promotion,
      departurePoint: form.departurePoint,
      destination: form.destination,
      category: form.category,
      tourSchedule: form.tourSchedule,
      images: imageUrls,
    }

    const response = await fetch("/api/admin/tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success("Tour created successfully!")
      onSaved?.()
    } else {
      toast.error("Failed to create tour")
    }
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
          <option value={Category.LONG_TRIP}>Du lịch dài ngày</option>
          <option value={Category.SHORT_TRIP}>Du lịch ngắn ngày</option>
          <option value={Category.SPECIAL}>Tour đặc biệt</option>
        </select>
      </div>

      {/* Tour Schedule */}
      <div className="space-y-2">
        <label className="font-semibold text-blue-700">Lịch trình tour</label>
        {form.tourSchedule.map((item, index) => (
          <ScheduleItem
            key={index}
            item={item}
            index={index}
            form={form}
            setForm={setForm}
          />
        ))}

        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              tourSchedule: [...form.tourSchedule, { title: "", description: "" }],
            })
          }
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Thêm ngày
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <p className="text-sm text-gray-500">🆔 Mã tour: <span className="font-medium text-gray-700">{form.tourCode}</span></p>
      </div>


      <div>
        <label className="font-semibold text-blue-700">Gia Tour</label>
        <input
          type="number"
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
