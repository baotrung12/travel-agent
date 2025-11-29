"use client";
import { useState } from "react";

export default function ScheduleGallery({ images }: { images: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const visibleImages = showAll ? images : images.slice(0, 4);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Hình ảnh lịch trình</h2>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 gap-4">
        {visibleImages.map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-lg shadow cursor-pointer"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img}
              alt={`Schedule image ${idx + 1}`}
              className="w-full h-48 object-cover hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>

      {/* Show more button */}
      {!showAll && images.length > 4 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Xem thêm
          </button>
        </div>
      )}

      {/* Lightbox modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full mx-4">
            <img
              src={selectedImage}
              alt="Selected schedule"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full shadow hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
