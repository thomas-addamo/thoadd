"use client";

import { useEffect } from "react";

// Un solo punto per le interazioni della pagina, tutte dichiarate con attributi:
// data-reveal / data-words → entrano allo scroll · .spot → luce sotto il cursore
// data-tilt → la card si inclina verso il cursore · data-magnetic → il pulsante lo segue un po'.
export function Interactions() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-in", "");
          observer.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal], [data-words]:not(#hero-title)").forEach((el) => observer.observe(el));

    if (reduce || !fine) return () => observer.disconnect();

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const spot = target?.closest<HTMLElement>(".spot");
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
          spot.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
        const tilt = target?.closest<HTMLElement>("[data-tilt]");
        if (tilt) {
          const r = tilt.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          tilt.style.setProperty("--ry", `${x * 6}deg`);
          tilt.style.setProperty("--rx", `${-y * 6}deg`);
        }
        const magnet = target?.closest<HTMLElement>("[data-magnetic]");
        if (magnet) {
          const r = magnet.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          magnet.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
        }
      });
    };
    const onOut = (e: PointerEvent) => {
      const from = e.target as Element | null;
      const to = e.relatedTarget as Element | null;
      const tilt = from?.closest<HTMLElement>("[data-tilt]");
      if (tilt && !tilt.contains(to)) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }
      const magnet = from?.closest<HTMLElement>("[data-magnetic]");
      if (magnet && !magnet.contains(to)) magnet.style.transform = "";
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return null;
}
