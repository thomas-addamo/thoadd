"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Item = { href: string; label: string; active?: boolean };

// Menu del telefono a tutto schermo, con lo stesso cielo dell'apertura:
// le voci salgono una alla volta dalla sfocatura, l'hamburger diventa una X.
export function MobileMenu({
  items,
  openLabel,
  closeLabel,
  footer,
}: {
  items: Item[];
  openLabel: string;
  closeLabel: string;
  footer?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="only-m">
      <button
        ref={button}
        type="button"
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="relative grid size-11 place-items-center rounded-full text-ink"
      >
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
      </button>

      {mounted &&
        createPortal(
      <div
        ref={panel}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={openLabel}
        data-open={open ? "" : undefined}
        inert={!open}
        className="mobile-menu fixed inset-0 z-[35] flex flex-col overflow-y-auto px-6 pt-28 pb-8"
      >
        <nav aria-label={openLabel}>
          <ol className="m-0 flex list-none flex-col p-0">
            {items.map((item, i) => (
              <li key={item.href} className="mm-item border-b border-haze" style={{ "--i": i } as React.CSSProperties}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={item.active ? "true" : undefined}
                  className="group flex min-h-[72px] items-baseline gap-4 text-ink no-underline"
                >
                  <span className="label w-6 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="display text-[clamp(36px,11vw,52px)] leading-none font-light tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2 group-aria-[current=true]:text-iris">
                    {item.label}
                  </span>
                  {item.active && <span aria-hidden="true" className="ml-auto size-2 self-center rounded-full bg-iris" />}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {footer && (
          <div className="mm-item mt-auto flex flex-wrap items-center gap-3 pt-10" style={{ "--i": items.length } as React.CSSProperties}>
            {footer}
          </div>
        )}
        <p
          aria-hidden="true"
          className="mm-item wordmark display pointer-events-none absolute inset-x-0 bottom-[-0.2em] m-0 text-center text-[42vw] leading-none font-light tracking-[-0.05em] [mask-image:linear-gradient(180deg,#000_20%,transparent_90%)]"
          style={{ "--i": items.length + 1 } as React.CSSProperties}
        >
          thoadd
        </p>
      </div>,
          document.body,
        )}
    </div>
  );
}
