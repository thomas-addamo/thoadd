"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Monogram } from "@thoadd/ui/monogram";
import { ThemeToggle } from "@thoadd/ui/theme";
import type { Content } from "@thoadd/db/content";
import { homePath, ui, type Lang } from "@/lib/i18n";
import { DownloadCv } from "./download-cv";
import { MobileMenu } from "./mobile-menu";

const ids = ["profilo", "percorso", "progetti", "studi", "contatti"] as const;

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function Header({ lang, cv, github, onHome = true }: { lang: Lang; cv: Content["cv"]; github: string; onHome?: boolean }) {
  const t = ui[lang];
  const path = usePathname();
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Si stringe dopo i primi 24 px; scendendo si nasconde, risalendo ricompare.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setCompact(y > 24);
        if (y < 480 || y < last - 4) setHidden(false);
        else if (y > last + 4) setHidden(true);
        last = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Il pallino segue la sezione al centro dello schermo.
  useEffect(() => {
    if (!onHome) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  const home = homePath(lang);
  const items = ids.map((id) => ({ id, href: onHome ? `#${id}` : `${home}#${id}`, label: t.nav[id] }));
  const other = lang === "en" ? "it" : "en";
  const otherPath = lang === "en" ? path.replace(/^\/en/, "") || "/" : `/en${path === "/" ? "" : path}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${hidden ? "-translate-y-[120%]" : ""}`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-4 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          compact
            ? "mt-3 h-16 max-w-[1180px] rounded-full border border-haze bg-glass pr-2 pl-5 shadow-[var(--shadow-sheet)] backdrop-blur-[18px] max-md:mx-3"
            : "mt-0 h-[72px] max-w-[1440px] border border-transparent px-[clamp(16px,5.6vw,80px)]"
        }`}
      >
        <Link id="site-logo" href={home} aria-label={t.home} className="flex min-h-11 items-center gap-3 text-ink no-underline">
          <Monogram size={30} />
          <span className="display hide-m text-[17px] tracking-[0.01em] whitespace-nowrap">Thomas Addamo</span>
        </Link>

        <nav aria-label={t.sections} className="hide-m flex gap-7">
          {items.map((item) => (
            <a key={item.id} className="navlink flex items-center gap-2" href={item.href} aria-current={active === item.id ? "true" : undefined}>
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full bg-iris transition-all duration-500 ${active === item.id ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
              />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Raggi annidati: capsula alta 64 con 8 di margine → pillole alte 48, raggio pieno. */}
        <div className="flex items-center gap-1 md:gap-2">
          <a
            href={github}
            target="_blank"
            rel="me noopener"
            aria-label={t.github}
            title="GitHub"
            className="hide-m grid size-10 place-items-center rounded-full text-ink transition hover:bg-glass"
          >
            <GitHubIcon />
          </a>
          <ThemeToggle labels={{ toDark: t.toDark, toLight: t.toLight }} />
          <Link
            href={otherPath}
            hrefLang={other}
            aria-label={`${t.language}: ${other.toUpperCase()}`}
            className="grid h-10 min-w-11 place-items-center rounded-full border border-haze text-[13px] font-medium text-ink no-underline transition hover:border-haze-strong"
          >
            {other.toUpperCase()}
          </Link>
          <DownloadCv cv={cv} lang={lang} label={t.downloadCv} className="ml-1 h-12 gap-2 px-4 text-[15px] md:px-5" iconSize={16} compact />
          <MobileMenu
            items={items.map(({ id, href, label }) => ({ href, label, active: active === id }))}
            openLabel={t.openMenu}
            closeLabel={t.closeMenu}
            footer={
              <>
                <a href={github} target="_blank" rel="me noopener" className="ghost h-12 gap-2 px-5 text-[15px]">
                  <GitHubIcon /> GitHub
                </a>
                <Link href={otherPath} hrefLang={other} className="ghost h-12 px-5 text-[15px]">
                  {other === "en" ? "English" : "Italiano"}
                </Link>
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}
