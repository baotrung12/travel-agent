"use client";
import React, {useState} from "react";
import slugify from "slugify";
import toast from "react-hot-toast";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {Category} from "@/app/generated/prisma/enums";
import {uploadOrdered} from "@/app/services/uploadImage";
import PastTourFields, {buildPastTourPayload, newPastScheduleDay, PastTourFormState} from "@/app/components/admin/PastTourFields";
import {Button, PageHeading} from "@/app/components/admin/ui";

const generateSlug = (title: string) =>
  slugify(title, {lower: true, locale: "vi", remove: /[*+~.,()'"!:@?&/#%]/g});

const generateTourCode = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `PAST-TOUR-${now.getFullYear()}-${dd}-${mm}-${random}`;
};

export default function AddPastTourForm({ onSaved, onCancel }: { onSaved?: () => void; onCancel?: () => void }) {
  const [form, setForm] = useState<PastTourFormState>(() => ({
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
    tourImages: [],
    pastSchedule: [newPastScheduleDay()],
  }));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = await buildPastTourPayload(form, uploadOrdered);
      const res = await fetch("/api/admin/past-tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          slug: generateSlug(form.title),
          tourCode: form.tourCode.trim() || generateTourCode(),
        }),
      });

      if (res.ok) {
        toast.success("Đã lưu tour. Tour đang ở trạng thái bản nháp.");
        onSaved?.();
      } else {
        toast.error("Không lưu được tour");
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
            Tour đã tổ chức
          </button>
        )}
        <PageHeading title="Thêm tour đã tổ chức" description="Lưu lại chuyến đi đã tổ chức kèm hình ảnh để giới thiệu trên website." />
      </div>

      <PastTourFields form={form} setForm={setForm} />

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-x-3 border-t border-gray-200 bg-white/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {onCancel && <Button variant="secondary" onClick={onCancel}>Hủy</Button>}
        <Button type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu tour"}</Button>
      </div>
    </form>
  );
}
