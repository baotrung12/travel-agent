"use client";
import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {ArchiveBoxIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, TrashIcon} from "@heroicons/react/24/outline";
import Modal from "./Modal";
import EditPastTourForm from "./EditPastTourForm";
import ConfirmDialog from "@/app/components/admin/ConfirmDialog";
import {
  Button,
  CATEGORY_LABELS,
  CategoryBadge,
  EmptyState,
  IconButton,
  Input,
  PageHeading,
  Select,
  StatusToggle,
  TableSkeleton,
  Thumbnail,
} from "@/app/components/admin/ui";

function formatDateRange(start?: string | null, end?: string | null) {
  const fmt = (d: string) => new Date(d).toLocaleDateString("vi-VN");
  if (!start && !end) return "—";
  if (!end || start === end) return fmt((start ?? end)!);
  if (!start) return fmt(end);
  return `${fmt(start)} – ${fmt(end)}`;
}

export default function AdminPastTours({onAdd}: { onAdd: () => void }) {
  const [tours, setTours] = useState<any[] | null>(null);
  const [editingTour, setEditingTour] = useState<any | null>(null);
  const [deletingTour, setDeletingTour] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const fetchTours = async () => {
    try {
      const res = await fetch("/api/admin/past-tours");
      setTours(await res.json());
    } catch {
      toast.error("Không tải được danh sách tour");
      setTours([]);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (tours ?? []).filter((tour) =>
      (!category || tour.category === category) &&
      (!q || [tour.title, tour.tourCode, tour.destination].some((v: string | null) => v?.toLowerCase().includes(q)))
    );
  }, [tours, query, category]);

  const toggleReady = async (tour: any) => {
    const ready = !tour.ready;
    setTours((prev) => prev?.map((t) => (t.id === tour.id ? {...t, ready} : t)) ?? null);
    const res = await fetch(`/api/admin/past-tours/${tour.id}/ready`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ready}),
    });
    if (res.ok) {
      toast.success(ready ? "Tour đã hiển thị trên website" : "Tour đã chuyển về bản nháp");
    } else {
      setTours((prev) => prev?.map((t) => (t.id === tour.id ? {...t, ready: !ready} : t)) ?? null);
      toast.error("Không cập nhật được trạng thái");
    }
  };

  const deleteTour = async () => {
    if (!deletingTour) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/past-tours/${deletingTour.id}`, {method: "DELETE"});
    setDeleting(false);
    if (res.ok) {
      setTours((prev) => prev?.filter((t) => t.id !== deletingTour.id) ?? null);
      toast.success("Đã xoá tour");
      setDeletingTour(null);
    } else {
      toast.error("Không xoá được tour");
    }
  };

  const publishedCount = tours?.filter((t) => t.ready).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Tour đã tổ chức"
        description={tours ? `${tours.length} tour · ${publishedCount} đang hiển thị trên website` : "Đang tải..."}
        actions={
          <Button onClick={onAdd}>
            <PlusIcon className="-ml-0.5 size-5" />
            Thêm tour đã tổ chức
          </Button>
        }
      />

      <div className="overflow-hidden bg-white shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm theo tên, mã tour, điểm đến..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
            <option value="">Tất cả loại tour</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
        </div>

        {tours === null ? (
          <TableSkeleton />
        ) : filtered.length === 0 ? (
          tours.length === 0 ? (
            <EmptyState
              icon={<ArchiveBoxIcon />}
              title="Chưa có tour đã tổ chức"
              description="Lưu lại các chuyến đi đã tổ chức để giới thiệu trên website."
              action={<Button onClick={onAdd}><PlusIcon className="-ml-0.5 size-5" />Thêm tour đã tổ chức</Button>}
            />
          ) : (
            <EmptyState title="Không tìm thấy tour phù hợp" description="Thử từ khoá hoặc bộ lọc khác." />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold whitespace-nowrap text-gray-900 sm:pl-6">Tour</th>
                  <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900 md:table-cell">Loại tour</th>
                  <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900 lg:table-cell">Ngày tổ chức</th>
                  <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900 lg:table-cell">Số khách</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900">Trạng thái</th>
                  <th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-6"><span className="sr-only">Thao tác</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50">
                    <td className="py-4 pr-3 pl-4 text-sm sm:pl-6">
                      <div className="flex items-center gap-x-4">
                        <Thumbnail src={tour.tourImages?.[0]} alt={tour.title} />
                        <div className="min-w-0">
                          <button
                            onClick={() => setEditingTour(tour)}
                            className="line-clamp-2 text-left font-medium text-gray-900 hover:text-brand-700 cursor-pointer"
                          >
                            {tour.title}
                          </button>
                          <div className="mt-1 line-clamp-1 text-gray-500">
                            {tour.tourCode}
                            {tour.destination && <> · {tour.destination}</>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-sm md:table-cell"><CategoryBadge category={tour.category} /></td>
                    <td className="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 lg:table-cell">
                      {formatDateRange(tour.departureStart, tour.departureEnd)}
                    </td>
                    <td className="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 lg:table-cell">{tour.participants || "—"}</td>
                    <td className="px-3 py-4 text-sm"><StatusToggle ready={tour.ready} onClick={() => toggleReady(tour)} /></td>
                    <td className="py-4 pr-4 pl-3 text-right whitespace-nowrap sm:pr-6">
                      <IconButton label="Sửa" onClick={() => setEditingTour(tour)}>
                        <PencilSquareIcon className="size-5" />
                      </IconButton>
                      <IconButton label="Xoá" tone="danger" onClick={() => setDeletingTour(tour)}>
                        <TrashIcon className="size-5" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingTour && (
        <Modal
          title="Cập nhật tour đã tổ chức"
          description={editingTour.title}
          formId="editPastTourForm"
          saving={saving}
          onClose={() => setEditingTour(null)}
        >
          <EditPastTourForm
            tourId={editingTour.id}
            onSavingChange={setSaving}
            onSaved={() => { setEditingTour(null); fetchTours(); }}
          />
        </Modal>
      )}

      {deletingTour && (
        <ConfirmDialog
          title="Xoá tour đã tổ chức?"
          message={<>Tour <strong className="text-gray-900">{deletingTour.title}</strong>, lịch trình và danh sách ảnh sẽ bị xoá vĩnh viễn. Không thể hoàn tác.</>}
          confirmLabel="Xoá tour"
          busy={deleting}
          onConfirm={deleteTour}
          onCancel={() => setDeletingTour(null)}
        />
      )}
    </div>
  );
}
