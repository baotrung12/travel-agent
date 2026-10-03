'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ChevronLeftIcon, ChevronRightIcon, MapPinIcon} from '@heroicons/react/24/outline';

const slides = [
  {src: '/banner1.jpg', location: 'Vịnh Hạ Long, Quảng Ninh'},
  {src: '/banner2.jpg', location: 'Biển Mỹ Khê, Đà Nẵng'},
  {src: '/banner3.jpg', location: 'Phố cổ Hội An lúc hoàng hôn'},
  {src: '/banner4.jpg', location: 'Ruộng bậc thang Mù Cang Chải, Yên Bái'},
  {src: '/banner5.jpg', location: 'Sông Hoài, Hội An'},
];

const AUTOPLAY_MS = 6000;

// Full-width hero carousel with crossfade, autoplay (paused on hover / reduced motion), arrows, dots and swipe.
export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, go]);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) go(index + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Điểm đến nổi bật"
      className="relative mt-16 h-[min(78vh,760px)] min-h-[440px] overflow-hidden bg-brand-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.src}
            alt={slide.location}
            fill
            priority={i === 0}
            quality={85}
            sizes="100vw"
            className={`object-cover transition-transform duration-[7000ms] ease-out ${i === index ? 'scale-105' : 'scale-100'}`}
          />
        </div>
      ))}

      {/* Readability gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-950/75 via-brand-950/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Copy */}
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 md:px-20">
        <div className="max-w-xl text-white">
          <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase ring-1 ring-white/30 backdrop-blur">
            Du lịch giáo dục
          </p>
          <h1 className="mt-4 text-4xl/[1.2] font-extrabold tracking-tight text-balance sm:text-5xl/[1.2] lg:text-6xl/[1.18]">
            Hành trình học tập trải nghiệm khắp Việt Nam
          </h1>
          <p className="mt-5 max-w-lg text-base/7 text-white/90 sm:text-lg/8">
            Tour an toàn, ý nghĩa cho học sinh và giáo viên — lịch trình thiết kế riêng theo nhu cầu của nhà trường.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#tourForSale" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-800 shadow-sm hover:bg-brand-50">
              Xem tour nổi bật
            </Link>
            <Link href="/#contactUs" className="rounded-lg px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/70 ring-inset hover:bg-white/10">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </div>

      {/* Location caption */}
      <p className="absolute bottom-6 left-4 inline-flex items-center gap-x-1.5 text-sm font-medium text-white/90 sm:left-6 lg:left-8" aria-live="polite">
        <MapPinIcon className="size-4" />
        {slides[index].location}
      </p>

      {/* Dots */}
      <div className="absolute right-4 bottom-6 flex gap-2 sm:right-6 lg:right-8">
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => go(i)}
            aria-label={`Ảnh ${i + 1}: ${slide.location}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all cursor-pointer ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(index - 1)}
        aria-label="Ảnh trước"
        className="absolute top-1/2 left-3 hidden -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25 md:block cursor-pointer"
      >
        <ChevronLeftIcon className="size-6" />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Ảnh sau"
        className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-full bg-white/15 p-2.5 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25 md:block cursor-pointer"
      >
        <ChevronRightIcon className="size-6" />
      </button>
    </section>
  );
}
