// app/admin/dashboard/page.tsx
"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
  ArchiveBoxIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  InboxIcon,
  TicketIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {logoutAdmin} from "@/app/services/adminAuth";
import {ManageTours} from "@/app/components/ManageTours";
import AddTourForm from "@/app/components/AddTourForm";
import AddPastTourForm from "@/app/components/AddPastTourForm";
import AdminPastTours from "@/app/components/AdminPastTours";
import AdminContacts from "@/app/components/admin/AdminContacts";

type Section = "tours" | "past" | "contacts";
type View = "list" | "new";

const navigation: { id: Section; name: string; icon: typeof TicketIcon }[] = [
  {id: "tours", name: "Tour đang bán", icon: TicketIcon},
  {id: "past", name: "Tour đã tổ chức", icon: ArchiveBoxIcon},
  {id: "contacts", name: "Liên hệ", icon: InboxIcon},
];

export default function AdminDashboard() {
  const [section, setSection] = useState<Section>("tours");
  const [view, setView] = useState<View>("list");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newContacts, setNewContacts] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((res) => (res.ok ? res.json() : []))
      .then((list: { status: string }[]) => setNewContacts(list.filter((c) => c.status === "NEW").length))
      .catch(() => {});
  }, []);
  const navigate = (next: Section, nextView: View = "list") => {
    setSection(next);
    setView(nextView);
    setSidebarOpen(false);
    window.scrollTo({top: 0});
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/");
  };

  const sidebar = (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center gap-x-3">
        <div className="rounded-md bg-white px-2 py-1">
          <img src="/logo.png" alt="Du lịch giáo dục" className="h-7 w-auto" />
        </div>
        <span className="text-sm font-semibold text-white">Quản trị</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const current = item.id === section;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => navigate(item.id)}
                      className={
                        "group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer " +
                        (current ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")
                      }
                    >
                      <item.icon className="size-6 shrink-0" />
                      {item.name}
                      {item.id === "contacts" && newContacts > 0 && (
                        <span className="ml-auto rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">{newContacts}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              <li>
                <Link
                  href="/"
                  target="_blank"
                  className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  <ArrowTopRightOnSquareIcon className="size-6 shrink-0" />
                  Xem website
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white cursor-pointer"
                >
                  <ArrowLeftStartOnRectangleIcon className="size-6 shrink-0" />
                  Đăng xuất
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-0 flex pointer-events-none">
            <div className="relative mr-16 flex w-full max-w-xs flex-1 pointer-events-auto">
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5 cursor-pointer" aria-label="Đóng menu">
                  <XMarkIcon className="size-6 text-white" />
                </button>
              </div>
              {sidebar}
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">{sidebar}</div>

      <div className="lg:pl-72">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 cursor-pointer" aria-label="Mở menu">
            <Bars3Icon className="size-6" />
          </button>
          <span className="text-sm font-semibold text-gray-900">
            {navigation.find((item) => item.id === section)?.name}
          </span>
        </div>

        <main className="py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {section === "tours" && view === "list" && <ManageTours onAdd={() => navigate("tours", "new")} />}
            {section === "tours" && view === "new" && (
              <AddTourForm onSaved={() => navigate("tours")} onCancel={() => navigate("tours")} />
            )}
            {section === "past" && view === "list" && <AdminPastTours onAdd={() => navigate("past", "new")} />}
            {section === "contacts" && <AdminContacts onCountChange={setNewContacts} />}
            {section === "past" && view === "new" && (
              <AddPastTourForm onSaved={() => navigate("past")} onCancel={() => navigate("past")} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
