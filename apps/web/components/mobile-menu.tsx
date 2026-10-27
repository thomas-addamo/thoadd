"use client";

import { useEffect, useState } from "react";

type Item = { href: string; label: string };

export function MobileMenu({ items, openLabel, closeLabel }: { items: Item[]; openLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="only-m">
      <button
        type="button"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="grid size-11 place-items-center rounded-full text-ink"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M5 5l12 12M17 5 5 17" /> : <path d="M4 8h14M4 14h14" />}
        </svg>
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label={openLabel}
          className="absolute inset-x-4 top-[72px] rounded-[var(--radius-card)] border border-white/90 bg-white/90 p-4 shadow-[var(--shadow-lift)] backdrop-blur-xl"
        >
          <ul className="m-0 flex list-none flex-col p-0">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display flex min-h-12 items-center border-b border-haze px-2 text-[20px] text-ink no-underline last:border-0"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
