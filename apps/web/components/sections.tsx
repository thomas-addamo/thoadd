import type { Content } from "@/lib/content";
import { tr, ui, type Lang } from "@/lib/i18n";
import { Rich } from "./rich";

type Props = { content: Content; lang: Lang };

function SectionHead({ label, title, note, id }: { label: string; title: string; note?: string; id: string }) {
  return (
    <div className="g12 mb-16 items-end gap-y-6">
      <div className="c1-7">
        <p className="label m-0 mb-6">{label}</p>
        <h2 id={id} className="title-l m-0">
          <Rich text={title} />
        </h2>
      </div>
      {note && <p className="c9-12 m-0 text-slate">{note}</p>}
    </div>
  );
}

export function Profile({ content, lang }: Props) {
  const t = ui[lang];
  const me = content.profile;
  const facts = [
    { label: t.currentRole, value: me.currentRole },
    { label: t.focus, value: tr(me.focus, lang) },
    { label: t.seeking, value: tr(me.seeking, lang) },
  ].filter((f) => f.value);

  return (
    <section id="profilo" aria-labelledby="profilo-title" className="wrap pb-40">
      <div className="reveal rounded-[var(--radius-sheet)] bg-cloud p-[clamp(32px,5.6vw,80px)] shadow-[0_60px_120px_-60px_rgb(61_79_184/0.28),0_2px_6px_rgb(61_79_184/0.04)]">
        <div className="g12 gap-y-10">
          <div className="c1-4">
            <p className="label m-0">{t.profileLabel}</p>
            {me.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={me.photoUrl}
                alt={me.fullName}
                className="mt-10 aspect-[4/5] w-full max-w-[280px] rounded-[var(--radius-card)] object-cover"
              />
            ) : (
              <>
                <div
                  aria-hidden="true"
                  className="mt-10 aspect-[4/5] w-full max-w-[280px] rounded-[var(--radius-card)] shadow-[inset_0_0_0_1px_var(--color-haze)]"
                  style={{ background: "radial-gradient(circle at 30% 20%, #FFFFFF, transparent 50%), linear-gradient(160deg, #F4F6FB, #DCE3F7 55%, #F6E3DA)" }}
                />
                <p className="label mt-3 mb-0">{t.portraitHint}</p>
              </>
            )}
          </div>
          <div className="c5-12">
            {me.headline && (
              <h2 id="profilo-title" className="title-l m-0">
                <Rich text={tr(me.headline, lang)} />
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

export function Experiences({ content, lang }: Props) {
  const t = ui[lang];
  if (content.experiences.length === 0) return null;
  return (
    <section id="esperienze" aria-labelledby="esp-title" className="wrap pb-40">
      <SectionHead id="esp-title" label={t.expLabel} title={t.expTitle} note={t.expNote} />
      <ol className="m-0 list-none border-t border-haze p-0">
        {content.experiences.map((e) => {
          const from = year(e.startDate);
          const to = year(e.endDate);
          const range = !to ? `${from} — ${t.now}` : from === to ? from : `${from} — ${to}`;
          return (
            <li key={e.id} className="row g12 gap-y-4 border-b border-haze py-10">
              <div className="c1-3">
                <p className="display m-0 text-[clamp(24px,2.2vw,32px)] font-light tracking-[-0.01em]">{range}</p>
                <p className="label m-0 mt-1">{[e.city, tr(e.employmentType, lang)].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="c4-8">
                <h3 className="title-m m-0">{tr(e.role, lang)}</h3>
                <p className="m-0 mt-1.5 font-medium text-iris">{e.company}</p>
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
const projectArt = [
  "radial-gradient(circle at 70% 30%, #FFFFFF 0, transparent 35%), linear-gradient(140deg, #DCE3F7, #8FA6E0 70%, #F6E3DA)",
  "radial-gradient(circle at 30% 70%, #F6E3DA 0, transparent 45%), linear-gradient(200deg, #FFFFFF, #DCE3F7 50%, #B3C1EA)",
  "radial-gradient(circle at 50% 120%, #8FA6E0 0, transparent 60%), conic-gradient(from 120deg at 60% 40%, #F4F6FB, #DCE3F7, #F6E3DA, #FFFFFF, #DCE3F7, #F4F6FB)",
];
const projectSlots = ["p1", "p2", "p3"];

export function Projects({ content, lang }: Props) {
  const t = ui[lang];
  if (content.projects.length === 0) return null;
  return (
    <section id="progetti" aria-labelledby="prog-title" className="wrap pb-[200px]">
      <SectionHead id="prog-title" label={t.projLabel} title={t.projTitle} note={t.projNote} />
      <div className="g12 gap-y-6">
        {content.projects.map((p, i) => {
          const link = p.url ?? p.repoUrl;
          return (
            <article
              key={p.id}
              className={`sheet ${projectSlots[i % 3]} rounded-[var(--radius-sheet)] bg-cloud px-4 pt-4 pb-8 shadow-[var(--shadow-card)] ${i >= 3 ? "!mt-0 !row-auto" : ""}`}
            >
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="h-[260px] w-full rounded-[var(--radius-card)] object-cover" />
              ) : (
                <div aria-hidden="true" className="h-[260px] rounded-[var(--radius-card)]" style={{ background: projectArt[i % 3] }} />
              )}
              <div className="px-4 pt-6">
                <p className="label m-0">{[tr(p.kind, lang), p.year].filter(Boolean).join(" · ")}</p>
                <h3 className="title-m mt-2 mb-0">{p.title}</h3>
                <p className="mt-3 mb-0 text-slate">{tr(p.summary, lang)}</p>
                {link && (
                  <a href={link} className="mt-5 inline-flex min-h-11 items-center gap-2 font-medium no-underline">
                    {t.readCase} <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </article>
          );
        })}
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
          <p className="label m-0 mb-6">{t.skillsLabel}</p>
          <h2 id="comp-title" className="title-l m-0">
            <Rich text={t.skillsTitle} />
          </h2>
          <ul className="label m-0 mt-10 flex list-none flex-col gap-3 p-0">
            {[3, 2, 1].map((level) => (
              <li key={level} className="flex items-center gap-3">
                <span aria-hidden="true" className={`h-px w-6 ${["", "bg-aura", "bg-iris", "bg-ink"][level]}`} />
                {t.levels[level - 1]}
              </li>
            ))}
          </ul>
        </div>
        <ul className="c5-12 display m-0 flex list-none flex-wrap items-baseline gap-x-6 gap-y-2 p-0 leading-[1.12] font-light tracking-[-0.02em]">
          {content.skills.map((s) => (
            <li
              key={s.id}
              className={`${skillSize[s.size] ?? skillSize[2]} ${skillColor[s.level] ?? skillColor[2]} ${s.accent ? "accent" : ""}`}
            >
              {s.name}
              <span className="sr-only"> — {t.levels[(s.level || 2) - 1]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Education({ content, lang }: Props) {
  const t = ui[lang];
  const cards = [
    ...content.education.map((e) => ({
      key: `e${e.id}`,
      when: [e.startYear, e.endYear].filter(Boolean).join(" — ") || "[Anno] — [Anno]",
      title: tr(e.title, lang),
      where: [e.school, e.city].filter(Boolean).join(", "),
    })),
    ...content.certifications.map((c) => ({
      key: `c${c.id}`,
      when: c.issuedOn ? c.issuedOn.slice(0, 4) : "[Anno]",
      title: c.name,
      where: c.issuer ?? "",
    })),
  ];
  if (cards.length === 0) return null;
  return (
    <section id="formazione" aria-labelledby="form-title" className="wrap pb-40">
      <div className="g12 gap-y-8">
        <div className="c1-4">
          <p className="label m-0 mb-6">{t.eduLabel}</p>
          <h2 id="form-title" className="title-l m-0">
            {t.eduTitle}
          </h2>
        </div>
        <div className="c5-12 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {cards.map((c) => (
            <div
              key={c.key}
              className="reveal rounded-[var(--radius-card)] bg-white/75 p-8 shadow-[0_30px_60px_-40px_rgb(61_79_184/0.3),inset_0_0_0_1px_#fff]"
            >
              <p className="label m-0">{c.when}</p>
              <h3 className="title-m mt-4 mb-0">
                <Rich text={c.title} accentClass="" />
              </h3>
              {c.where && <p className="mt-2 mb-0 text-iris">{c.where}</p>}
            </div>
          ))}
        </div>
      </div>
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
          <p className="label m-0 mb-6">{t.faqLabel}</p>
          <h2 id="faq-title" className="title-l m-0">
            <Rich text={t.faqTitle} />
          </h2>
        </div>
        <div className="c5-12 border-t border-haze-strong">
          {content.faqs.map((f, i) => (
            <details key={f.id} open={i === 0} className="border-b border-haze-strong">
              <summary className="display flex min-h-20 items-center justify-between gap-6 text-[clamp(20px,1.7vw,24px)]">
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
