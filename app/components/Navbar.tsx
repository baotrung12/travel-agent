"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-blue-600 cursor-pointer">
                TravelAgent
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/destinations" className="hover:text-blue-600">Destinations</Link>
            <Link href="/packages" className="hover:text-blue-600">Packages</Link>
            <Link href="/about" className="hover:text-blue-600">About</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
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
          <Link href="/" className="block px-4 py-2 hover:bg-gray-100">Home</Link>
          <Link href="/destinations" className="block px-4 py-2 hover:bg-gray-100">Destinations</Link>
          <Link href="/packages" className="block px-4 py-2 hover:bg-gray-100">Packages</Link>
          <Link href="/about" className="block px-4 py-2 hover:bg-gray-100">About</Link>
          <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100">Contact</Link>
        </div>
      )}
    </nav>
  );
}
