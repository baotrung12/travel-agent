import Link from "next/link";

export default function TourCard({ tour }: { tour: any }) {
  return (
    <Link href={`/tours/${tour.slug}`}>
      <div className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition p-4">
        <img
          src={tour.tourImages?.[0] || "/placeholder.jpg"}
          alt={tour.title}
          className="w-full h-40 object-cover rounded"
        />
        <h3 className="text-xl font-semibold mt-3">{tour.title}</h3>
        <p className="text-gray-600">Mã tour: {tour.tourCode}</p>
        <p className="text-gray-600">
          {new Date(tour.departureStart).toLocaleDateString("vi-VN")} →{" "}
          {new Date(tour.departureEnd).toLocaleDateString("vi-VN")}
        </p>
        <p className="text-blue-600 font-bold mt-2">{tour.price} VNĐ</p>
        <p className="mt-3 text-blue-500 underline">Xem chi tiết</p>
      </div>
    </Link>
  );
}
