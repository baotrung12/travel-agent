"use client";
import React from "react";
import {PlusIcon, TrashIcon} from "@heroicons/react/24/outline";
import {Category} from "@/app/generated/prisma/enums";
import ImagePicker from "@/app/components/ImagePicker";
import type {ImageItem} from "@/app/services/uploadImage";
import {Button, CATEGORY_LABELS, Field, IconButton, Input, Section, Select, Textarea} from "@/app/components/admin/ui";

export interface PastScheduleDay {
  id?: string | null;
  key: string;
  date: string;          // yyyy-mm-dd
  title: string;
  description: string;
  images: ImageItem[];   // ordered photos of the day
}

export interface PastTourFormState {
  title: string;
  tourCode: string;
  departureStart: string; // yyyy-mm-dd
  departureEnd: string;   // yyyy-mm-dd
  duration: string;
  price: string;
  participants: string;
  feedback: string;
  destination: string;
  category: Category;
  tourImages: ImageItem[]; // ordered; first = cover image
  pastSchedule: PastScheduleDay[];
}

export const newPastScheduleDay = (): PastScheduleDay => ({
  key: crypto.randomUUID(), date: "", title: "", description: "", images: [],
});

export const toDateInput = (value?: string | null) => (value ? value.split("T")[0] : "");

export default function PastTourFields({form, setForm, layout = "split"}: {
  form: PastTourFormState;
  setForm: React.Dispatch<React.SetStateAction<PastTourFormState>>;
  layout?: "split" | "stacked";
}) {
  const set = <K extends keyof PastTourFormState>(key: K, value: PastTourFormState[K]) =>
    setForm((prev) => ({...prev, [key]: value}));

  const updateDay = (index: number, patch: Partial<PastScheduleDay>) =>
    setForm((prev) => ({
      ...prev,
      pastSchedule: prev.pastSchedule.map((day, i) => (i === index ? {...day, ...patch} : day)),
    }));

  return (
    <div className="space-y-10">
      <Section layout={layout} title="Thông tin chung" description="Tên chuyến đi, phân loại và điểm đến.">
        <Field label="Tên tour" required className="sm:col-span-full">
          <Input required placeholder="VD: Học tập trải nghiệm tại Vườn Quốc gia Cát Tiên" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </Field>

        <Field label="Mã tour" className="sm:col-span-3" hint="Để trống để tạo mã tự động.">
          <Input value={form.tourCode} onChange={(e) => set("tourCode", e.target.value)} />
        </Field>

        <Field label="Loại tour" className="sm:col-span-3">
          <Select value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Điểm đến" className="sm:col-span-full">
          <Input placeholder="VD: Đồng Nai" value={form.destination} onChange={(e) => set("destination", e.target.value)} />
        </Field>
      </Section>

      <Section layout={layout} title="Thời gian & quy mô" description="Ngày tổ chức, số khách và chi phí của chuyến đi.">
        <Field label="Ngày bắt đầu" required className="sm:col-span-3">
          <Input type="date" required value={form.departureStart} onChange={(e) => set("departureStart", e.target.value)} />
        </Field>

        <Field label="Ngày kết thúc" required className="sm:col-span-3">
          <Input type="date" required min={form.departureStart} value={form.departureEnd} onChange={(e) => set("departureEnd", e.target.value)} />
        </Field>

        <Field label="Thời gian" className="sm:col-span-2">
          <Input placeholder="VD: 2 ngày 1 đêm" value={form.duration} onChange={(e) => set("duration", e.target.value)} />
        </Field>

        <Field label="Số khách" className="sm:col-span-2">
          <Input type="number" min={0} placeholder="0" value={form.participants} onChange={(e) => set("participants", e.target.value)} />
        </Field>

        <Field label="Giá (VNĐ)" className="sm:col-span-2">
          <Input type="number" min={0} step={1000} placeholder="0" value={form.price} onChange={(e) => set("price", e.target.value)} />
        </Field>

        <Field label="Cảm nhận của khách hàng" className="sm:col-span-full">
          <Textarea value={form.feedback} onChange={(e) => set("feedback", e.target.value)} />
        </Field>
      </Section>

      <Section layout={layout} title="Hình ảnh" description="Ảnh đầu tiên được dùng làm ảnh bìa.">
        <div className="sm:col-span-full">
          <ImagePicker value={form.tourImages} onChange={(images) => set("tourImages", images)} />
        </div>
      </Section>

      <Section layout={layout} title="Lịch trình" description="Hoạt động và ảnh của từng ngày.">
        <div className="space-y-4 sm:col-span-full">
          {form.pastSchedule.map((day, index) => (
            <div key={day.id ?? day.key} className="rounded-lg ring-1 ring-gray-200">
              <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-50 px-4 py-2">
                <span className="text-sm font-semibold text-gray-900">Ngày {index + 1}</span>
                <IconButton
                  label="Xoá ngày này"
                  tone="danger"
                  onClick={() => set("pastSchedule", form.pastSchedule.filter((_, i) => i !== index))}
                >
                  <TrashIcon className="size-5" />
                </IconButton>
              </div>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-6">
                <Field label="Ngày" className="sm:col-span-2">
                  <Input type="date" value={day.date} onChange={(e) => updateDay(index, {date: e.target.value})} />
                </Field>
                <Field label="Địa điểm" className="sm:col-span-4">
                  <Input placeholder="VD: Vườn Quốc gia Cát Tiên" value={day.title} onChange={(e) => updateDay(index, {title: e.target.value})} />
                </Field>
                <Field label="Mô tả" className="sm:col-span-full">
                  <Textarea value={day.description} onChange={(e) => updateDay(index, {description: e.target.value})} />
                </Field>
                <div className="sm:col-span-full">
                  <span className="block text-sm/6 font-medium text-gray-900">Ảnh trong ngày</span>
                  <div className="mt-2">
                    <ImagePicker value={day.images} onChange={(images) => updateDay(index, {images})} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {form.pastSchedule.length === 0 && (
            <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
              Chưa có ngày nào trong lịch trình.
            </p>
          )}
          <Button variant="secondary" onClick={() => set("pastSchedule", [...form.pastSchedule, newPastScheduleDay()])}>
            <PlusIcon className="-ml-0.5 size-5" />
            Thêm ngày
          </Button>
        </div>
      </Section>
    </div>
  );
}

// Uploads new images (keeping their order) and builds the JSON body expected by the past-tours API.
export async function buildPastTourPayload(
  form: PastTourFormState,
  uploadOrdered: (items: ImageItem[], bucket: string) => Promise<string[]>,
) {
  const tourImages = await uploadOrdered(form.tourImages, "tour-images");
  const pastSchedule = await Promise.all(
    form.pastSchedule.map(async (day) => ({
      id: day.id ?? undefined,
      // schedule date falls back to the tour start date so it is never empty
      date: day.date || form.departureStart,
      title: day.title,
      description: day.description,
      imageUrls: await uploadOrdered(day.images, "tour-images"),
    }))
  );

  return {
    title: form.title,
    departureStart: form.departureStart,
    departureEnd: form.departureEnd,
    duration: form.duration,
    price: form.price,
    participants: form.participants,
    feedback: form.feedback,
    destination: form.destination,
    category: form.category,
    tourImages,
    pastSchedule,
  };
}
