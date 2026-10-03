"use client";
import React, {useState} from "react";
import toast from "react-hot-toast";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {Category} from "@/app/generated/prisma/enums";
import {uploadImages} from "@/app/services/uploadImage";
import TourFields, {newScheduleDay, TourFormState} from "@/app/components/admin/TourFields";
import {Button, PageHeading} from "@/app/components/admin/ui";

const generateTourCode = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `TOUR-${now.getFullYear()}-${dd}-${mm}-${random}`;
};

export default function AddTourForm({ onSaved, onCancel }: { onSaved?: () => void; onCancel?: () => void }) {
  const [form, setForm] = useState<TourFormState>(() => ({
    title: "",
    slug: "",
    tourCode: generateTourCode(),
    summary: "",
    promotion: "",
    departurePoint: "",
    duration: "",
    price: "",
    destination: "",
    category: Category.STUDENT,
    tourSchedule: [newScheduleDay()],
    imageUrls: [],
    images: [],
  }));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const uploaded = await uploadImages(form.images, "tour-images");
      const response = await fetch("/api/admin/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          tourSchedule: form.tourSchedule.map(({title, description}) => ({title, description})),
          images: [...form.imageUrls, ...(uploaded || [])],
        }),
      });

      if (response.ok) {
        toast.success("Đã tạo tour. Tour đang ở trạng thái bản nháp.");
        onSaved?.();
      } else {
        toast.error("Không tạo được tour");
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer">
            <ArrowLeftIcon className="size-4" />
            Tour đang bán
          </button>
        )}
        <PageHeading title="Thêm tour mới" description="Tour mới được lưu dưới dạng bản nháp. Bật hiển thị trong danh sách khi đã sẵn sàng." />
      </div>

      <TourFields form={form} setForm={setForm} autoSlug />

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-x-3 border-t border-gray-200 bg-white/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {onCancel && <Button variant="secondary" onClick={onCancel}>Hủy</Button>}
        <Button type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu tour"}</Button>
      </div>
    </form>
  );
}
