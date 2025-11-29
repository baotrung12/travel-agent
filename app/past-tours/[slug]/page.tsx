// app/past-tours/[slug]/page.tsx

import Breadcrumbs from "@/app/components/Breadcrumbs";
import PastTourHeroHeader from "@/app/components/PastTourHeroHeader";
import PastTourGallery from "@/app/components/PastTourGallery";
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {Category} from "@/app/generated/prisma/enums";
import {buildDuration} from "@/utils/dateUtils";
import {PastTour} from "@/app/components/EditPastTourForm";

type Testimonial = {
  name: string;
  role?: string;
  tourName: string;
  avatarUrl?: string;
  quote: string;
};

export default async function PastTourDetailPage({params}: { params: Promise<{ slug: string }> }) {
  const {slug} = await params;

  // 2) Build a valid absolute base URL for server-side fetch
  // Prefer env, otherwise derive from request headers
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  console.log("Based URL: ", envBase);
  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const baseUrl =
    envBase && envBase.startsWith("http")
      ? envBase
      : host
        ? `${protocol}://${host}`
        : ""; // fallback, but absolute is strongly recommended

  // 3) Fetch public API
  const res = await fetch(`${baseUrl}/api/v1/past-tours/${slug}`, {
    cache: "no-store",
  });

  console.log("Fetch result: ", res);
  if (!res.ok) return notFound();

  const tour: PastTour = await res.json();
  const stats = [
    {label: "Số khách", value: tour.participants?.toString() ?? "N/A"},
    {label: "Thời gian", value: buildDuration(new Date(tour.departureStart), new Date(tour.departureEnd))},
    { label: "Điểm đến", value: tour.destination ?? "N/A" },
    { label: "Loại tour", value: tour.category },
  ];

  const title = tour.category === Category.STUDENT ? "Tour học tập trải nghiệm cho học sinh." : "Tour tham quan cho giáo viên."

  return (
    <section className="bg-white py-12 px-6 max-w-5xl mx-auto">
      <Breadcrumbs/>

      <PastTourHeroHeader
        title={title}
        dateTitle={tour.title}
        subtitle={""}
        heroImage={tour.tourImages[0]}
        stats={stats}
        description={""}
      />

      {tour.pastSchedule.map((item, index) => {
        return (
          <PastTourGallery key={"schedule" + index} title={`Ngày ${index + 1}. ${item.title}`} images={item.imageUrls}/>
        );
      })}

      <section className="bg-gray-100 p-6 mb-5 rounded-xl shadow-md">
        <div>
          <h2 className="text-2xl font-bold mb-4">Đánh giá</h2>
          <p>{tour.feedback ?? "Chưa có đánh giá"}</p>
        </div>
      </section>

    </section>
  );
}
