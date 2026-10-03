"use client";
import React from "react";
import slugify from "slugify";
import {PlusIcon} from "@heroicons/react/24/outline";
import {Category} from "@/app/generated/prisma/enums";
import ImagePicker from "@/app/components/ImagePicker";
import ScheduleItem from "@/app/components/ScheduleItem";
import {Button, CATEGORY_LABELS, Field, Input, Section, Select, Textarea} from "@/app/components/admin/ui";

export interface TourFormState {
  title: string;
  slug: string;
  tourCode: string;
  summary: string;
  promotion: string;
  departurePoint: string;
  duration: string;
  price: string;
  destination: string;
  category: Category;
  tourSchedule: { id?: string; key?: string; title: string; description: string }[];
  imageUrls: string[]; // already uploaded
  images: File[];      // new files to upload
}

export const generateSlug = (title: string) =>
  slugify(title, {lower: true, locale: "vi", remove: /[*+~.()'"!:@]/g});

export const newScheduleDay = () => ({key: crypto.randomUUID(), title: "", description: ""});

export default function TourFields({form, setForm, layout = "split", autoSlug = false}: {
  form: TourFormState;
  setForm: React.Dispatch<React.SetStateAction<TourFormState>>;
  layout?: "split" | "stacked";
  autoSlug?: boolean;
}) {
  const set = <K extends keyof TourFormState>(key: K, value: TourFormState[K]) =>
    setForm((prev) => ({...prev, [key]: value}));

  return (
    <div className="space-y-10">
      <Section layout={layout} title="Thông tin chung" description="Tên, mô tả ngắn và phân loại tour hiển thị trên website.">
        <Field label="Tên tour" required className="sm:col-span-full">
          <Input
            required
            placeholder="VD: Tour Vũng Tàu 2 ngày 1 đêm"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({...prev, title: e.target.value, ...(autoSlug ? {slug: generateSlug(e.target.value)} : {})}))
            }
          />
        </Field>

        <Field label="Đường dẫn (slug)" className="sm:col-span-4" hint={form.slug ? `/tours/${form.slug}` : undefined}>
          <Input
            value={form.slug}
            readOnly={autoSlug}
            disabled={autoSlug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </Field>

        <Field label="Mã tour" className="sm:col-span-2">
          <Input value={form.tourCode} onChange={(e) => set("tourCode", e.target.value)} />
        </Field>

        <Field label="Loại tour" className="sm:col-span-3">
          <Select value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </Field>

        <Field label="Tóm tắt" className="sm:col-span-full" hint="Một vài câu giới thiệu điểm nổi bật của tour.">
          <Textarea value={form.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>

        <Field label="Chính sách khuyến mãi" className="sm:col-span-full">
          <Textarea rows={2} value={form.promotion} onChange={(e) => set("promotion", e.target.value)} />
        </Field>
      </Section>

      <Section layout={layout} title="Chi tiết chuyến đi" description="Điểm khởi hành, điểm đến, thời lượng và giá.">
        <Field label="Điểm khởi hành" className="sm:col-span-3">
          <Input placeholder="VD: TP. Hồ Chí Minh" value={form.departurePoint} onChange={(e) => set("departurePoint", e.target.value)} />
        </Field>

        <Field label="Điểm đến" className="sm:col-span-3">
          <Input placeholder="VD: Đà Nẵng" value={form.destination} onChange={(e) => set("destination", e.target.value)} />
        </Field>

        <Field label="Thời gian" className="sm:col-span-3">
          <Input placeholder="VD: 2 ngày 1 đêm" value={form.duration} onChange={(e) => set("duration", e.target.value)} />
        </Field>

        <Field
          label="Giá tour"
          className="sm:col-span-3"
          hint={Number(form.price) > 0 ? `${Number(form.price).toLocaleString("vi-VN")} ₫ / khách` : undefined}
        >
          <div className="flex items-center rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-brand-600">
            <input
              type="number"
              min={0}
              step={1000}
              placeholder="0"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
            <span className="shrink-0 pr-3 text-base text-gray-500 select-none sm:text-sm/6">VNĐ</span>
          </div>
        </Field>
      </Section>

      <Section layout={layout} title="Hình ảnh" description="Ảnh đầu tiên được dùng làm ảnh bìa của tour.">
        <div className="sm:col-span-full">
          <ImagePicker
            initialFiles={form.imageUrls}
            onChange={(files, urls) => setForm((prev) => ({...prev, images: files, imageUrls: urls}))}
          />
        </div>
      </Section>

      <Section layout={layout} title="Lịch trình" description="Mô tả hoạt động của từng ngày trong tour.">
        <div className="space-y-4 sm:col-span-full">
          {form.tourSchedule.map((item, index) => (
            <ScheduleItem key={item.id ?? item.key ?? index} item={item} index={index} form={form} setForm={setForm} />
          ))}
          {form.tourSchedule.length === 0 && (
            <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
              Chưa có ngày nào trong lịch trình.
            </p>
          )}
          <Button
            variant="secondary"
            onClick={() => set("tourSchedule", [...form.tourSchedule, newScheduleDay()])}
          >
            <PlusIcon className="-ml-0.5 size-5" />
            Thêm ngày
          </Button>
        </div>
      </Section>
    </div>
  );
}
