import Navbar from "@/app/components/Navbar";

// Shown instantly while a tour detail page loads (used by loading.tsx)
export default function DetailSkeleton() {
  const block = "animate-pulse rounded-lg bg-slate-200";
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-100 pt-16" aria-busy="true" aria-label="Đang tải">
        <div className="bg-white pb-8 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className={`${block} h-4 w-64`} />
            <div className={`${block} mt-5 h-6 w-36`} />
            <div className={`${block} mt-3 h-9 w-3/4 max-w-2xl`} />
            <div className="mt-5 grid gap-2 overflow-hidden rounded-2xl sm:aspect-[16/7] sm:grid-cols-4 sm:grid-rows-2">
              <div className="aspect-[4/3] animate-pulse bg-slate-200 sm:col-span-2 sm:row-span-2 sm:aspect-auto" />
              {[0, 1, 2, 3].map((i) => <div key={i} className="hidden animate-pulse bg-slate-200 sm:block" />)}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-x-8 gap-y-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className={`${block} h-5 w-40`} />
                <div className={`${block} h-4 w-full`} />
                <div className={`${block} h-4 w-5/6`} />
                <div className={`${block} h-4 w-2/3`} />
              </div>
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-xl bg-white shadow-sm ring-1 ring-slate-200" />
        </div>
      </main>
    </>
  );
}
