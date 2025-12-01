"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-sky-600 font-semibold shadow-md fixed w-full top-0 z-50">
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
            <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
            <Link href="/#tourForSale" className="hover:text-sky-700">Tour nổi bật</Link>
            <Link href="/#pastTours" className="hover:text-sky-700">Tour trường học</Link>
            <Link href="/#popularPlaces" className="hover:text-sky-700">Địa điểm du lịch</Link>
            <Link href="/#contactUs" className="hover:text-sky-700">Liên hệ</Link>
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
        <div className="md:hidden bg-white shadow-lg">
          <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
          <Link href="/#tourForSale" className="hover:text-sky-700">Tour nổi bật</Link>
          <Link href="/#pastTours" className="hover:text-sky-700">Tour trường học</Link>
          <Link href="/#popularPlaces" className="hover:text-sky-700">Địa điểm du lịch</Link>
          <Link href="/#contactUs" className="hover:text-sky-700">Liên hệ</Link>
        </div>
      )}
    </nav>
  );
}
