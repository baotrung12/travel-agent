"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-gray-600 mb-6">
      <ol className="flex flex-wrap gap-2 items-center">
        <li>
          <Link href="/" className="text-blue-600 hover:underline">Trang chủ</Link>
        </li>
        {segments.map((segment, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const label = decodeURIComponent(segment).replace(/-/g, " ");

          return (
            <li key={i} className="flex items-center gap-2">
              <span>/</span>
              <Link href={href} className="text-blue-600 hover:underline capitalize">
                {label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
