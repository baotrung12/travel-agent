"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminAuthPopup from "@/app/components/AdminAuthPopup";
import { checkAdminSession } from "@/app/services/adminAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  // Always "Đăng nhập": the public page never reveals a signed-in session.
  // An existing (server-verified) session goes straight to the dashboard.
  const handleLogin = async () => {
    setIsOpen(false);
    if (await checkAdminSession()) router.push("/admin/dashboard");
    else setShowLogin(true);
  };

  const adminButton = (
    <button
      onClick={handleLogin}
      className="rounded-lg px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-brand-600 ring-inset hover:bg-brand-50 cursor-pointer"
    >
      Đăng nhập
    </button>
  );

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-900/5 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <img src="/logo.png" width={120} height={80}  alt="Du lịch giáo dục"/>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="hover:text-brand-700">Trang chủ</Link>
            <Link href="/#tourForSale" className="hover:text-brand-700">Tour nổi bật</Link>
            <Link href="/#pastTours" className="hover:text-brand-700">Tour trường học</Link>
            <Link href="/#popularPlaces" className="hover:text-brand-700">Địa điểm du lịch</Link>
            <Link href="/#contactUs" className="hover:text-brand-700">Liên hệ</Link>
            {adminButton}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg flex flex-col gap-3 px-4 py-4">
          <Link href="/" className="hover:text-brand-700">Trang chủ</Link>
          <Link href="/#tourForSale" className="hover:text-brand-700">Tour nổi bật</Link>
          <Link href="/#pastTours" className="hover:text-brand-700">Tour trường học</Link>
          <Link href="/#popularPlaces" className="hover:text-brand-700">Địa điểm du lịch</Link>
          <Link href="/#contactUs" className="hover:text-brand-700">Liên hệ</Link>
          <div className="pt-2 border-t border-gray-100">{adminButton}</div>
        </div>
      )}

      {showLogin && (
        <AdminAuthPopup
          onClose={() => setShowLogin(false)}
          onSuccess={() => router.push("/admin/dashboard")}
        />
      )}
    </nav>
  );
}
