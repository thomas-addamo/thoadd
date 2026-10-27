import Link from "next/link";
import { Monogram } from "@thoadd/ui/monogram";
import type { Content } from "@thoadd/db/content";
import { homePath, ui, type Lang } from "@/lib/i18n";
import { DownloadCv } from "./download-cv";
import { MobileMenu } from "./mobile-menu";

export function Header({ lang, cv }: { lang: Lang; cv: Content["cv"] }) {
  const t = ui[lang];
  const items = (["profilo", "esperienze", "progetti", "competenze", "contatti"] as const).map((id) => ({
    href: `#${id}`,
    label: t.nav[id],
  }));

  return (
    <header className="sticky top-0 z-30 border-b border-haze/90 bg-white/55 backdrop-blur-[18px]">
      <div className="wrap relative flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <a href="#top" aria-label={t.home} className="flex min-h-11 items-center gap-3 text-ink no-underline">
          <Monogram size={32} />
          <span className="display hide-m text-[17px] tracking-[0.01em] whitespace-nowrap">Thomas Addamo</span>
        </a>

        <nav aria-label={t.sections} className="hide-m flex gap-8">
          {items.map((item) => (
            <a key={item.href} className="navlink" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div role="group" aria-label={t.language} className="flex rounded-full border border-haze bg-white/60 p-1">
            {(["it", "en"] as const).map((code) => (
              <Link
                key={code}
                href={homePath(code)}
                hrefLang={code}
                aria-current={code === lang ? "true" : undefined}
                className={`lang grid h-9 min-w-11 place-items-center rounded-full text-[13px] no-underline ${
                  code === lang
                    ? "bg-white font-medium text-ink shadow-[0_4px_12px_-6px_rgb(61_79_184/0.4)]"
                    : "text-slate hover:text-ink"
                }`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>
          <DownloadCv cv={cv} lang={lang} label={t.downloadCv} className="h-11 gap-2 px-4 text-[15px] md:gap-2.5 md:px-5" iconSize={16} compact />
          <MobileMenu items={items} openLabel={t.openMenu} closeLabel={t.closeMenu} />
        </div>
      </div>
    </header>
  );
}
