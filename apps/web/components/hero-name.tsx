"use client";

import { useEffect, useRef } from "react";

// Il nome dell'hero: le lettere entrano una alla volta a fine apertura e
// si sollevano vicino al cursore; dietro, un alone pervinca segue il mouse.
export function HeroName({ first, last }: { first: string; last: string }) {
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h1 = title.current;
    if (!h1) return;
    const show = () => h1.setAttribute("data-in", "");
    window.addEventListener("intro-done", show, { once: true });
    const fallback = setTimeout(show, 2600);

    const section = h1.closest("section");
    const letters = [...h1.querySelectorAll<HTMLElement>(".hero-letter")];
    const fine = matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (section) {
          const r = section.getBoundingClientRect();
          section.style.setProperty("--hx", `${e.clientX - r.left}px`);
          section.style.setProperty("--hy", `${e.clientY - r.top}px`);
        }
        for (const el of letters) {
          const r = el.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          el.style.setProperty("--p", Math.max(0, 1 - d / 240).toFixed(3));
        }
      });
    };
    const onLeave = () => letters.forEach((el) => el.style.setProperty("--p", "0"));
    if (fine && section) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }
    return () => {
      clearTimeout(fallback);
      window.removeEventListener("intro-done", show);
      section?.removeEventListener("pointermove", onMove);
      section?.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  let i = 0;
  const word = (text: string, accent: boolean) => (
    <span className={`inline-block whitespace-nowrap ${accent ? "accent text-iris" : ""}`}>
      {[...text].map((ch, k) => (
        <span key={k} className="w" style={{ "--i": i++ } as React.CSSProperties}>
          <span className="hero-letter">{ch}</span>
        </span>
      ))}
    </span>
  );

  return (
    <h1 ref={title} id="hero-title" data-words className="title-hero m-0" aria-label={`${first} ${last}`}>
      <span aria-hidden="true">
        {word(first, false)} {word(last, true)}
      </span>
    </h1>
  );
}
