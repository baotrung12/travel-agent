"use client";
import { FormEvent, useState } from "react";

export default function AdminLoginForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Email hoặc mật khẩu không đúng");
      }
    } catch {
      setError("Không thể kết nối máy chủ, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8 text-gray-800">
      <div className="flex flex-col items-center mb-6">
        <img src="/logo.png" alt="Du lịch giáo dục" className="h-14 w-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Đăng nhập</h2>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-email">Email</label>
      <input
        id="admin-email"
        type="email"
        required
        autoFocus
        autoComplete="username"
        placeholder="Nhập email"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="admin-password">Mật khẩu</label>
      <input
        id="admin-password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Nhập mật khẩu"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 w-full rounded-lg py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          Hủy
        </button>
      )}
    </form>
  );
}
