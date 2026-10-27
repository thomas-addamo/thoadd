import type { Content } from "@thoadd/db/content";
import { tr, ui, type Lang } from "@/lib/i18n";
import { cvUrl, DownloadCv } from "./download-cv";
import { Orb } from "./orb";
import { Rich } from "./rich";

export function Hero({ content, lang }: { content: Content; lang: Lang }) {
  const t = ui[lang];
  const { profile: me, cv } = content;
  const [first, ...rest] = me.fullName.split(" ");
  const updated = cvUrl(cv, lang) && cv
    ? new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "it-IT", { month: "long", year: "numeric" }).format(cv.publishedAt)
    : null;

  return (
    <section aria-labelledby="hero-title" className="wrap pt-16 pb-24 md:pt-[120px]">
      <div className="g12 items-center gap-y-12">
        <div className="c1-7">
          {(me.available || me.status) && (
            <p className="label m-0 mb-8 inline-flex items-center gap-2.5 rounded-full border border-haze bg-white/70 py-2 pr-4 pl-3">
              <span aria-hidden="true" className="size-2 rounded-full bg-iris shadow-[0_0_0_4px_rgb(143_166_224/0.35)]" />
              {tr(me.role, lang)}
              {me.status && ` · ${tr(me.status, lang)}`}
            </p>
          )}
          <h1 id="hero-title" className="title-xl m-0">
            {first} <em className="accent text-iris">{rest.join(" ")}</em>
          </h1>
          <p className="mt-8 mb-0 max-w-[540px] text-[clamp(18px,1.5vw,21px)] leading-normal">
            <Rich text={tr(me.tagline, lang)} />
          </p>
          {me.lookingFor && <p className="mt-4 mb-0 max-w-[540px] text-slate">{tr(me.lookingFor, lang)}</p>}
          <div className="stack-m mt-12 flex flex-wrap items-center gap-4">
            <DownloadCv cv={cv} lang={lang} label={t.downloadCvPdf} className="h-14 px-7 text-base" />
            <a className="ghost h-14 px-6 text-base" href="#contatti">
              {t.writeMe} <span aria-hidden="true">→</span>
            </a>
          </div>
          <p className="label mt-4 mb-0">{updated ? t.cvMeta(updated) : t.cvMetaSoon}</p>
        </div>
        <div className="c8-12">
          <Orb />
        </div>
      </div>

      <dl className="g12 mt-24 mb-0 gap-y-4 border-t border-haze pt-6">
        <div className="c1-4">
          <dt className="label">{t.base}</dt>
          <dd className="m-0 mt-1">{me.city ? `${me.city}, Italia` : "Italia"}</dd>
        </div>
        <div className="c5-12 flex flex-wrap justify-between gap-6">
          {content.languages.length > 0 && (
            <div>
              <dt className="label">{t.languages}</dt>
              <dd className="m-0 mt-1">{content.languages.map((l) => tr(l.name, lang)).join(" · ")}</dd>
            </div>
          )}
          {me.workMode && (
            <div>
              <dt className="label">{t.workMode}</dt>
              <dd className="m-0 mt-1">{tr(me.workMode, lang)}</dd>
            </div>
          )}
          {me.email && (
            <div>
              <dt className="label">{t.contact}</dt>
              <dd className="m-0 mt-1">
                <a href={`mailto:${me.email}`}>{me.email}</a>
              </dd>
            </div>
          )}
        </div>
      </dl>
    </section>
  );
}
