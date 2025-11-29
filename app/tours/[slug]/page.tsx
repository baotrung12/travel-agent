import Image from "next/image";
import BookingSection from "@/app/components/BookingSection";
import TourSchedule from "@/app/components/TourSchedule";
import SectionBlock from "@/app/components/SectionBlock";
import RelatedTours from "@/app/components/RelatedTours";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import {notFound} from "next/navigation";
import {headers} from "next/headers";

// Mock data (later you can fetch from Supabase or API)
const tours = [
  {
    slug: "nha-trang-xua",
    title: "NHA TRANG XƯA – LÀNG YẾN MAI SINH – ĐỐC LẾT – I RESORT",
    images: [
      "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang1.jpg",
      "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang2.jpg",
      "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang3.jpg",
      "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang4.jpg",
      "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/quynhon1.jpg",
    ],
    departure: "TP Hồ Chí Minh",
    promotion: "Miễn phí: Xe đón khách tận nơi tại các quận trung tâm TP.HCM",
    itinerary: [
      "Tham quan các địa điểm nổi bật tại Nha Trang Xưa",
      "Tham quan Làng Yến Mai Sinh – nơi nuôi chim yến và khai thác tổ yến",
      "Tham quan bãi biển Đốc Lết – một trong những bãi biển đẹp nhất Nha Trang",
      "Thư giãn tại I Resort với dịch vụ tắm bùn khoáng nóng",
    ],
    price: "3,990,000 đ",
  }
];

const schedule = [
  {
    day: "Ngày 01",
    title: "TP. HỒ CHÍ MINH – NHA TRANG",
    description:
      "Đón du khách tại điểm hẹn... nghỉ ngơi. Buổi chiều tham quan Chùa Long Sơn và Nhà thờ Núi...",
  },
  {
    day: "Ngày 02",
    title: "NHA TRANG - DỐC LẾT",
    description:
      "Tham quan bãi biển Dốc Lết... tháp bà Ponagar và suối khoáng nóng Tháp Bà...",
  },
  {
    day: "Ngày 03",
    title: "NHA TRANG – I RESORT",
    description:
      "Tham quan I Resort... Viện Hải Dương Học và Chùa Từ Vân. Tối có thể tham gia chương trình BBQ và lửa trại.",
  },
];

const relatedTours = [
  {
    title: "HÀNH TRÌNH 50 NĂM - NHA TRANG - PHÚ YÊN - QUY NHƠN",
    image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/quynhon1.jpg",
    itinerary: "Miền Trung, Du lịch biển",
    departure: "TP Hồ Chí Minh",
    date: "01/02/2025",
    duration: "5 ngày 4 đêm",
    transport: "Đường bộ",
    price: 13150000,
  },
  {
    title: "DU XUÂN BÍNH NGỌ 2026 - NHA TRANG - ĐÀ LẠT",
    image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang3.jpg",
    itinerary: "Miền Trung, Tây Nguyên",
    departure: "TP Hồ Chí Minh",
    date: "16/02/2026",
    duration: "4 ngày 3 đêm",
    transport: "Đường bộ",
    price: 6979000,
  },
  {
    title: "NHA TRANG - BA HÒ - HOA LAN - LÀNG YẾN",
    image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/vungtau2.jpg",
    itinerary: "Miền Trung, Du lịch biển",
    departure: "TP Hồ Chí Minh",
    date: "01/02/2025",
    duration: "3 ngày 2 đêm",
    transport: "Đường bộ",
    price: 5579000,
  },
];


