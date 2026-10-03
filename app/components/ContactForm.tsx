"use client";

import {FormEvent, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {CheckCircleIcon, ClockIcon, EnvelopeIcon, PhoneIcon} from "@heroicons/react/24/outline";
import SectionHeading from "@/app/components/SectionHeading";

const inputClass =
  "block w-full rounded-lg bg-white px-3.5 py-2.5 text-base text-slate-900 outline-1 -outline-offset-1 outline-slate-300 " +
  "placeholder:text-slate-400 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-600 sm:text-sm/6";
const errorInputClass = "outline-red-400 focus:outline-red-500";

type FieldErrors = Partial<Record<"name" | "phone" | "email", string>>;

function Field({id, label, required, error, children}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm/6 font-semibold text-slate-900">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({name: "", phone: "", email: "", tourTitle: "", message: "", website: ""});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Prefill from the tour page's booking button (/?tour=...&message=...#contactUs)
  useEffect(() => {
    const tour = searchParams.get("tour");
    const message = searchParams.get("message");
    if (tour || message) {
      setForm((prev) => ({...prev, tourTitle: tour ?? prev.tourTitle, message: message ?? prev.message}));
    }
  }, [searchParams]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({...prev, [key]: e.target.value}));
    if (key in errors) setErrors((prev) => ({...prev, [key]: undefined}));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSending(true);
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSent(true);
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setFormError(data.error || "Không gửi được, vui lòng thử lại.");
      }
    } catch {
      setFormError("Không thể kết nối máy chủ, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="scroll-mt-16 bg-slate-50 py-20" id="contactUs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Liên hệ"
          title="Liên hệ với chúng tôi"
          subtitle="Để lại thông tin, đội ngũ tư vấn sẽ liên hệ lại với bạn trong thời gian sớm nhất."
        />

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:grid-cols-5">
          {/* Info panel */}
          <div className="bg-brand-950 p-8 text-white lg:col-span-2 sm:p-10">
            <h3 className="text-xl font-bold">Tư vấn miễn phí</h3>
            <p className="mt-3 text-sm/6 text-brand-100">
              Chúng tôi giúp nhà trường lên lịch trình phù hợp với độ tuổi, số lượng học sinh và ngân sách.
            </p>
            <ul className="mt-8 space-y-5 !list-none !pl-0 text-sm">
              <li className="flex gap-x-3">
                <ClockIcon className="size-6 flex-none text-brand-300" />
                <span><span className="block font-semibold">Phản hồi nhanh</span><span className="text-brand-200">Liên hệ lại trong giờ làm việc</span></span>
              </li>
              <li className="flex gap-x-3">
                <PhoneIcon className="size-6 flex-none text-brand-300" />
                <span><span className="block font-semibold">Gọi lại tận nơi</span><span className="text-brand-200">Tư vấn qua điện thoại hoặc Zalo</span></span>
              </li>
              <li className="flex gap-x-3">
                <EnvelopeIcon className="size-6 flex-none text-brand-300" />
                <span><span className="block font-semibold">Báo giá chi tiết</span><span className="text-brand-200">Gửi lịch trình và báo giá qua email</span></span>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="p-6 lg:col-span-3 sm:p-10">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <CheckCircleIcon className="size-14 text-green-600" />
                <h3 className="mt-4 text-xl font-bold text-brand-950">Đã gửi thành công!</h3>
                <p className="mt-2 max-w-sm text-sm/6 text-slate-600">
                  Cảm ơn {form.name}. Chúng tôi sẽ liên hệ với bạn qua số {form.phone} trong thời gian sớm nhất.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({name: "", phone: "", email: "", tourTitle: "", message: "", website: ""}); }}
                  className="mt-6 text-sm font-semibold text-brand-700 hover:text-brand-600 cursor-pointer"
                >
                  Gửi yêu cầu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <Field id="contact-name" label="Họ và tên" required error={errors.name}>
                  <input id="contact-name" type="text" autoComplete="name" required placeholder="Nguyễn Văn A"
                         value={form.name} onChange={set("name")}
                         className={`${inputClass} ${errors.name ? errorInputClass : ""}`} />
                </Field>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field id="contact-phone" label="Số điện thoại" required error={errors.phone}>
                    <input id="contact-phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="0901 234 567"
                           value={form.phone} onChange={set("phone")}
                           className={`${inputClass} ${errors.phone ? errorInputClass : ""}`} />
                  </Field>
                  <Field id="contact-email" label="Email" required error={errors.email}>
                    <input id="contact-email" type="email" autoComplete="email" required placeholder="ban@example.com"
                           value={form.email} onChange={set("email")}
                           className={`${inputClass} ${errors.email ? errorInputClass : ""}`} />
                  </Field>
                </div>

                <Field id="contact-tour" label="Tour quan tâm">
                  <input id="contact-tour" type="text" placeholder="VD: Tour Vũng Tàu 2 ngày 1 đêm"
                         value={form.tourTitle} onChange={set("tourTitle")} className={inputClass} />
                </Field>

                <Field id="contact-message" label="Nội dung">
                  <textarea id="contact-message" rows={4}
                            placeholder="Số lượng khách, thời gian dự kiến, yêu cầu đặc biệt..."
                            value={form.message} onChange={set("message")} className={inputClass} />
                </Field>

                {/* Honeypot for bots — hidden from people and screen readers */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                       value={form.website} onChange={set("website")} className="hidden" />

                {formError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">Thông tin của bạn chỉ dùng để tư vấn tour.</p>
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60 cursor-pointer"
                  >
                    {sending ? "Đang gửi..." : "Gửi liên hệ"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
