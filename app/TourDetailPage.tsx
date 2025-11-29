import Image from "next/image";

// Mock data (later you can fetch from Supabase or API)
const tours = [
  {
    id: "vungtau",
    name: "Tour Vũng Tàu 2 Ngày 1 Đêm",
    image: "/vungtau.jpg",
    price: "1,500,000 VND",
    description:
      "Khám phá thành phố biển Vũng Tàu với bãi Sau, bãi Trước, tượng Chúa Kitô và hải sản tươi ngon.",
    itinerary: [
      "Ngày 1: Khởi hành từ TP.HCM, tham quan Bãi Sau, thưởng thức hải sản.",
      "Ngày 2: Tham quan tượng Chúa Kitô, ngọn hải đăng, mua sắm tại chợ Vũng Tàu.",
    ],
  },
  // Add more tours here...
];

export default function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = tours.find((t) => t.id === params.id);

  if (!tour) {
    return <div className="p-8">Tour không tồn tại.</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-6">{tour.name}</h1>

        {/* Image */}
        <Image
          src={tour.image}
          alt={tour.name}
          width={1200}
          height={600}
          className="rounded-lg shadow-md mb-8"
        />

        {/* Description */}
        <p className="text-lg text-gray-700 mb-6">{tour.description}</p>

        {/* Price */}
        <p className="text-2xl font-semibold text-blue-600 mb-6">
          Giá: {tour.price}
        </p>

        {/* Itinerary */}
        <h2 className="text-2xl font-bold mb-4">Lịch trình</h2>
        <ul className="list-disc list-inside space-y-2 mb-8">
          {tour.itinerary.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>

        {/* Booking Button */}
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
          Đặt Tour Ngay
        </button>
      </div>
    </section>
  );
}
