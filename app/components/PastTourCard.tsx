import Link from "next/link";
import {Category} from "@/app/generated/prisma/enums";
import {ArrowRightIcon} from "@heroicons/react/16/solid";
import {buildDuration} from "@/utils/dateUtils";

export default function PastTourCard({ tour }: { tour: any }) {
  const label = tour.category === Category.STUDENT ? 'Trải nghiệm học sinh' : 'Tham quan giáo viên'
  return (
    <Link href={`/past-tours/${tour.slug}`}>
      <div className="rounded-lg shadow hover:shadow-lg transition p-4 bg-white cursor-pointer">
        <img
          src={tour.tourImages?.[0] || "/placeholder.jpg"}
          alt={tour.title}
          className="w-full h-40 object-cover rounded"
        />
        <h3 className="text-md font-semibold mt-3 text-left">{tour.title}</h3>
        <p className="text-sm text-gray-600 text-left">Mã tour: <b>{tour.tourCode}</b></p>
        <p className="text-sm text-left text-gray-600 text-left space-x-2">
          Thời gian: <b>{buildDuration(tour.departureStart, tour.departureEnd)}</b>
        </p>
        <p className="text-green-600 font-bold mt-2 text-left">{label}</p>
        {tour.feedback && (
          <p className="italic text-gray-500 mt-2">“{tour.feedback}”</p>
        )}
      </div>
    </Link>
  );
}
