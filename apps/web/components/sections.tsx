import Link from "next/link";
import type { Content } from "@thoadd/db/content";
import { localePath, tr, ui, type Lang } from "@/lib/i18n";
import { ProtectedPhoto } from "./protected-photo";
import { RevealWords, Rich } from "./rich";

type Props = { content: Content; lang: Lang };

function SectionHead({ label, title, note, id }: { label: string; title: string; note?: string; id: string }) {
  return (
    <div className="g12 mb-16 items-end gap-y-6">
      <div className="c1-7">
        <p className="label m-0 mb-6" data-reveal>
          {label}
        </p>
        <h2 id={id} className="title-l m-0" data-words>
          <RevealWords text={title} />
        </h2>
      </div>
      {note && (
        <p className="c9-12 m-0 text-slate" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
          {note}
        </p>
      )}
    </div>
  );
}

export function Profile({ content, lang, photoSrc }: Props & { photoSrc: string }) {
  const t = ui[lang];
  const me = content.profile;
  const facts = [
    { label: t.currentRole, value: me.currentRole },
    { label: t.focus, value: tr(me.focus, lang) },
    { label: t.seeking, value: tr(me.seeking, lang) },
  ].filter((f) => f.value);

  return (
    <section id="profilo" aria-labelledby="profilo-title" className="wrap pb-40">
      <div
        data-reveal
        className="rounded-[var(--radius-sheet)] bg-cloud p-[clamp(32px,5.6vw,80px)] shadow-[0_60px_120px_-60px_rgb(61_79_184/0.28),0_2px_6px_rgb(61_79_184/0.04)]"
      >
        <div className="g12 gap-y-10">
          <div className="c1-4">
            <p className="label m-0">{t.profileLabel}</p>
            {me.photoUrl ? (
              <ProtectedPhoto src={photoSrc} alt={me.fullName} className="mt-10 aspect-[4/5] w-full max-w-[280px] rounded-[var(--radius-card)]" />
            ) : (
              <>
                <div
                  aria-hidden="true"
                  className="mt-10 aspect-[4/5] w-full max-w-[280px] rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_var(--color-haze)]"
                  style={{ background: "radial-gradient(circle at 30% 20%, var(--color-cloud), transparent 50%), linear-gradient(160deg, var(--color-mist), color-mix(in srgb, var(--color-aura) 35%, var(--color-cloud)) 55%, var(--color-dawn))" }}
                />
                <p className="label mt-3 mb-0">{t.portraitHint}</p>
              </>
            )}
          </div>
          <div className="c5-12">
            {me.headline && (
              <h2 id="profilo-title" className="title-l m-0" data-words>
                <RevealWords text={tr(me.headline, lang)} />
              </h2>
            )}
            <p className="mt-10 mb-0 max-w-[640px] text-[clamp(18px,1.4vw,20px)] leading-[1.55]">{tr(me.bio, lang)}</p>
            {me.bioPersonal && <p className="mt-6 mb-0 max-w-[640px] text-slate">{tr(me.bioPersonal, lang)}</p>}
            {facts.length > 0 && (
              <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 border-t border-haze pt-8">
                {facts.map((f) => (
                  <div key={f.label}>
                    <p className="label m-0">{f.label}</p>
                    <p className="m-0 mt-1">{f.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const year = (d: string | null) => (d ? d.slice(0, 4) : null);

export function Journey({ content, lang }: Props) {
  const t = ui[lang];
  if (content.experiences.length === 0) return null;
  return (
    <section id="percorso" aria-labelledby="percorso-title" className="wrap pb-40">
      <SectionHead id="percorso-title" label={t.expLabel} title={t.expTitle} note={t.expNote} />
      <ol className="m-0 list-none border-t border-haze p-0">
        {content.experiences.map((e, i) => {
          const from = year(e.startDate);
          const to = year(e.endDate);
          const range = !from ? null : !to ? `${from} — ${t.now}` : from === to ? from : `${from} — ${to}`;
          return (
            <li
              key={e.id}
              data-reveal
              style={{ "--d": i } as React.CSSProperties}
              className="spot g12 gap-y-4 rounded-[var(--radius-card)] border-b border-haze px-0 py-10 md:-mx-6 md:px-6"
            >
              <div className="c1-3">
                {range && <p className="display m-0 text-[clamp(24px,2.2vw,32px)] font-light tracking-[-0.01em]">{range}</p>}
                <p className="label m-0 mt-1">{[e.city, tr(e.employmentType, lang)].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="c4-8">
                <p className="m-0 mb-3 inline-flex rounded-full border border-haze px-3 py-1 text-[12px] text-slate">{t.kinds[e.kind] ?? e.kind}</p>
                <h3 className="title-m m-0">{tr(e.role, lang)}</h3>
                {e.company && <p className="m-0 mt-1.5 font-medium text-iris">{e.company}</p>}
              </div>
              <div className="c9-12">
                {e.description && <p className="m-0">{tr(e.description, lang)}</p>}
                {e.technologies.length > 0 && <p className="label m-0 mt-4">{e.technologies.join(" · ")}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// Le tre sfumature del design, usate finché un progetto non ha un'immagine.
export const projectArt = [
  "radial-gradient(circle at 70% 30%, #FFFFFF 0, transparent 35%), linear-gradient(140deg, #DCE3F7, #8FA6E0 70%, #F6E3DA)",
  "radial-gradient(circle at 30% 70%, #F6E3DA 0, transparent 45%), linear-gradient(200deg, #FFFFFF, #DCE3F7 50%, #B3C1EA)",
  "radial-gradient(circle at 50% 120%, #8FA6E0 0, transparent 60%), conic-gradient(from 120deg at 60% 40%, #F4F6FB, #DCE3F7, #F6E3DA, #FFFFFF, #DCE3F7, #F4F6FB)",
]
const projectSlots = ["p1", "p2", "p3"];
export const projectImage = (p: Content["projects"][number]) => p.imageUrl ?? p.gallery[0]?.url ?? null;

export function Projects({ content, lang }: Props) {
  const t = ui[lang];
  if (content.projects.length === 0) return null;
  const href = (slug: string | null) => (slug ? localePath(lang, `/progetti/${slug}`) : null);
  const featured = content.projects.slice(0, 3);

  return (
    <section id="progetti" aria-labelledby="prog-title" className="wrap pb-40">
      <SectionHead id="prog-title" label={t.projLabel} title={t.projTitle} note={t.projNote} />

      {/* Raggi annidati: foglio 32 con 16 di margine → immagine con raggio 16. */}
      <div className="g12 gap-y-6">
        {featured.map((p, i) => {
          const link = href(p.slug);
          const image = projectImage(p);
          const card = (
            <>
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" className="h-[260px] w-full rounded-[var(--radius-inner)] object-cover" />
              ) : (
                <div aria-hidden="true" className="art h-[260px] rounded-[var(--radius-inner)]" style={{ background: projectArt[i % 3] }} />
              )}
              <div className="px-4 pt-6">
                <p className="label m-0">{[tr(p.kind, lang), p.year].filter(Boolean).join(" · ")}</p>
                <h3 className="title-m mt-2 mb-0">{p.title}</h3>
                <p className="mt-3 mb-0 text-slate">{tr(p.summary, lang)}</p>
                {link && (
                  <span className="link-arrow mt-5 inline-flex min-h-11 items-center gap-2 font-medium text-iris">
                    {t.readCase} <span aria-hidden="true" className="arrow">→</span>
                  </span>
                )}
              </div>
            </>
          );
          const cls = `sheet ${projectSlots[i]} block rounded-[var(--radius-sheet)] bg-cloud px-4 pt-4 pb-8 text-ink no-underline shadow-[var(--shadow-card)] hover:text-ink`;
          return link ? (
            <Link key={p.id} href={link} data-tilt className={cls}>
              {card}
            </Link>
          ) : (
            <article key={p.id} data-tilt className={cls}>
              {card}
            </article>
          );
        })}
      </div>

      <div className="mt-24">
        <p className="label m-0 mb-4" data-reveal>
          {t.allProjects} · {content.projects.length}
        </p>
        <ol className="m-0 list-none border-t border-haze p-0">
          {content.projects.map((p, i) => {
            const link = href(p.slug);
            return (
              <li key={p.id} data-reveal style={{ "--d": i } as React.CSSProperties} className="border-b border-haze">
                <div className="spot flex flex-wrap items-center gap-x-8 gap-y-3 rounded-[var(--radius-card)] py-6 md:-mx-6 md:px-6">
                  <span className="display w-16 text-[20px] font-light text-slate">{p.year ?? "—"}</span>
                  <span className="min-w-0 flex-1">
                    <span className="title-m block text-[clamp(20px,1.8vw,26px)]">{p.title}</span>
                    <span className="label">{[tr(p.kind, lang), ...p.technologies].filter(Boolean).join(" · ")}</span>
                  </span>
                  {link && (
                    <Link href={link} data-magnetic className="ghost h-12 px-5 text-[15px]">
                      {t.readCase} <span aria-hidden="true" className="arrow">→</span>
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

const skillSize = ["", "text-[clamp(24px,2.2vw,32px)]", "text-[clamp(32px,3.9vw,56px)]", "text-[clamp(40px,5.6vw,80px)]"];
const skillColor = ["", "text-slate", "text-iris", "text-ink"];

export function Skills({ content, lang }: Props) {
  const t = ui[lang];
  if (content.skills.length === 0) return null;
  return (
    <section id="competenze" aria-labelledby="comp-title" className="wrap pb-40">
      <div className="g12 gap-y-12">
        <div className="c1-4">
          <p className="label m-0 mb-6" data-reveal>
            {t.skillsLabel}
          </p>
          <h2 id="comp-title" className="title-l m-0" data-words>
            <RevealWords text={t.skillsTitle} />
          </h2>
          <ul className="label m-0 mt-10 flex list-none flex-col gap-3 p-0">
            {[3, 2, 1].map((level) => (
              <li key={level} className="flex items-center gap-3">
                <span aria-hidden="true" className={`h-px w-6 ${["", "bg-slate", "bg-iris", "bg-ink"][level]}`} />
                {t.levels[level - 1]}
              </li>
            ))}
          </ul>
        </div>
        <ul className="c5-12 display m-0 flex list-none flex-wrap items-baseline gap-x-6 gap-y-2 p-0 leading-[1.12] font-light tracking-[-0.02em]">
          {content.skills.map((s, i) => (
            <li
              key={s.id}
              data-reveal
              style={{ "--d": i % 6 } as React.CSSProperties}
              className={`${skillSize[s.size] ?? skillSize[2]} ${skillColor[s.level] ?? skillColor[2]} ${s.accent ? "accent" : ""}`}
            >
              <span className="skill">{s.name}</span>
              <span className="sr-only"> — {t.levels[(s.level || 2) - 1]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Studi come linea del tempo: completati pieni, in corso con l'anello, in programma tratteggiati.
export function Studies({ content, lang }: Props) {
  const t = ui[lang];
  if (content.education.length === 0 && content.certifications.length === 0) return null;
  return (
    <section id="studi" aria-labelledby="studi-title" className="wrap pb-40">
      <SectionHead id="studi-title" label={t.eduLabel} title={t.eduTitle} />
      <ol className="relative m-0 list-none p-0 md:ml-[calc(100%/3)]">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-haze-strong" />
        {content.education.map((e, i) => {
          const planned = e.status === "in_programma";
          const current = e.status === "in_corso";
          return (
            <li key={e.id} data-reveal style={{ "--d": i } as React.CSSProperties} className="relative pb-10 pl-12 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute top-2 left-0 size-[15px] rounded-full border ${
                  planned
                    ? "border-dashed border-aura bg-mist"
                    : current
                      ? "border-iris bg-cloud shadow-[0_0_0_5px_color-mix(in_srgb,var(--color-aura)_30%,transparent)]"
                      : "border-iris bg-iris"
                }`}
              />
              {/* Raggi annidati: scheda 24 con 32 di margine interno, nessun elemento annidato negli angoli. */}
              <div
                className={`rounded-[var(--radius-card)] p-8 ${
                  planned ? "border border-dashed border-haze-strong bg-transparent" : "bg-glass shadow-[0_30px_60px_-40px_rgb(61_79_184/0.3)]"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-[12px] ${planned ? "border border-dashed border-aura text-iris" : current ? "bg-iris text-cloud" : "border border-haze text-slate"}`}>
                    {t.statuses[e.status] ?? e.status}
                  </span>
                  <span className="label">{[e.startYear, e.endYear].filter(Boolean).join(" — ")}</span>
                </div>
                <h3 className="title-m mt-4 mb-0">
                  <Rich text={tr(e.title, lang)} accentClass="" />
                </h3>
                <p className="mt-2 mb-0 text-iris">{[e.school, e.city].filter(Boolean).join(", ")}</p>
                {e.description && <p className="mt-3 mb-0 text-slate">{tr(e.description, lang)}</p>}
              </div>
            </li>
          );
        })}
      </ol>
      {content.certifications.length > 0 && (
        <div className="mt-16 md:ml-[calc(100%/3)]" data-reveal>
          <p className="label m-0 mb-4">{t.certifications}</p>
          <ul className="m-0 list-none border-t border-haze p-0">
            {content.certifications.map((c) => (
              <li key={c.id} className="flex flex-wrap items-baseline justify-between gap-4 border-b border-haze py-4">
                <span className="font-medium">{c.url ? <a href={c.url} className="plain" target="_blank" rel="noopener">{c.name} ↗</a> : c.name}</span>
                <span className="label">{[c.issuer, c.issuedOn?.slice(0, 4)].filter(Boolean).join(" · ")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function Faq({ content, lang }: Props) {
  const t = ui[lang];
  if (content.faqs.length === 0) return null;
  return (
    <section id="faq" aria-labelledby="faq-title" className="wrap pb-[200px]">
      <div className="g12 gap-y-8">
        <div className="c1-4">
          <p className="label m-0 mb-6" data-reveal>
            {t.faqLabel}
          </p>
          <h2 id="faq-title" className="title-l m-0" data-words>
            <RevealWords text={t.faqTitle} />
          </h2>
        </div>
        <div className="c5-12 border-t border-haze-strong">
          {content.faqs.map((f, i) => (
            <details key={f.id} open={i === 0} className="group border-b border-haze-strong">
              <summary className="display flex min-h-20 items-center justify-between gap-6 text-[clamp(20px,1.7vw,24px)] transition-colors hover:text-iris">
                {tr(f.question, lang)}
                <span
                  aria-hidden="true"
                  className="plus grid size-10 flex-none place-items-center rounded-full border border-haze-strong font-sans text-[22px] font-light"
                >
                  +
                </span>
              </summary>
              <p className="mt-0 mb-8 max-w-[620px] text-slate">{tr(f.answer, lang)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
