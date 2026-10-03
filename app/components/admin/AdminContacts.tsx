"use client";
import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {EnvelopeIcon, InboxIcon, PhoneIcon, TrashIcon} from "@heroicons/react/24/outline";
import ConfirmDialog from "@/app/components/admin/ConfirmDialog";
import {Badge, EmptyState, IconButton, PageHeading, TableSkeleton} from "@/app/components/admin/ui";

type Status = "NEW" | "CONTACTED" | "DONE";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string | null;
  tourTitle: string | null;
  status: Status;
  emailSent: boolean;
  createdAt: string;
}

const STATUS_LABELS: Record<Status, string> = {NEW: "Mới", CONTACTED: "Đã liên hệ", DONE: "Hoàn tất"};
const STATUS_TONES: Record<Status, "yellow" | "sky" | "green"> = {NEW: "yellow", CONTACTED: "sky", DONE: "green"};

export default function AdminContacts({onCountChange}: { onCountChange?: (newCount: number) => void }) {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [filter, setFilter] = useState<Status | "">("");
  const [deleting, setDeleting] = useState<Contact | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setContacts)
      .catch(() => {
        toast.error("Không tải được danh sách liên hệ");
        setContacts([]);
      });
  }, []);

  useEffect(() => {
    if (contacts) onCountChange?.(contacts.filter((c) => c.status === "NEW").length);
  }, [contacts, onCountChange]);

  const filtered = useMemo(() => (contacts ?? []).filter((c) => !filter || c.status === filter), [contacts, filter]);
  const counts = useMemo(() => {
    const result: Record<string, number> = {"": contacts?.length ?? 0};
    for (const c of contacts ?? []) result[c.status] = (result[c.status] ?? 0) + 1;
    return result;
  }, [contacts]);

  const updateStatus = async (contact: Contact, status: Status) => {
    const previous = contact.status;
    setContacts((prev) => prev?.map((c) => (c.id === contact.id ? {...c, status} : c)) ?? null);
    const res = await fetch(`/api/admin/contacts/${contact.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({status}),
    });
    if (!res.ok) {
      setContacts((prev) => prev?.map((c) => (c.id === contact.id ? {...c, status: previous} : c)) ?? null);
      toast.error("Không cập nhật được trạng thái");
    }
  };

  const deleteContact = async () => {
    if (!deleting) return;
    setBusy(true);
    const res = await fetch(`/api/admin/contacts/${deleting.id}`, {method: "DELETE"});
    setBusy(false);
    if (res.ok) {
      setContacts((prev) => prev?.filter((c) => c.id !== deleting.id) ?? null);
      toast.success("Đã xoá liên hệ");
      setDeleting(null);
    } else {
      toast.error("Không xoá được liên hệ");
    }
  };

  const tabs: { value: Status | ""; label: string }[] = [
    {value: "", label: "Tất cả"},
    {value: "NEW", label: STATUS_LABELS.NEW},
    {value: "CONTACTED", label: STATUS_LABELS.CONTACTED},
    {value: "DONE", label: STATUS_LABELS.DONE},
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Liên hệ"
        description={contacts ? `${counts.NEW ?? 0} yêu cầu mới chưa xử lý` : "Đang tải..."}
      />

      <div className="overflow-hidden bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl">
        <nav className="flex gap-x-6 overflow-x-auto border-b border-gray-200 px-4 sm:px-6" aria-label="Lọc theo trạng thái">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={
                "border-b-2 py-4 text-sm font-medium whitespace-nowrap cursor-pointer " +
                (filter === tab.value ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700")
              }
            >
              {tab.label}
              <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${filter === tab.value ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-600"}`}>
                {counts[tab.value] ?? 0}
              </span>
            </button>
          ))}
        </nav>

        {contacts === null ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<InboxIcon />}
            title={contacts.length === 0 ? "Chưa có liên hệ nào" : "Không có liên hệ trong mục này"}
            description="Yêu cầu từ form liên hệ trên website sẽ hiển thị tại đây."
          />
        ) : (
          <ul role="list" className="divide-y divide-gray-100">
            {filtered.map((contact) => (
              <li key={contact.id} className={`px-4 py-5 sm:px-6 ${contact.status === "NEW" ? "bg-brand-50/40" : ""}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <Badge tone={STATUS_TONES[contact.status]}>{STATUS_LABELS[contact.status]}</Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(contact.createdAt).toLocaleString("vi-VN", {dateStyle: "short", timeStyle: "short"})}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                      <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-x-1.5 font-medium text-brand-700 hover:text-brand-600">
                        <PhoneIcon className="size-4" />{contact.phone}
                      </a>
                      <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-x-1.5 text-gray-600 hover:text-brand-700">
                        <EnvelopeIcon className="size-4" />{contact.email}
                      </a>
                    </div>
                    {contact.tourTitle && (
                      <p className="mt-2 text-sm text-gray-700"><span className="text-gray-500">Tour quan tâm:</span> {contact.tourTitle}</p>
                    )}
                    {contact.message && <p className="mt-2 text-sm/6 whitespace-pre-line text-gray-600">{contact.message}</p>}
                    {!contact.emailSent && (
                      <p className="mt-2 text-xs text-amber-700">Chưa gửi email thông báo (kiểm tra cấu hình SMTP)</p>
                    )}
                  </div>

                  <div className="flex items-center gap-x-2">
                    <select
                      value={contact.status}
                      onChange={(e) => updateStatus(contact, e.target.value as Status)}
                      aria-label="Trạng thái"
                      className="rounded-md bg-white py-1.5 pr-8 pl-3 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-brand-600"
                    >
                      {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                    <IconButton label="Xoá" tone="danger" onClick={() => setDeleting(contact)}>
                      <TrashIcon className="size-5" />
                    </IconButton>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {deleting && (
        <ConfirmDialog
          title="Xoá liên hệ?"
          message={<>Yêu cầu của <strong className="text-gray-900">{deleting.name}</strong> sẽ bị xoá vĩnh viễn.</>}
          confirmLabel="Xoá"
          busy={busy}
          onConfirm={deleteContact}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
