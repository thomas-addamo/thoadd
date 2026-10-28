"use client";

import { useEffect, useState } from "react";

// In basso a destra: compare dopo la prima schermata, sparisce quando si vede il footer.
// L'anello si riempie man mano che si scorre la pagina.
export function ScrollTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
        setVisible(window.scrollY > window.innerHeight * 0.8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footer = document.querySelector("footer");
    const observer = new IntersectionObserver(([e]) => setFooterInView(e.isIntersecting), { threshold: 0.05 });
    if (footer) observer.observe(footer);
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const shown = visible && !footerInView;
  const r = 26.5;
  const c = 2 * Math.PI * r;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-full bg-glass text-ink shadow-[var(--shadow-sheet)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-pill)] md:right-8 md:bottom-8 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* L'anello riempie esattamente il pulsante; la rotazione è dentro l'SVG, così Safari non lo sposta. */}
      <svg viewBox="0 0 56 56" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
        <g transform="rotate(-90 28 28)">
          <circle cx="28" cy="28" r={r} fill="none" stroke="var(--color-haze)" strokeWidth="1.5" />
          <circle cx="28" cy="28" r={r} fill="none" stroke="var(--color-iris)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} />
        </g>
      </svg>
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="relative transition-transform duration-500 group-hover:-translate-y-0.5">
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
      </svg>
    </button>
  );
}
