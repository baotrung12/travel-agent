// app/past-tours/[slug]/page.tsx

import Link from "next/link";
import {notFound} from "next/navigation";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PastTourCard from "@/app/components/PastTourCard";
import TourGallery from "@/app/components/tour-detail/TourGallery";
import DayPhotos from "@/app/components/tour-detail/DayPhotos";
import {PastTour} from "@/app/components/EditPastTourForm";
import {buildDuration} from "@/utils/dateUtils";
import {CATEGORY_LABELS} from "@/utils/tourLabels";
import {getPublishedPastTourBySlug, getPublishedPastTours} from "@/lib/data/publicTours";

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString("vi-VN") : null);

// Cached and refreshed every 5 minutes; admin changes refresh it immediately (see lib/revalidatePublic.ts)
export const revalidate = 300;

// Pages are generated on first visit and then served from cache
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({params}: { params: Promise<{ slug: string }> }) {
  const tour = await getPublishedPastTourBySlug(decodeURIComponent((await params).slug));
  return tour ? { title: `${tour.title} | Edutour` } : {};
}

export default async function PastTourDetailPage({params}: { params: Promise<{ slug: string }> }) {
  const slug = decodeURIComponent((await params).slug);
  const [found, otherTours] = await Promise.all([getPublishedPastTourBySlug(slug), getPublishedPastTours()]);
  if (!found) return notFound();
  const tour = found as unknown as PastTour & { slug: string };

  const moreTours = (otherTours as unknown as (PastTour & { slug: string })[])
    .filter((t) => t.id !== tour.id)
    .sort((x, y) => Number(y.category === tour.category) - Number(x.category === tour.category))
    .slice(0, 3);

  const days = [...(tour.pastSchedule ?? [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const startDate = formatDate(tour.departureStart);
  const endDate = formatDate(tour.departureEnd);
  const dateRange = startDate && endDate && startDate !== endDate ? `${startDate} – ${endDate}` : startDate;
  const duration = tour.departureStart && tour.departureEnd
    ? buildDuration(new Date(tour.departureStart), new Date(tour.departureEnd))
    : tour.duration;

  // Cover photos first, then the day photos, without duplicates
  const galleryImages = [...new Set([...(tour.tourImages ?? []), ...days.flatMap((day) => day.imageUrls ?? [])])];

  const stats = [
    { icon: CalendarDaysIcon, label: "Ngày tổ chức", value: dateRange },
    { icon: ClockIcon, label: "Thời gian", value: duration },
    { icon: UserGroupIcon, label: "Số khách", value: tour.participants ? `${tour.participants} khách` : null },
    { icon: MapPinIcon, label: "Điểm đến", value: tour.destination },
  ].filter((stat) => stat.value);

  const card = "rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6";

  return (
    <>
      <Navbar />

      <main className="bg-slate-100 pt-16 pb-16">
        {/* Title + gallery on white */}
        <div className="bg-white pb-8 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              <ol role="list" className="flex min-w-0 items-center gap-x-2 text-sm">
                <li className="whitespace-nowrap"><Link href="/" className="text-slate-500 hover:text-brand-700">Trang chủ</Link></li>
                <li><ChevronRightIcon className="size-4 text-slate-400" /></li>
                <li className="whitespace-nowrap"><Link href="/#pastTours" className="text-slate-500 hover:text-brand-700">Tour trường học</Link></li>
                <li><ChevronRightIcon className="size-4 text-slate-400" /></li>
                <li className="truncate font-medium text-slate-900" aria-current="page">{tour.title}</li>
              </ol>
            </nav>

            <div className="mt-4">
              <span className="inline-flex items-center rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-600/20 ring-inset">
                {CATEGORY_LABELS[tour.category] ?? tour.category} · Chuyến đi đã tổ chức
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">{tour.title}</h1>
            </div>

            <div className="mt-5">
              <TourGallery images={galleryImages} title={tour.title} />
            </div>

            {stats.length > 0 && (
              <dl className={`mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 ${["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"][stats.length]}`}>
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-x-3 rounded-xl bg-brand-50 px-4 py-3 ring-1 ring-brand-100">
                    <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-white text-brand-600 shadow-xs">
                      <stat.icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-medium text-slate-500">{stat.label}</dt>
                      <dd className="text-sm font-semibold break-words text-brand-950">{stat.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Itinerary */}
          <section aria-labelledby="journey-heading" className={`${card} lg:col-span-2`}>
            <h2 id="journey-heading" className="text-lg font-bold text-brand-900">Hành trình chuyến đi</h2>

            {days.length > 0 ? (
              <ol className="mt-5 space-y-5">
                {days.map((day, index) => (
                  <li key={day.id ?? index} className="overflow-hidden rounded-xl ring-1 ring-slate-200">
                    <div className="bg-slate-50 px-4 py-3">
                      <div className="flex items-center justify-between gap-x-3">
                        <span className="rounded-md bg-brand-600 px-2.5 py-1 text-xs font-bold whitespace-nowrap text-white">
                          NGÀY {String(index + 1).padStart(2, "0")}
                        </span>
                        {formatDate(day.date) && (
                          <span className="inline-flex items-center gap-x-1 text-sm text-slate-500">
                            <CalendarDaysIcon className="size-4" />{formatDate(day.date)}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-semibold text-brand-950">{day.title || "Đang cập nhật"}</h3>
                    </div>
                    <div className="space-y-4 bg-white px-4 py-4 sm:px-5">
                      {day.description && <p className="text-sm/7 whitespace-pre-line text-slate-700">{day.description}</p>}
                      <DayPhotos images={day.imageUrls ?? []} title={`Ngày ${index + 1} – ${day.title}`} />
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Lịch trình đang được cập nhật.</p>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <section aria-labelledby="feedback-heading" className={card}>
                <h2 id="feedback-heading" className="flex items-center gap-x-2 text-lg font-bold text-brand-900">
                  <ChatBubbleLeftRightIcon className="size-5 text-brand-600" />
                  Cảm nhận của khách hàng
                </h2>
                {tour.feedback ? (
                  <blockquote className="mt-4 border-l-4 border-brand-300 pl-4 text-sm/7 whitespace-pre-line text-slate-700 italic">
                    “{tour.feedback}”
                  </blockquote>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">Chưa có cảm nhận cho chuyến đi này.</p>
                )}
              </section>

              <section className="overflow-hidden rounded-xl bg-brand-950 p-6 text-white shadow-lg">
                <h2 className="text-lg font-bold">Tổ chức chuyến đi tương tự cho trường bạn?</h2>
                <p className="mt-2 text-sm/6 text-brand-100">
                  Chúng tôi thiết kế lịch trình theo nhu cầu, số lượng học sinh và ngân sách của nhà trường.
                </p>
                <Link
                  href="/#contactUs"
                  className="mt-5 block rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-brand-800 shadow-sm hover:bg-brand-50"
                >
                  Liên hệ tư vấn
                </Link>
              </section>
            </div>
          </aside>
        </div>

        {moreTours.length > 0 && (
          <section aria-labelledby="more-heading" className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <h2 id="more-heading" className="text-xl font-bold text-brand-950">Các chuyến đi khác</h2>
              <Link href="/#pastTours" className="hidden text-sm font-semibold text-brand-600 hover:text-brand-500 sm:block">
                Xem tất cả <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreTours.map((t) => <PastTourCard key={t.id} tour={t} />)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
