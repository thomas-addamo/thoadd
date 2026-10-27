"use client";

import { useEffect, useRef } from "react";
import { ui, type Lang } from "@/lib/i18n";


const letters = ["t", "h", "o", "a", "d", "d"];

export function Intro({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);

  // Il marchio vola verso il logo della navbar (FLIP) mentre il cielo si dissolve.
  const leave = (fast = false) => {
    if (leaving.current) return;
    leaving.current = true;
    const el = root.current;
    const group = mark.current;
    const logo = document.querySelector("#site-logo svg");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce || fast ? 250 : document.documentElement.classList.contains("intro-short") ? 420 : 700;

    if (group && logo && !reduce) {
      const from = group.getBoundingClientRect();
      const to = logo.getBoundingClientRect();
      const scale = to.height / from.height;
      const dx = to.left - from.left;
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      group.animate(
        [{ transform: "none", opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0 }],
        { duration, easing: "cubic-bezier(0.65, 0, 0.35, 1)", fill: "forwards" },
      );
    }
    el?.classList.add("is-leaving");
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("intro-done"));
    setTimeout(() => el?.classList.add("is-done"), duration + 50);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const short = document.documentElement.classList.contains("intro-short");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => leave(), reduce ? 200 : short ? 650 : 1900);
    const skip = () => leave(true);
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={root} className="intro" onClick={() => leave(true)} role="presentation">
      <div aria-hidden="true" className="halo" />
      <div ref={mark} aria-hidden="true" className="relative flex items-center gap-[0.18em] text-[clamp(64px,13vw,184px)] text-ink">
        <svg className="mono h-[0.82em] w-[0.82em]" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
          <path pathLength={1} d="M13 27 L21 5 L29 27" />
          <path pathLength={1} d="M3 13 H23.9" />
          <path pathLength={1} d="M10.5 13 V27" />
        </svg>
        <span className="display leading-none font-light tracking-[-0.05em]">
          {letters.map((ch, i) => (
            <span key={i} className={`ch ${i === letters.length - 1 ? "echo" : ""}`} style={{ "--i": i } as React.CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          leave(true);
        }}
        className="ghost absolute right-6 bottom-6 h-11 px-5 text-[15px] md:right-10 md:bottom-10"
      >
        {t.skipIntro} <span aria-hidden="true" className="arrow">→</span>
      </button>
    </div>
  );
}
