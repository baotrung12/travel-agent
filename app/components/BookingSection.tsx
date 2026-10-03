"use client";

import {useState} from "react";
import Link from "next/link";
import {CheckCircleIcon, MinusIcon, PlusIcon} from "@heroicons/react/24/outline";

const formatVnd = (value: number) => value.toLocaleString("vi-VN") + " đ";

function Counter({label, hint, value, min, onChange}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-brand-700">{hint}</p>
      </div>
      <div className="flex items-center gap-x-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Giảm ${label}`}
          className="rounded-full bg-white p-1.5 text-brand-700 ring-1 ring-slate-300 hover:bg-brand-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <MinusIcon className="size-4" />
        </button>
        <span className="w-5 text-center text-sm font-semibold text-gray-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Tăng ${label}`}
          className="rounded-full bg-white p-1.5 text-brand-700 ring-1 ring-slate-300 hover:bg-brand-50 cursor-pointer"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function BookingSection({title, price, tourCode, duration, departurePoint}: {
  title: string;
  price: number;
  tourCode: string;
  duration?: string;
  departurePoint?: string;
}) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);

  const hasPrice = price > 0;
  const childPrice = Math.round(price / 2);
  const totalPrice = adults * price + children * childPrice;

  // Prefills the contact form with this tour and the chosen guests
  const guests = [`${adults} người lớn`, children && `${children} trẻ em`, babies && `${babies} em bé`].filter(Boolean).join(", ");
  const contactHref = `/?${new URLSearchParams({
    tour: title,
    message: hasPrice ? `Tôi muốn đặt tour cho ${guests} (mã tour ${tourCode}).` : `Tôi muốn nhận báo giá tour (mã tour ${tourCode}).`,
  })}#contactUs`;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200">
      {/* Price header */}
      <div className="bg-brand-950 px-6 py-5">
        <p className="text-xs font-medium tracking-wide text-brand-200 uppercase">Giá từ</p>
        <p className="mt-1 flex items-baseline gap-x-1">
          <span className="text-3xl font-bold tracking-tight text-amber-300">{hasPrice ? formatVnd(price) : "Liên hệ"}</span>
          {hasPrice && <span className="text-sm text-brand-200">/ khách</span>}
        </p>
        <p className="mt-2 text-sm text-brand-100">Mã tour: <span className="font-semibold text-white">{tourCode}</span></p>
      </div>

      <div className="px-6 pb-6">
        {(duration || departurePoint) && (
          <dl className="space-y-2 border-b border-slate-200 py-4 text-sm">
            {duration && (
              <div className="flex justify-between gap-x-4">
                <dt className="text-slate-500">Thời gian</dt>
                <dd className="font-medium text-slate-900">{duration}</dd>
              </div>
            )}
            {departurePoint && (
              <div className="flex justify-between gap-x-4">
                <dt className="text-slate-500">Khởi hành</dt>
                <dd className="text-right font-medium text-slate-900">{departurePoint}</dd>
              </div>
            )}
          </dl>
        )}

        {hasPrice && (
          <>
            <p className="mt-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">Số người</p>
            <div className="divide-y divide-slate-100">
              <Counter label="Người lớn" hint={formatVnd(price)} value={adults} min={1} onChange={setAdults} />
              <Counter label="Trẻ em" hint={`5 – 11 tuổi · ${formatVnd(childPrice)}`} value={children} min={0} onChange={setChildren} />
              <Counter label="Em bé" hint="Dưới 5 tuổi · Miễn phí" value={babies} min={0} onChange={setBabies} />
            </div>

            <div className="mt-2 flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3">
              <span className="text-sm font-semibold text-brand-950">Tạm tính ({adults + children + babies} khách)</span>
              <span className="text-lg font-bold text-red-600">{formatVnd(totalPrice)}</span>
            </div>
          </>
        )}

        <Link
          href={contactHref}
          className="mt-5 block w-full rounded-lg bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
        >
          Liên hệ đặt tour
        </Link>
        <Link
          href={contactHref}
          className="mt-3 block w-full rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-brand-700 ring-1 ring-brand-600 ring-inset hover:bg-brand-50"
        >
          Tư vấn miễn phí
        </Link>

        <ul className="mt-5 space-y-2 text-xs text-slate-500">
          <li className="flex gap-x-2"><CheckCircleIcon className="size-4 flex-none text-green-600" />Xác nhận lịch khởi hành phù hợp với đoàn</li>
          <li className="flex gap-x-2"><CheckCircleIcon className="size-4 flex-none text-green-600" />Đã bao gồm bảo hiểm du lịch</li>
        </ul>
      </div>
    </div>
  );
}
