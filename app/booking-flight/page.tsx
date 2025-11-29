// app/flight-support/page.tsx
"use client";

export default function FlightSupportPage() {
  const handleChatOpen = () => {
    // Replace with your chatbot trigger logic
    alert("Chat bot sẽ hiển thị ở đây 🚀");
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-700">Dịch vụ đặt vé máy bay</h1>
        <p className="text-gray-600 text-lg">
          Chúng tôi hỗ trợ khách hàng đặt vé máy bay nội địa và quốc tế. Đội ngũ tư vấn viên sẽ giúp bạn tìm chuyến bay phù hợp, giá tốt và lịch trình thuận tiện.
        </p>
        <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-md">
          <img
            src="/images/flight-banner.jpg"
            alt="Đặt vé máy bay"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Support Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-md text-center">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Bạn cần hỗ trợ?</h2>
        <p className="text-gray-700 mb-4">
          Nhấn vào nút bên dưới để bắt đầu trò chuyện với tư vấn viên của chúng tôi.
        </p>
        <button
          onClick={handleChatOpen}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Bắt đầu trò chuyện
        </button>
      </div>
    </div>
  );
}
