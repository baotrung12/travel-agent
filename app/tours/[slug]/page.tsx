import Link from "next/link";
import {notFound} from "next/navigation";
import {headers} from "next/headers";
import {
  ChevronRightIcon,
  ClockIcon,
  FlagIcon,
  GiftIcon,
  HashtagIcon,
  MapPinIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import BookingSection from "@/app/components/BookingSection";
import RelatedTours from "@/app/components/RelatedTours";
import TourGallery from "@/app/components/tour-detail/TourGallery";
import TourItinerary from "@/app/components/tour-detail/TourItinerary";
import InfoAccordion, {InfoItem} from "@/app/components/tour-detail/InfoAccordion";
import {Tour} from "@/app/components/EditTourForm";
import {CATEGORY_LABELS} from "@/utils/tourLabels";
import {sanitizeRichText} from "@/lib/sanitize";

const travelInfo: InfoItem[] = [
  {
    title: "Điều kiện hủy tour",
    content: "Nếu quý khách hủy tour trước 7 ngày: hoàn 100% chi phí. Từ 3–6 ngày: hoàn 50%. Trong vòng 48 giờ: không hoàn tiền.",
  },
  {
    title: "Điều kiện đổi lịch trình",
    content: "Việc đổi lịch trình cần thông báo trước ít nhất 5 ngày và tùy thuộc vào tình trạng tour.",
  },
  {
    title: "Bảo hiểm du lịch",
    content: (
      <>
        <p>Bảo hiểm bao gồm tai nạn cá nhân, chi phí y tế khẩn cấp, và hỗ trợ trong trường hợp thiên tai hoặc hủy tour do lý do bất khả kháng.</p>
        <p className="mt-2">Mỗi khách hàng được mua bảo hiểm du lịch với mức bồi thường tối đa 100 triệu đồng.</p>
      </>
    ),
  },
  {
    title: "Giấy tờ tùy thân",
    content: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Du khách mang theo CCCD hoặc Hộ chiếu. Việt kiều và khách quốc tế nhập cảnh bằng visa rời vui lòng mang theo visa khi đăng ký và đi tour.</li>
        <li>Khách từ 70 tuổi trở lên, khách khuyết tật phải có thân nhân đi kèm và cam kết đủ sức khỏe khi tham gia tour.</li>
        <li>Trẻ em dưới 14 tuổi mang theo Giấy khai sinh hoặc Hộ chiếu. Trẻ từ 14 tuổi trở lên mang CCCD hoặc Hộ chiếu riêng.</li>
        <li>Tất cả giấy tờ tùy thân mang theo đều phải là bản chính.</li>
        <li>Du khách mang hành lý gọn nhẹ và tự bảo quản hành lý, tiền bạc, tư trang trong suốt chuyến đi.</li>
        <li>Khách Việt Nam ở cùng phòng với khách quốc tế hoặc Việt kiều cần có giấy đăng ký kết hôn.</li>
      </ul>
    ),
  },
];

async function getBaseUrl() {
  // Prefer env, otherwise derive from request headers
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  if (envBase?.startsWith("http")) return envBase;
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return host ? `${protocol}://${host}` : "";
}

