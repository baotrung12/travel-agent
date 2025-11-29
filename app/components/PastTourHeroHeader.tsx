// components/success/HeroHeader.tsx
import Image from "next/image";

type Stat = { label: string; value: string };

export default function PastTourHeroHeader({
                                     title,
                                     dateTitle,
                                     subtitle,
                                     heroImage,
                                     stats,
                                     description,
                                   }: {
  title: string;
  dateTitle: string;
  subtitle: string;
  heroImage: string;
  stats: Stat[];
  description: string;
}) {
  return (
    <section className="bg-gray-100 p-6 mb-5 rounded-xl shadow-md">
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">{title}</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mt-1">{dateTitle}</h2>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>

      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
        <Image src={heroImage} alt={dateTitle} fill className="object-cover" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-700">{s.value}</p>
            <p className="text-gray-600">{s.label}</p>
          </div>
        ))}
      </div>

      <p className="text-gray-700">{description}</p>
    </section>
  );
}
