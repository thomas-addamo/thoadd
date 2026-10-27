"use client";

import { useEffect, useRef } from "react";
import { ui, type Lang } from "@/lib/i18n";

export const INTRO_KEY = "thoadd-intro";

// Gira prima del primo disegno: se l'apertura è già stata vista, non compare nemmeno per un istante.
export const introScript = `try{if(localStorage.getItem("${INTRO_KEY}"))document.documentElement.classList.add("intro-seen")}catch(e){}`;

export function Intro({ lang, name }: { lang: Lang; name: string }) {
  const t = ui[lang];
  const ref = useRef<HTMLDivElement>(null);
  const [first, ...rest] = name.split(" ");

  const done = () => {
    ref.current?.classList.add("is-done");
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {}
  };

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) return;
    const timer = setTimeout(done, 3000);
    const onKey = () => done();
    window.addEventListener("keydown", onKey, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="intro fixed inset-0 z-50 overflow-hidden"
      onClick={done}
      style={{
        background:
          "radial-gradient(50% 50% at 100% 0%, rgba(246,227,218,0.7), transparent 70%), linear-gradient(180deg, #FFFFFF, #F4F6FB 60%, #E9EDF9)",
      }}
    >
      <div
        aria-hidden="true"
        className="a-halo absolute top-1/2 left-1/2 -mt-[550px] -ml-[550px] size-[1100px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(143,166,224,0.55) 0, rgba(220,227,247,0.5) 34%, rgba(246,227,218,0.25) 52%, transparent 68%)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <p className="a-name display m-0 text-[clamp(56px,9vw,128px)] leading-none font-light tracking-[-0.03em]">
          {first} <em className="accent text-iris">{rest.join(" ")}</em>
        </p>
        <p className="a-sub mt-6 mb-0 text-[17px] text-slate">Software Developer</p>
      </div>
      <button
        type="button"
        onClick={done}
        className="ghost absolute right-6 bottom-6 h-11 bg-white/60 px-5 text-[15px] md:right-10 md:bottom-10"
      >
        {t.skipIntro} <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