export default async function TourDetailPage({params}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/v1/tours/${slug}`, { cache: "no-store" });
  if (!res.ok) return notFound();
  const tour: Tour = await res.json();

  // Other published tours, same category first
  const allTours: Tour[] = await fetch(`${baseUrl}/api/v1/tours`, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []);
  const relatedTours = allTours
    .filter((t) => t.id !== tour.id)
    .sort((x, y) => Number(y.category === tour.category) - Number(x.category === tour.category))
    .slice(0, 3);

  const price = Number(tour.price) || 0;
  const facts = [
    { icon: MapPinIcon, label: "Khởi hành", value: tour.departurePoint },
    { icon: ClockIcon, label: "Thời gian", value: tour.duration },
    { icon: FlagIcon, label: "Điểm đến", value: tour.destination },
    { icon: HashtagIcon, label: "Mã tour", value: tour.tourCode },
  ].filter((fact) => fact.value);

  const card = "rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6";
  const cardTitle = "text-lg font-bold text-brand-900";

  return (
    <>
      <Navbar />

      <main className="bg-slate-100 pt-16 pb-24 lg:pb-16">
        {/* Title + gallery on white */}
        <div className="bg-white pb-8 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              <ol role="list" className="flex min-w-0 items-center gap-x-2 text-sm">
                <li className="whitespace-nowrap"><Link href="/" className="text-slate-500 hover:text-brand-700">Trang chủ</Link></li>
                <li><ChevronRightIcon className="size-4 text-slate-400" /></li>
                <li><Link href="/#tourForSale" className="text-slate-500 hover:text-brand-700">Tour</Link></li>
                <li><ChevronRightIcon className="size-4 text-slate-400" /></li>
                <li className="truncate font-medium text-slate-900" aria-current="page">{tour.title}</li>
              </ol>
            </nav>

            <div className="mt-4">
              <span className="inline-flex items-center rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-600/20 ring-inset">
                {CATEGORY_LABELS[tour.category] ?? tour.category}
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">{tour.title}</h1>
            </div>

            <div className="mt-5">
              <TourGallery images={tour.imageUrls ?? []} title={tour.title} />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            <section aria-labelledby="overview-heading" className={card}>
              <h2 id="overview-heading" className="sr-only">Tổng quan</h2>

              {facts.length > 0 && (
                <dl className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex items-start gap-x-2">
                      <fact.icon className="mt-0.5 size-5 flex-none text-brand-600" />
                      <dt className="font-semibold whitespace-nowrap text-slate-900">{fact.label}:</dt>
                      <dd className="text-slate-600 break-words">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {tour.summary && (
                <div className="mt-5 rounded-xl bg-brand-50 p-5 ring-1 ring-brand-200">
                  <p className="flex items-center gap-x-2 font-semibold text-brand-900">
                    <SparklesIcon className="size-5 text-amber-500" />
                    Tour có gì hay?
                  </p>
                  <p className="mt-2 text-sm/7 whitespace-pre-line text-slate-700">{tour.summary}</p>
                </div>
              )}

              {tour.promotion && (
                <div className="mt-4 flex gap-x-3 rounded-xl bg-amber-50 p-5 ring-1 ring-amber-200">
                  <GiftIcon className="size-5 flex-none text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">Ưu đãi</p>
                    <p className="mt-1 text-sm/7 whitespace-pre-line text-amber-800">{tour.promotion}</p>
                  </div>
                </div>
              )}
            </section>

            {tour.tourSchedule?.length > 0 && (
              <section aria-labelledby="itinerary-heading" className={card}>
                <TourItinerary
                  days={tour.tourSchedule.map((day) => ({ title: day.title, description: sanitizeRichText(day.description) }))}
                  heading={<h2 id="itinerary-heading" className={cardTitle}>Lịch trình chi tiết</h2>}
                />
              </section>
            )}

            <section aria-labelledby="info-heading" className={card}>
              <h2 id="info-heading" className={cardTitle}>Thông tin cần biết</h2>
              <div className="mt-4">
                <InfoAccordion items={travelInfo} />
              </div>
            </section>
          </div>

          {/* Booking card */}
          <aside id="booking" className="scroll-mt-24">
            <div className="lg:sticky lg:top-24">
              <BookingSection
                title={tour.title}
                price={price}
                tourCode={tour.tourCode}
                duration={tour.duration}
                departurePoint={tour.departurePoint}
              />
            </div>
          </aside>
        </div>

        {relatedTours.length > 0 && (
          <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <RelatedTours tours={relatedTours} />
          </div>
        )}
      </main>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-x-4 bg-brand-950 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.15)] lg:hidden">
        <div>
          <p className="text-xs text-brand-200">Giá từ</p>
          <p className="text-lg font-bold text-amber-300">{price > 0 ? `${price.toLocaleString("vi-VN")} đ` : "Liên hệ"}</p>
        </div>
        <a href="#booking" className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500">
          Đặt tour
        </a>
      </div>

      <Footer />
    </>
  );
}
