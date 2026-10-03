"use client";
// Admin UI primitives styled after Tailwind UI (application UI) patterns.
import React from "react";
import {PhotoIcon} from "@heroicons/react/24/outline";
import {Category} from "@/app/generated/prisma/enums";

import {CATEGORY_LABELS} from "@/utils/tourLabels";

export {CATEGORY_LABELS};

export function formatPrice(price: number | string | null | undefined) {
  const value = Number(price);
  if (!price || Number.isNaN(value)) return "—";
  return value.toLocaleString("vi-VN") + " ₫";
}

const controlClass =
  "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 " +
  "placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-600 " +
  "disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm/6";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${controlClass} py-2 ${props.className ?? ""}`} />;
}

export function Field({label, hint, required, className, children}: {
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-sm/6 font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-2 text-sm/6 text-gray-500">{hint}</p>}
    </label>
  );
}

// Form section: heading beside the fields card ("split", full pages) or above it ("stacked", slide-overs).
export function Section({title, description, layout = "split", children}: {
  title: string;
  description?: string;
  layout?: "split" | "stacked";
  children: React.ReactNode;
}) {
  const split = layout === "split";
  return (
    <div className={`grid grid-cols-1 gap-x-8 ${split ? "gap-y-6 md:grid-cols-3" : "gap-y-3"}`}>
      <div className="px-4 sm:px-0">
        <h2 className="text-base/7 font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm/6 text-gray-600">{description}</p>}
      </div>
      <div className={`bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl ${split ? "md:col-span-2" : ""}`}>
        <div className={`grid grid-cols-1 gap-x-6 gap-y-6 px-4 py-6 sm:grid-cols-6 ${split ? "sm:p-8" : "sm:p-6"}`}>{children}</div>
      </div>
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white shadow-xs hover:bg-brand-500 focus-visible:outline-brand-600",
  secondary: "bg-white text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50",
  danger: "bg-red-600 text-white shadow-xs hover:bg-red-500 focus-visible:outline-red-600",
  ghost: "text-gray-700 hover:bg-gray-100",
};

export function Button({variant = "primary", className, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      type="button"
      {...props}
      className={
        "inline-flex items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 " +
        `${buttonVariants[variant]} ${className ?? ""}`
      }
    />
  );
}

export function IconButton({label, tone = "default", className, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  tone?: "default" | "danger";
}) {
  const toneClass = tone === "danger"
    ? "text-gray-400 hover:bg-red-50 hover:text-red-600"
    : "text-gray-400 hover:bg-gray-100 hover:text-gray-700";
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      {...props}
      className={`rounded-md p-1.5 cursor-pointer ${toneClass} ${className ?? ""}`}
    />
  );
}

type BadgeTone = "gray" | "green" | "yellow" | "sky" | "purple";

const badgeTones: Record<BadgeTone, string> = {
  gray: "bg-gray-50 text-gray-600 ring-gray-500/10",
  green: "bg-green-50 text-green-700 ring-green-600/20",
  yellow: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
  sky: "bg-brand-50 text-brand-700 ring-brand-700/10",
  purple: "bg-purple-50 text-purple-700 ring-purple-700/10",
};

export function Badge({tone = "gray", children}: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

export function CategoryBadge({category}: { category: Category }) {
  const tone: BadgeTone = category === Category.STUDENT ? "sky" : category === Category.TEACHER ? "purple" : "gray";
  return <Badge tone={tone}>{CATEGORY_LABELS[category] ?? category}</Badge>;
}

// Published/draft status that toggles on click.
export function StatusToggle({ready, onClick}: { ready: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={ready ? "Nhấn để ẩn khỏi website" : "Nhấn để hiển thị trên website"}
      className={
        "inline-flex items-center gap-x-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset cursor-pointer " +
        (ready ? `${badgeTones.green} hover:bg-green-100` : `${badgeTones.gray} hover:bg-gray-100`)
      }
    >
      <svg viewBox="0 0 6 6" aria-hidden="true" className={`size-1.5 ${ready ? "fill-green-500" : "fill-gray-400"}`}>
        <circle r={3} cx={3} cy={3} />
      </svg>
      {ready ? "Đang hiển thị" : "Bản nháp"}
    </button>
  );
}

export function Thumbnail({src, alt}: { src?: string; alt: string }) {
  const [failed, setFailed] = React.useState(false);
  const box = "hidden h-11 w-16 flex-none rounded-md sm:block";
  return src && !failed ? (
    <img src={src} alt={alt} onError={() => setFailed(true)} className={`${box} bg-gray-50 object-cover`} />
  ) : (
    <div title="Chưa có ảnh" className={`${box} bg-gray-100`}>
      <PhotoIcon className="mx-auto mt-3 size-5 text-gray-300" />
    </div>
  );
}

export function EmptyState({icon, title, description, action}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-6 py-16 text-center">
      {icon && <div className="mx-auto size-12 text-gray-400">{icon}</div>}
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function TableSkeleton({rows = 4}: { rows?: number }) {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({length: rows}).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-4">
          <div className="h-11 w-16 rounded-md bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 rounded bg-gray-100" />
            <div className="h-3 w-1/4 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Page heading with optional action buttons on the right.
export function PageHeading({title, description, actions}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl/8 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>
      {actions && <div className="mt-4 flex gap-3 sm:mt-0 sm:ml-4">{actions}</div>}
    </div>
  );
}
