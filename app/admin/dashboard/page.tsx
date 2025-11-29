// app/admin/dashboard/page.tsx
"use client";

import { useState } from "react";
import {ManageTours} from "@/app/components/ManageTours";
import AddTourForm from "@/app/components/AddTourForm";
import AddPastTourForm from "@/app/components/AddPastTourForm";
import AdminPastTours from "@/app/components/AdminPastTours";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("manage");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-blue-700">Du Lịch Giáo Dục</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab("add")} className="block w-full text-left text-blue-600 hover:underline">
            Thêm tour mới
          </button>
          <button onClick={() => setActiveTab("add_past")} className="block w-full text-left text-blue-600 hover:underline">
            Thêm tour đã tổ chức
          </button>
          <button onClick={() => setActiveTab("manage")} className="block w-full text-left text-blue-600 hover:underline">
            Quản lý tour hiện tại
          </button>
          <button onClick={() => setActiveTab("past")} className="block w-full text-left text-blue-600 hover:underline">
            Quản lý tour đã tổ chức
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6">
        {activeTab === "add" && <AddTourForm />}
        {activeTab === "add_past" && <AddPastTourForm />}
        {activeTab === "manage" && <ManageTours title="Tour hiện tại" />}
        {activeTab === "past" && <AdminPastTours />}
      </main>
    </div>
  );
}
