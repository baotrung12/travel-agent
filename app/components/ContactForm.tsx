"use client";

export default function ContactForm() {
  return (
    <section className="py-16 bg-white" id="contactUs">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Liên Hệ Với Chúng Tôi</h2>
        <form className="bg-white shadow-md rounded-lg p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-2">Họ và Tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 mb-2">Nội dung</label>
            <textarea
              rows={5}
              placeholder="Nhập nội dung tin nhắn"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Gửi Liên Hệ
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
