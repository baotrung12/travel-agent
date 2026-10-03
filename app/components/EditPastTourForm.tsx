"use client";
import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {uploadImages} from "@/app/services/uploadImage";
import PastTourFields, {buildPastTourPayload, PastTourFormState, toDateInput} from "@/app/components/admin/PastTourFields";
import {Category} from "@/app/generated/prisma/enums";

export interface PastTour {
  id: string;
  title: string;
  tourCode: string;
  departureStart: string;
  departureEnd: string;
  duration: string;
  destination: string;
  category: Category;
  price: number;
  participants: number | null;
  feedback: string | null;
  tourImages: string[];
  pastSchedule: { id: string | null; date: string; title: string; description: string; imageUrls: string[] }[];
}

export default function EditPastTourForm({ tourId, onSaved, onSavingChange }: {
  tourId: string;
  onSaved: () => void;
  onSavingChange?: (saving: boolean) => void;
}) {
  const [form, setForm] = useState<PastTourFormState | null>(null);
  const [tourCode, setTourCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => onSavingChange?.(saving), [saving, onSavingChange]);

  // Load existing tour data
  useEffect(() => {
    const fetchTour = async () => {
      const res = await fetch(`/api/admin/past-tours/${tourId}`);
      const data = await res.json();
      setTourCode(data.tourCode);
      setForm({
        title: data.title ?? "",
        tourCode: data.tourCode ?? "",
        departureStart: toDateInput(data.departureStart),
        departureEnd: toDateInput(data.departureEnd),
        duration: data.duration ?? "",
        price: data.price?.toString() ?? "",
        participants: data.participants?.toString() ?? "",
        feedback: data.feedback ?? "",
        destination: data.destination ?? "",
        category: data.category,
        tourImageUrls: data.tourImages ?? [],
        tourImageFiles: [],
        pastSchedule: (data.pastSchedule ?? []).map((day: any) => ({
          id: day.id,
          key: day.id,
          date: toDateInput(day.date),
          title: day.title ?? "",
          description: day.description ?? "",
          imageUrls: day.imageUrls ?? [],
          files: [],
        })),
      });
    };
    fetchTour();
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const payload = await buildPastTourPayload(form, uploadImages);
      const res = await fetch(`/api/admin/past-tours/${tourId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, tourCode: form.tourCode.trim() || tourCode }),
      });

      if (res.ok) {
        toast.success("Đã lưu thay đổi");
        onSaved();
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

  if (!form) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 w-40 rounded bg-gray-200" />
        <div className="h-48 rounded-xl bg-gray-200" />
        <div className="h-48 rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <form id="editPastTourForm" onSubmit={handleSubmit}>
      <PastTourFields form={form} setForm={setForm as React.Dispatch<React.SetStateAction<PastTourFormState>>} layout="stacked" />
    </form>
  );
}
