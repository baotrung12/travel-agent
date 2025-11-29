// components/success/Testimonials.tsx
import Image from "next/image";

type Testimonial = {
  name: string;
  role?: string;
  tourName: string;
  avatarUrl?: string;
  quote: string;
};

export default function Testimonials({
                                       title,
                                       items,
                                     }: {
  title: string;
  items: Testimonial[];
}) {
  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-blue-700 mb-6">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((t, i) => (
          <div
            key={i}
            className="rounded-lg border bg-gray-50 p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white">
                {t.avatarUrl ? (
                  <Image src={t.avatarUrl} alt={t.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-500">{t.tourName}</p>
              </div>
            </div>
            <blockquote className="text-gray-700">
              “{t.quote}”
            </blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
