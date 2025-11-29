// app/past-tours/[slug]/page.tsx

import Breadcrumbs from "@/app/components/Breadcrumbs";
import PastTourHeroHeader from "@/app/components/PastTourHeroHeader";
import PastTourGallery from "@/app/components/PastTourGallery";
import Testimonials from "@/app/components/Testimonials";
import {headers} from "next/headers";
import {notFound} from "next/navigation";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {Category} from "@/app/generated/prisma/enums";
import {buildDuration} from "@/utils/dateUtils";

type Testimonial = {
  name: string;
  role?: string;
  tourName: string;
  avatarUrl?: string;
  quote: string;
};

export default async function PastTourDetailPage({params}: { params: Promise<{ slug: string }> }) {
  // Mocked data (replace with Supabase fetch by slug)
  const tourTitle = "Nha Trang tháng 3/2024";
  const subtitle = "Khám phá hành trình đáng nhớ cùng 40 khách hàng thân thiết.";
  const heroImage =
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang-hero.jpg";

  const images = [
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang1.jpg",
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang2.jpg",
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang3.jpg",
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang4.jpg",
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang5.jpg",
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang6.jpg",
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang7.jpg",
    "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang8.jpg",
  ];

  const description =
    "Biển xanh, cát trắng, ẩm thực phong phú và những hoạt động gắn kết đã tạo nên một hành trình đáng nhớ. Đoàn đã tham quan I-Resort, cáp treo, bãi biển Dốc Lết, Viện Hải Dương Học và trải nghiệm BBQ bãi biển. Dịch vụ chuyên nghiệp, lịch trình cân đối và sự nhiệt tình của đội ngũ đã mang đến trải nghiệm tuyệt vời cho tất cả thành viên.";

  const testimonials: Testimonial[] = [
    {
      name: "Nguyễn Hoàng Long",
      tourName: "Nha Trang tháng 3/2024",
      avatarUrl:
        "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/avatar-long.jpg",
      quote:
        "Chuyến đi Nha Trang thật tuyệt vời! Kỷ niệm đáng nhớ, dịch vụ chuyên nghiệp và chu đáo. Chắc chắn sẽ đăng ký tour tiếp theo.",
    },
    {
      name: "Trần Thu Hà",
      tourName: "Nha Trang tháng 3/2024",
      avatarUrl:
        "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/avatar-ha.jpg",
      quote:
        "Lịch trình hợp lý, HDV thân thiện, khách sạn thoải mái. Đặc biệt thích trải nghiệm tắm bùn và BBQ bãi biển.",
    },
    {
      name: "Phạm Quốc Anh",
      tourName: "Nha Trang tháng 3/2024",
      avatarUrl:
        "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/avatar-anh.jpg",
      quote:
        "Công ty tổ chức rất chuyên nghiệp. Gia đình tôi ai cũng hài lòng, các bé rất thích đi cáp treo và tắm biển.",
    },
  ];

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

  const tour = await res.json();
  const stats = [
    {label: "Số khách", value: tour.participants?.toString() ?? "N/A"},
    {label: "Thời gian", value: buildDuration(tour.departureStart!, tour.departureEnd!)},
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
