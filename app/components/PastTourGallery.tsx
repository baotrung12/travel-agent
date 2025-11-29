// components/success/TourGallery.tsx
import ScheduleGallery from "@/app/components/ScheduleGallery";

export default function PastTourGallery({ title, images }: { title: string, images: string[] }) {
  return (
    <section className="bg-gray-100 p-6 mb-5 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-blue-700 mb-6">{title}</h3>

      <ScheduleGallery images={images} />
    </section>
  );
}
