"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        {/* Left: Logo */}
        <div className="mb-6 md:mb-0 flex flex-col items-center space-x-3">
          <img src="/logo.png" alt="Company Logo" className="h-12 w-auto" />
          <span className="text-xl font-bold">EDUTOUR</span>
        </div>

        {/* Right: Menu & Links */}
        <div className="flex flex-col md:flex-row md:space-x-12 text-center md:text-left">
          {/* Menu */}
          <div>
            <h4 className="font-semibold mb-2">Menu</h4>
            <ul className="space-y-1">
              <li><a href="/" className="hover:text-blue-400">Trang chủ</a></li>
              <li><a href="/#tourForSale" className="hover:text-blue-400">Tour nổi bật</a></li>
              <li><a href="/#popularPlaces" className="hover:text-blue-400">Điểm đến</a></li>
              <li><a href="/#contactUs" className="hover:text-blue-400">Liên hệ</a></li>
            </ul>
          </div>

          {/* References */}
          <div className="mt-6 md:mt-0">
            <h4 className="font-semibold mb-2">Tham khảo</h4>
            <ul className="space-y-1">
              <li><a href="/#contactUs" className="hover:text-blue-400">Liên hệ chúng tôi</a></li>
              <li><a href="/policy" className="hover:text-blue-400">Chính sách</a></li>
              <li><a href="/faq" className="hover:text-blue-400">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} EDUTOUR. All rights reserved.
      </div>
    </footer>
  );
}
