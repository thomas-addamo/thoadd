import type { Content } from "@thoadd/db/content";
import type { Lang } from "@/lib/i18n";
import { Hero } from "./hero";
import { Intro } from "./intro";
import { Faq, Journey, Profile, Projects, Skills, Studies } from "./sections";
import { SiteShell } from "./site-shell";

export function HomePage({ content, lang, intro = true, photoSrc = "/foto" }: { content: Content; lang: Lang; intro?: boolean; photoSrc?: string }) {
  const me = content.profile;
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: me.fullName,
    jobTitle: me.role.it,
    url: "https://thoadd.com",
    email: me.email ?? undefined,
    sameAs: content.links.filter((l) => l.url.startsWith("http")).map((l) => l.url),
  };

  return (
    <>
      {intro && <Intro lang={lang} />}
      <SiteShell content={content} lang={lang} onHome>
        <Hero content={content} lang={lang} />
        <Profile content={content} lang={lang} photoSrc={photoSrc} />
        <Journey content={content} lang={lang} />
        <Projects content={content} lang={lang} />
        <Skills content={content} lang={lang} />
        <Studies content={content} lang={lang} />
        <Faq content={content} lang={lang} />
      </SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    </>
  );
}
