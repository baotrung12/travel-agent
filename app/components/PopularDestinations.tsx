"use client";
import {useEffect, useRef, useState} from "react";
import SectionHeading from "@/app/components/SectionHeading";

export default function PopularDestinations() {
  const destinations = [
    {
      image: "/destinations/vung-tau.jpg",
      name: "Vũng Tàu",
      description: "Thành phố biển nổi tiếng với bãi Sau, bãi Trước và hải sản tươi ngon.",
    },
    {
      image: "/destinations/nha-trang.jpg",
      name: "Nha Trang",
      description: "Thiên đường biển đảo với Vinpearl Land và vịnh Nha Trang tuyệt đẹp.",
    },
    {
      image: "/destinations/quy-nhon.jpg",
      name: "Quy Nhơn",
      description: "Thành phố biển yên bình với Eo Gió, Kỳ Co và nhiều thắng cảnh hoang sơ.",
    },
    {
      image: "/destinations/da-nang.jpg",
      name: "Đà Nẵng",
      description: "Thành phố đáng sống với cầu Rồng, bãi biển Mỹ Khê và Bà Nà Hills.",
    },
    {
      image: "/hcmc.jpg",
      name: "TP. Hồ Chí Minh",
      description: "Trung tâm kinh tế sôi động với chợ Bến Thành, phố đi bộ Nguyễn Huệ và Bitexco Tower.",
    },
    {
      image: "/destinations/cat-tien.jpg",
      name: "Núi Cát Tiên",
      description: "Vườn quốc gia nổi tiếng với rừng nguyên sinh, động vật hoang dã và trekking mạo hiểm.",
    },
  ];

  return (
    <section className="scroll-mt-16 bg-white py-20" id="popularPlaces">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Điểm đến"
          title="Điểm đến phổ biến tại Việt Nam"
          subtitle="Gợi ý những địa danh nổi bật cho chuyến đi học tập và nghỉ dưỡng."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg"
            >
              <DestinationImage src={dest.image} alt={dest.name} />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-brand-950">{dest.name}</h3>
                <p className="mt-2 text-sm/6 text-slate-600">{dest.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Images live in public/destinations; shows a placeholder until the file exists
function DestinationImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // the image may have failed before hydration, when onError wasn't attached yet
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div className="w-full h-52 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <span className="text-brand-900/40 text-lg font-semibold">{alt}</span>
      </div>
    );
  }
  return <img ref={ref} src={src} alt={alt} onError={() => setFailed(true)} className="w-full h-52 object-cover transition duration-500 group-hover:scale-105" />;
}
