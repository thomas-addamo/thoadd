"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <nav aria-label="Sezioni del pannello">
      <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 md:flex-col">
        {items.map((item) => {
          const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
          return (
            <li key={item.href} className="flex-none">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] no-underline transition ${
                  active ? "bg-white font-medium text-ink shadow-[0_4px_12px_-6px_rgb(61_79_184/0.4)]" : "text-slate hover:bg-white/60 hover:text-ink"
                }`}
              >
                {active && <span aria-hidden="true" className="size-1.5 rounded-full bg-iris" />}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
