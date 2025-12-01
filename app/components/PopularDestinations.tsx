"use client";

export default function PopularDestinations() {
  const destinations = [
    {
      image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/vungtau5.jpg",
      name: "Vũng Tàu",
      description: "Thành phố biển nổi tiếng với bãi Sau, bãi Trước và hải sản tươi ngon.",
    },
    {
      image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/nhatrang3.jpg",
      name: "Nha Trang",
      description: "Thiên đường biển đảo với Vinpearl Land và vịnh Nha Trang tuyệt đẹp.",
    },
    {
      image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/IMG_4754-copy-blog-1024x768.jpg",
      name: "Quy Nhơn",
      description: "Thành phố biển yên bình với Eo Gió, Kỳ Co và nhiều thắng cảnh hoang sơ.",
    },
    {
      image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/quynhon1.jpg",
      name: "Đà Nẵng",
      description: "Thành phố đáng sống với cầu Rồng, bãi biển Mỹ Khê và Bà Nà Hills.",
    },
    {
      image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/hcmc1.jpg",
      name: "TP. Hồ Chí Minh",
      description: "Trung tâm kinh tế sôi động với chợ Bến Thành, phố đi bộ Nguyễn Huệ và Bitexco Tower.",
    },
    {
      image: "https://hbzcurpwlhgkxsuikxdw.supabase.co/storage/v1/object/public/quangtrung/cattien5.jpg",
      name: "Núi Cát Tiên",
      description: "Vườn quốc gia nổi tiếng với rừng nguyên sinh, động vật hoang dã và trekking mạo hiểm.",
    },
  ];

  return (
    <section className="py-16 bg-gray-100" id="popularPlaces">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Điểm Đến Phổ Biến Tại Việt Nam
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{dest.name}</h3>
                <p className="text-gray-600">{dest.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
