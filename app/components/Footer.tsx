export default function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="inline-block rounded-lg bg-white px-3 py-2">
              <img src="/logo.png" alt="Edutour" className="h-10 w-auto" />
            </div>
            <p className="mt-4 text-sm/6 text-brand-200">
              Tour học tập trải nghiệm cho học sinh và tham quan dành cho giáo viên trên khắp Việt Nam.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h4 className="text-sm font-semibold text-white">Menu</h4>
              <ul className="mt-4 space-y-3 !list-none !pl-0 text-sm">
                <li><a href="/" className="hover:text-white">Trang chủ</a></li>
                <li><a href="/#tourForSale" className="hover:text-white">Tour nổi bật</a></li>
                <li><a href="/#popularPlaces" className="hover:text-white">Điểm đến</a></li>
                <li><a href="/#contactUs" className="hover:text-white">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Tham khảo</h4>
              <ul className="mt-4 space-y-3 !list-none !pl-0 text-sm">
                <li><a href="/#contactUs" className="hover:text-white">Liên hệ chúng tôi</a></li>
                <li><a href="/policy" className="hover:text-white">Chính sách</a></li>
                <li><a href="/faq" className="hover:text-white">Câu hỏi thường gặp</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-sm text-brand-300">
          © {new Date().getFullYear()} EDUTOUR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
