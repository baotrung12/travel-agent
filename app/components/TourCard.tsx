import Link from "next/link";
import {buildDuration} from "@/utils/dateUtils";
import {Category} from "@/app/generated/prisma/enums";

export default function TourCard({ tour }: { tour: any }) {
  const label = tour.category === Category.STUDENT ? 'Trải nghiệm học sinh' : 'Tham quan giáo viên'
  return (
    <Link href={`/tours/${tour.slug}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300">
        <div className="h-[250px] w-full">
          <img
            src={tour.imageUrls?.[0] || "/placeholder.jpg"}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col justify-between h-[180px]">
          <h3 className="text-md font-semibold mt-3 text-left">{tour.title}</h3>
          <p className="text-sm text-gray-600 text-left">Mã tour: <b>{tour.tourCode}</b></p>
          <p className="text-sm text-left text-gray-600 text-left space-x-2">
            Thời gian: <b>{buildDuration(tour.departureStart, tour.departureEnd)}</b>
          </p>
          <p className="text-green-600 font-bold mt-2 text-left">{label}</p>
        </div>
      </div>
    </Link>
  );
}
