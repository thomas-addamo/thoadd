import type { Content } from "@thoadd/db/content";
import { tr, ui, type Lang } from "@/lib/i18n";
import { cvUrl, DownloadCv } from "./download-cv";
import { HeroName } from "./hero-name";
import { Rich } from "./rich";

export function Hero({ content, lang }: { content: Content; lang: Lang }) {
  const t = ui[lang];
  const { profile: me, cv } = content;
  const [first, ...rest] = me.fullName.split(" ");
  const updated =
    cvUrl(cv, lang) && cv
      ? new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "it-IT", { month: "long", year: "numeric" }).format(new Date(cv.publishedAt))
      : null;

  const facts = [
    { label: t.base, value: me.city ? `${me.city}, Italia` : "Italia" },
    { label: t.languages, value: content.languages.map((l) => tr(l.name, lang)).join(" · ") },
    { label: t.workMode, value: tr(me.workMode, lang) },
  ].filter((f) => f.value);

  return (
    <section aria-labelledby="hero-title" className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-[140px] pb-16">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
      <div className="wrap relative w-full">
        <HeroName first={first} last={rest.join(" ")} />

        <div className="g12 mt-14 items-end gap-y-10">
          <div className="c1-7" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            <p className="m-0 max-w-[560px] text-[clamp(19px,1.6vw,23px)] leading-normal">
              <Rich text={tr(me.tagline, lang)} />
            </p>
            <div className="stack-m mt-10 flex flex-wrap items-center gap-4">
              <span data-magnetic className="inline-flex">
                <DownloadCv cv={cv} lang={lang} label={t.downloadCvPdf} className="h-14 w-full px-7 text-base" />
              </span>
              <a data-magnetic className="ghost h-14 px-6 text-base" href="#contatti">
                {t.writeMe} <span aria-hidden="true" className="arrow">→</span>
              </a>
            </div>
            <p className="label mt-4 mb-0">{updated ? t.cvMeta(updated) : t.cvMetaSoon}</p>
          </div>

          <div className="c9-12" data-reveal style={{ "--d": 3 } as React.CSSProperties}>
            {me.lookingFor && <p className="m-0 mb-8 text-slate">{tr(me.lookingFor, lang)}</p>}
            <dl className="m-0 flex flex-col border-t border-haze">
              {facts.map((f) => (
                <div key={f.label} className="flex items-baseline justify-between gap-6 border-b border-haze py-3">
                  <dt className="label">{f.label}</dt>
                  <dd className="m-0 text-right">{f.value}</dd>
                </div>
              ))}
              {me.email && (
                <div className="flex items-baseline justify-between gap-6 border-b border-haze py-3">
                  <dt className="label">{t.contact}</dt>
                  <dd className="m-0">
                    <a href={`mailto:${me.email}`} className="plain">
                      {me.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <a href="#profilo" className="label hide-m mt-16 inline-flex items-center gap-3 no-underline hover:text-ink">
          <span aria-hidden="true" className="scroll-hint relative h-10 w-px overflow-hidden bg-haze" />
          {t.scrollHint}
        </a>
      </div>
    </section>
  );
}
