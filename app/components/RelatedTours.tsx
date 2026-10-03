import Link from "next/link";
import TourCard from "@/app/components/TourCard";
import {Tour} from "@/app/components/EditTourForm";

export default function RelatedTours({ tours }: { tours: Tour[] }) {
  return (
    <section aria-labelledby="related-heading">
      <div className="flex items-end justify-between">
        <h2 id="related-heading" className="text-xl font-bold text-brand-950">Có thể bạn cũng thích</h2>
        <Link href="/#tourForSale" className="hidden text-sm font-semibold text-brand-600 hover:text-brand-500 sm:block">
          Xem tất cả tour <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
      </div>
    </section>
  );
}
