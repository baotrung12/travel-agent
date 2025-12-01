'use client';

import { useEffect, useRef } from 'react';
import 'flickity/css/flickity.css';

export default function AutoHeightSlider() {
  const flickityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('flickity').then((FlickityModule) => {
      const Flickity = FlickityModule.default;
      const flkty = new Flickity(flickityRef.current!, {
        cellAlign: 'center',
        contain: true,
        wrapAround: true,
        autoPlay: false,
        pageDots: true,
        prevNextButtons: true,
        setGallerySize: true, // cho phép Flickity tự lấy chiều cao theo ảnh
      });
      flkty.resize();
    });
  }, []);

  return (
    <div className="carousel w-full" ref={flickityRef}>
      <div className="carousel-cell w-full">
        <img src="/bn4.jpg" alt="Gallery 1" className="w-full h-auto" />
      </div>
      <div className="carousel-cell w-full">
        <img src="/bn3.jpg" alt="Gallery 2" className="w-full h-auto" />
      </div>
    </div>
  );
}