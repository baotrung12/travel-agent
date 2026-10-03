import Image from "next/image";
import Link from "next/link";
import {CalendarDaysIcon, MapPinIcon, PhotoIcon, UserGroupIcon} from "@heroicons/react/24/outline";
import {CATEGORY_LABELS} from "@/utils/tourLabels";

export default function PastTourCard({ tour }: { tour: any }) {
  const date = tour.departureStart ? new Date(tour.departureStart).toLocaleDateString("vi-VN") : null;
  return (
    <Link
      href={`/past-tours/${tour.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full bg-brand-50">
        {tour.tourImages?.[0] ? (
          <Image
            src={tour.tourImages[0]}
            alt={tour.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <PhotoIcon className="absolute inset-0 m-auto size-10 text-brand-200" />
        )}
        {CATEGORY_LABELS[tour.category as keyof typeof CATEGORY_LABELS] && (
          <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-brand-700 shadow-sm">
            {CATEGORY_LABELS[tour.category as keyof typeof CATEGORY_LABELS]}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-semibold text-brand-950 group-hover:text-brand-700">{tour.title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          {date && <span className="inline-flex items-center gap-x-1"><CalendarDaysIcon className="size-4" />{date}</span>}
          {tour.destination && <span className="inline-flex items-center gap-x-1"><MapPinIcon className="size-4" />{tour.destination}</span>}
          {tour.participants > 0 && <span className="inline-flex items-center gap-x-1"><UserGroupIcon className="size-4" />{tour.participants} khách</span>}
        </div>
      </div>
    </Link>
  );
}