export default async function TourDetailPage({params}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

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
  const res = await fetch(`${baseUrl}/api/v1/tours/${slug}`, {
    cache: "no-store",
  });

  console.log("Fetch result: ", res);

  if (!res.ok) return notFound();

  const tour = await res.json();

  return (
    <section className="bg-white py-12 px-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumbs />

      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-700 mb-6">{tour.title}</h1>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {tour.imageUrls.map((src, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-lg ${
              i === 0
                ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2 h-96"
                : "h-48"
            }`}
          >
            <Image
              src={src}
              alt={`Tour image ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
        ))}
      </div>


      {/* Overview */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Tổng quan</h2>
        <p className="text-gray-700">Điểm khởi hành: <strong>{tour.departure}</strong></p>
      </div>

      {/* Promotion */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Chính sách khuyến mãi</h2>
        <p className="text-green-700">{tour.promotion}</p>
      </div>

      {/* Itinerary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Lịch trình</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {tour.tourSchedule.map((item, i) => (
            <li key={i}>{item.title}</li>
          ))}
        </ul>
      </div>

      <BookingSection />

      <TourSchedule schedule={tour.tourSchedule} />

      <SectionBlock
        title="Chính sách hủy/đổi tour"
        items={[
          {
            title: "Điều kiện hủy tour",
            content:
              "Nếu quý khách hủy tour trước 7 ngày: hoàn 100% chi phí. Từ 3–6 ngày: hoàn 50%. Trong vòng 48 giờ: không hoàn tiền.",
          },
          {
            title: "Điều kiện đổi lịch trình",
            content:
              "Việc đổi lịch trình cần thông báo trước ít nhất 5 ngày và tùy thuộc vào tình trạng tour.",
          },
        ]}
      />

      <SectionBlock
        title="Thông tin bảo hiểm du lịch"
        items={[
          {
            title: "Phạm vi bảo hiểm",
            content:
              "Bảo hiểm bao gồm tai nạn cá nhân, chi phí y tế khẩn cấp, và hỗ trợ trong trường hợp thiên tai hoặc hủy tour do lý do bất khả kháng.",
          },
          {
            title: "Mức bồi thường",
            content:
              "Mỗi khách hàng được mua bảo hiểm du lịch với mức bồi thường tối đa 100 triệu đồng.",
          },
        ]}
      />

      <SectionBlock
        title="Thông tin khác"
        items={[
          {
            title: "Giấy tờ tùy thân",
            content:
              "·   Du khách mang theo giấy CCCD hoặc Hộ chiếu. Đối với du khách là Việt kiều, Quốc tế nhập cảnh Việt Nam bằng visa rời, vui lòng mang theo visa khi đăng ký và đi tour.\n" +
              "\n" +
              "·   Khách lớn tuổi (từ 70 tuổi trở lên), khách tàn tật tham gia tour, phải có thân nhân đi kèm và cam kết đảm bảo đủ sức khỏe khi tham gia tour du lịch.\n" +
              "\n" +
              "·   Trẻ em dưới 14 tuổi khi đi tour phải mang theo Giấy khai sinh hoặc Hộ chiếu. Trẻ em từ 14 tuổi trở lên phải mang theo giấy CCCD hoặc Hộ chiếu riêng.\n" +
              "\n" +
              "·   Tất cả giấy tờ tùy thân mang theo đều phải bản chính.\n" +
              "\n" +
              "·   Du khách mang theo hành lý gọn nhẹ và phải tự bảo quản hành lý, tiền bạc, tư trang trong suốt thời gian đi du lịch.\n" +
              "\n" +
              "·   Khách Việt Nam ở cùng phòng với khách Quốc tế hoặc Việt kiều yêu cầu phải có giấy hôn thú.",
          },
          {
            title: "Liên hệ",
            content:
              "Công ty TNHH Một Thành Viên Dịch vụ Lữ hành Saigontourist\n" +
              "\n" +
              "45 Lê Thánh Tôn, Phường Sài Gòn. Điện thoại: (028) 38279279\n" +
              "\n" +
              "01 Nguyễn Chí Thanh, Phường An Đông, Điện thoại: (028) 38303029\n" +
              "\n" +
              "102 Nguyễn Huệ, Phường Sài Gòn, Điện thoại: (028) 35208208\n" +
              "\n" +
              "19 Hoàng Việt, Phường Tân Sơn Nhất, Điện thoại: (028) 38110439\n" +
              "\n" +
              "Đường dây nóng: 0919511279 - Tổng đài: 1900 1808",
          },
        ]}
      />

      <RelatedTours tours={relatedTours} />

    </section>
  );
}
