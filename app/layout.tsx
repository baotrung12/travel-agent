import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ToastProvider} from "@/app/ToastProvider";

// Designed for Vietnamese: full diacritic coverage and well-spaced stacked accents
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edutour | Du lịch giáo dục",
  description: "Tour học tập trải nghiệm cho học sinh và tham quan cho giáo viên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
