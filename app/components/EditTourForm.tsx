"use client";
import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {Category} from "@/app/generated/prisma/enums";
import {TourSchedule} from "@/app/components/TourSchedule";
import {uploadImages} from "@/app/services/uploadImage";
import TourFields, {TourFormState} from "@/app/components/admin/TourFields";

export interface Tour {
  id: string;
  title: string;
  slug: string;
  summary: string;
  promotion: string;
  tourSchedule: TourSchedule[];
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
  onSaved: () => void;
  onSavingChange?: (saving: boolean) => void;
}

export default function EditTourForm({ tour, onSaved, onSavingChange }: EditTourFormProps) {
  const [form, setForm] = useState<TourFormState>({
    title: tour.title,
    slug: tour.slug,
    tourCode: tour.tourCode,
    summary: tour.summary ?? "",
    promotion: tour.promotion ?? "",
    departurePoint: tour.departurePoint ?? "",
    duration: tour.duration ?? "",
    price: tour.price?.toString() ?? "",
    destination: tour.destination ?? "",
    category: tour.category,
    tourSchedule: (tour.tourSchedule || []).map((item: any) => ({id: item.id, title: item.title, description: item.description})),
    imageUrls: tour.imageUrls || [],
    images: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => onSavingChange?.(saving), [saving, onSavingChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const uploaded = await uploadImages(form.images, "tour-images");
      const res = await fetch(`/api/admin/tours/${tour.id}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          tourCode: form.tourCode,
          summary: form.summary,
          promotion: form.promotion,
          departurePoint: form.departurePoint,
          duration: form.duration,
          price: form.price,
          destination: form.destination,
          category: form.category,
          tourSchedule: form.tourSchedule.map(({title, description}) => ({title, description})),
          tourImages: [...form.imageUrls, ...(uploaded || [])],
        }),
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

  return (
    <form id="editTourForm" onSubmit={handleSubmit}>
      <TourFields form={form} setForm={setForm} layout="stacked" />
    </form>
  );
}
