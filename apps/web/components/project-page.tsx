import Link from "next/link";
import type { Content } from "@thoadd/db/content";
import { localePath, tr, ui, type Lang } from "@/lib/i18n";
import { Markdown } from "@/lib/markdown";
import { RevealWords } from "./rich";
import { projectArt, projectImage } from "./sections";
import { SiteShell } from "./site-shell";

const size = (bytes: number) => (bytes > 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`);

export function ProjectPage({ content, lang, slug }: { content: Content; lang: Lang; slug: string }) {
  const t = ui[lang];
  const index = content.projects.findIndex((p) => p.slug === slug);
  const p = content.projects[index];
  const prev = content.projects[index - 1];
  const next = content.projects[index + 1];
  const cover = projectImage(p);
  const gallery = p.gallery.filter((g) => g.url !== cover);
  const links = [...(p.url ? [{ label: p.url.replace(/^https?:\/\//, ""), url: p.url }] : []), ...(p.repoUrl ? [{ label: "Repository", url: p.repoUrl }] : []), ...p.links];
  const link = (s: string | null) => localePath(lang, s ? `/progetti/${s}` : "/");

  return (
    <SiteShell content={content} lang={lang}>
      <article className="wrap pt-[140px] pb-40">
        <Link href={`${localePath(lang, "/")}#progetti`} className="link-arrow label inline-flex items-center gap-2 no-underline hover:text-ink">
          <span aria-hidden="true" className="arrow inline-block rotate-180">→</span> {t.backToProjects}
        </Link>

        <header className="g12 mt-10 items-end gap-y-8">
          <div className="c1-8">
            <p className="label m-0 mb-5" data-reveal>{[tr(p.kind, lang), p.year].filter(Boolean).join(" · ")}</p>
            <h1 className="title-hero m-0 text-[clamp(48px,8vw,120px)]" data-words>
              <RevealWords text={p.title} />
            </h1>
          </div>
          <p className="c9-12 m-0 text-[clamp(18px,1.4vw,20px)] leading-normal" data-reveal style={{ "--d": 2 } as React.CSSProperties}>
            {tr(p.summary, lang)}
          </p>
        </header>

        <div data-reveal className="mt-16 overflow-hidden rounded-[var(--radius-sheet)] shadow-[var(--shadow-card)]">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={p.gallery.find((g) => g.url === cover)?.alt ?? ""} className="aspect-[16/9] w-full object-cover" />
          ) : (
            <div aria-hidden="true" className="art aspect-[16/9]" style={{ background: projectArt[index % 3] }} />
          )}
        </div>

        <div className="g12 mt-20 gap-y-14">
          <div className="c1-7 text-[clamp(17px,1.25vw,19px)] leading-[1.7]" data-reveal>
            {p.body ? <Markdown text={tr(p.body, lang)} /> : <p className="m-0 text-slate">{tr(p.summary, lang)}</p>}
          </div>

          {/* Colonna dei dettagli: scheda 24 con 24 di margine, voci senza angoli annidati. */}
          <aside className="c9-12 flex flex-col gap-6 self-start md:sticky md:top-28" data-reveal style={{ "--d": 1 } as React.CSSProperties}>
            {p.technologies.length > 0 && (
              <div className="rounded-[var(--radius-card)] bg-glass p-6 shadow-[var(--shadow-sheet)]">
                <p className="label m-0 mb-3">{t.technologies}</p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {p.technologies.map((tech) => (
                    <li key={tech} className="rounded-full border border-haze px-3 py-1 text-[14px]">{tech}</li>
                  ))}
                </ul>
              </div>
            )}
            {links.length > 0 && (
              <div className="rounded-[var(--radius-card)] bg-glass p-6 shadow-[var(--shadow-sheet)]">
                <p className="label m-0 mb-2">{t.projectLinks}</p>
                <ul className="m-0 list-none p-0">
                  {links.map((l) => (
                    <li key={l.url} className="border-b border-haze last:border-0">
                      <a href={l.url} target="_blank" rel="noopener" className="link-arrow flex min-h-12 items-center justify-between gap-4 text-ink no-underline hover:text-iris">
                        <span className="truncate">{l.label}</span>
                        <span aria-hidden="true" className="arrow">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {p.attachments.length > 0 && (
              <div className="rounded-[var(--radius-card)] bg-glass p-6 shadow-[var(--shadow-sheet)]">
                <p className="label m-0 mb-2">{t.attachments}</p>
                <ul className="m-0 list-none p-0">
                  {p.attachments.map((f) => (
                    <li key={f.url} className="border-b border-haze last:border-0">
                      <a href={f.url} download={f.name} className="flex min-h-12 items-center justify-between gap-4 text-ink no-underline hover:text-iris">
                        <span className="truncate">{f.name}</span>
                        <span className="label flex-none">{t.download} · {size(f.size)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {gallery.length > 0 && (
          <section aria-label={t.gallery} className="mt-24">
            <p className="label m-0 mb-6" data-reveal>{t.gallery}</p>
            <div className="grid gap-6 md:grid-cols-2">
              {gallery.map((g, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={g.url}
                  src={g.url}
                  alt={g.alt ?? ""}
                  loading="lazy"
                  data-reveal
                  style={{ "--d": i % 2 } as React.CSSProperties}
                  className={`w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card)] ${i % 3 === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
                />
              ))}
            </div>
          </section>
        )}

        <nav aria-label={t.allProjects} className="mt-28 grid gap-4 border-t border-haze pt-8 md:grid-cols-2">
          {prev ? (
            <Link href={link(prev.slug)} className="link-arrow spot rounded-[var(--radius-card)] p-6 text-ink no-underline">
              <span className="label block">← {t.prevProject}</span>
              <span className="title-m mt-2 block">{prev.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={link(next.slug)} className="link-arrow spot rounded-[var(--radius-card)] p-6 text-right text-ink no-underline">
              <span className="label block">{t.nextProject} →</span>
              <span className="title-m mt-2 block">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </SiteShell>
  );
}
