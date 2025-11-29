import Image from "next/image";

type Tour = {
  title: string;
  image: string;
  itinerary: string;
  departure: string;
  date: string;
  duration: string;
  transport: string;
  price: number;
};

export default function RelatedTours({ tours }: { tours: Tour[] }) {
  return (
    <div className="bg-white mt-12 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Tour liên quan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tours.map((tour, i) => (
          <div key={i} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="relative h-48 w-full">
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 space-y-2 text-gray-700">
              <h3 className="font-semibold text-lg text-blue-800">{tour.title}</h3>
              <p className="text-sm text-gray-500">{tour.itinerary}</p>
              <p><strong>Khởi hành:</strong> {tour.departure}</p>
              <p><strong>Ngày đi:</strong> {tour.date}</p>
              <p><strong>Thời gian:</strong> {tour.duration}</p>
              <p><strong>Phương tiện:</strong> {tour.transport}</p>
              <p className="text-red-600 font-bold text-lg">{tour.price.toLocaleString("vi-VN")} đ</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
