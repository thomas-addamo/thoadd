"use client";

import { useEffect, useRef } from "react";

// L'oggetto di vetro: si inclina piano verso il cursore (fermo con "riduci movimento").
export function Orb() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translate3d(${x * 18}px, ${y * 18}px, 0)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden="true" className="relative flex h-[360px] items-center justify-center md:h-[520px]">
      <div
        ref={ref}
        className="relative flex size-full items-center justify-center transition-transform duration-700 ease-out"
      >
        <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle_at_50%_55%,rgb(143_166_224/0.55),rgb(220_227_247/0.35)_40%,transparent_68%)] blur-[30px]" />
        <div className="absolute size-[340px] rounded-full border border-aura/45 md:size-[470px]" />
        <div
          className="ring absolute size-[320px] rounded-full md:size-[440px]"
          style={{
            transform: "rotateX(64deg)",
            background:
              "conic-gradient(from 30deg, #FFFFFF, #DCE3F7, #8FA6E0, #F6E3DA, #FFFFFF, #B9C6EE, #8FA6E0, #DCE3F7, #FFFFFF)",
            WebkitMask: "radial-gradient(circle, transparent 0 55%, #000 57% 66%, transparent 68%)",
            mask: "radial-gradient(circle, transparent 0 55%, #000 57% 66%, transparent 68%)",
            filter: "drop-shadow(0 10px 20px rgba(61,79,184,0.25))",
          }}
        />
        <div
          className="orb relative size-[220px] rounded-full md:size-[300px]"
          style={{
            background:
              "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.98) 0, rgba(255,255,255,0) 26%), radial-gradient(circle at 72% 80%, rgba(246,227,218,0.95) 0, rgba(246,227,218,0) 42%), radial-gradient(circle at 20% 78%, rgba(143,166,224,0.9) 0, rgba(143,166,224,0) 46%), conic-gradient(from 210deg at 55% 50%, #DCE3F7, #8FA6E0, #C9D3F2, #F6E3DA, #FFFFFF, #B3C1EA, #8FA6E0, #DCE3F7)",
            boxShadow:
              "inset -36px -44px 80px rgba(61,79,184,0.28), inset 28px 32px 60px rgba(255,255,255,0.85), 0 70px 120px -40px rgba(61,79,184,0.5)",
          }}
        />
        <div
          className="absolute right-[22%] bottom-[14%] h-[130px] w-[58px] rounded-full border border-white/90 backdrop-blur-[10px] md:h-[170px] md:w-[76px]"
          style={{
            transform: "rotate(32deg)",
            background: "linear-gradient(160deg, rgba(255,255,255,0.75), rgba(220,227,247,0.25) 45%, rgba(246,227,218,0.45))",
            boxShadow: "0 30px 60px -24px rgba(61,79,184,0.45), inset 0 1px 0 #FFFFFF",
          }}
        />
      </div>
    </div>
  );
}
