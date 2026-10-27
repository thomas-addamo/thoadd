import type { Content } from "@thoadd/db/content";
import { legal } from "@/lib/legal";
import type { Lang } from "@/lib/i18n";
import { RevealWords } from "./rich";
import { SiteShell } from "./site-shell";

export function LegalPage({ content, lang, kind }: { content: Content; lang: Lang; kind: "copyright" | "privacy" }) {
  const doc = legal(kind, lang, { name: content.profile.fullName, email: content.profile.email ?? "info@thoadd.com" });
  return (
    <SiteShell content={content} lang={lang}>
      <article className="wrap pt-[160px] pb-40">
        <div className="g12 gap-y-10">
          <header className="c1-4">
            <p className="label m-0 mb-6" data-reveal>{doc.updated}</p>
            <h1 className="title-l m-0" data-words>
              <RevealWords text={doc.title} />
            </h1>
          </header>
          <div className="c5-12 max-w-[720px]">
            <p className="m-0 text-[clamp(19px,1.6vw,23px)] leading-normal" data-reveal>{doc.intro}</p>
            {doc.sections.map((s, i) => (
              <section key={s.h} className="mt-14 border-t border-haze pt-8" data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
                <h2 className="title-m m-0">{s.h}</h2>
                {s.p.map((p, k) => (
                  <p key={k} className="mt-4 mb-0 text-slate">{p}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
