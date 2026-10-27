import type { Content } from "@/lib/content";
import { ui, type Lang } from "@/lib/i18n";
import { DownloadCv } from "./download-cv";
import { Rich } from "./rich";

export function Footer({ content, lang }: { content: Content; lang: Lang }) {
  const t = ui[lang];
  const { profile: me, links, cv } = content;

  return (
    <footer id="contatti" aria-labelledby="footer-title" className="relative pt-10">
      <div className="wrap">
        <div className="g12 items-center gap-y-12">
          <div className="c1-3 flex flex-col gap-1">
            <p className="m-0 mb-2 text-[13px] text-ink">{t.contacts}</p>
            {me.email && (
              <a href={`mailto:${me.email}`} className="plain flex min-h-8 items-center font-medium">
                {me.email}
              </a>
            )}
            {links.map((l) => (
              <a key={l.id} href={l.url} className="plain flex min-h-8 items-center" rel="me noopener" target="_blank">
                {l.label ?? l.kind} <span aria-hidden="true">&nbsp;↗</span>
              </a>
            ))}
          </div>

          {/* La CTA firma: "Scarica CV" tra due cornici di puntini, come nel riferimento Equal. */}
          <div className="c4-9 flex items-stretch gap-4">
            <div aria-hidden="true" className="dots hide-m flex-1 rounded-[var(--radius-card)] [mask-image:linear-gradient(90deg,transparent,#000_70%)]" />
            <div className="flex-none rounded-[var(--radius-sheet)] border border-white/90 bg-white/55 p-10 text-center shadow-[0_40px_80px_-40px_rgb(61_79_184/0.45)] backdrop-blur-md max-md:flex-1">
              <p className="m-0 text-[13px] text-ink">{t.cvCardKicker}</p>
              <h2 id="footer-title" className="display mt-3 mb-7 text-[clamp(32px,2.8vw,40px)] leading-[1.05] font-light tracking-[-0.02em]">
                <Rich text={t.cvCardTitle} accentClass="" />
              </h2>
              <DownloadCv cv={cv} lang={lang} label={t.downloadCv} className="h-14 px-7" />
            </div>
            <div aria-hidden="true" className="dots hide-m flex-1 rounded-[var(--radius-card)] [mask-image:linear-gradient(270deg,transparent,#000_70%)]" />
          </div>

          <nav aria-label={t.footerNav} className="c10-12 flex flex-col gap-1 md:items-end">
            <p className="m-0 mb-2 text-[13px] text-ink">{t.page}</p>
            <a href="#profilo" className="plain flex min-h-8 items-center">{t.nav.profilo}</a>
            <a href="#progetti" className="plain flex min-h-8 items-center">{t.nav.progetti}</a>
            <a href="#top" className="plain flex min-h-8 items-center">{t.backToTop} ↑</a>
          </nav>
        </div>

        <div className="mt-[72px] flex flex-wrap justify-between gap-4 border-t border-white/60 py-4 text-[13px] text-ink">
          <span>© {new Date().getFullYear()} {me.fullName}</span>
          <span>thoadd.com</span>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="wordmark display m-0 mt-2 mb-[-0.24em] text-center text-[clamp(104px,30vw,440px)] leading-none font-light tracking-[-0.05em] whitespace-nowrap text-white/70 select-none [mask-image:linear-gradient(180deg,#000_30%,transparent_92%)]"
      >
        thoadd
      </p>
    </footer>
  );
}
