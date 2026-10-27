import type { Content } from "@/lib/content";
import { ui, type Lang } from "@/lib/i18n";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { Intro } from "./intro";
import { Education, Experiences, Faq, Profile, Projects, Skills } from "./sections";

export function HomePage({ content, lang }: { content: Content; lang: Lang }) {
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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-night focus:px-5 focus:py-3 focus:text-white"
      >
        {ui[lang].skip}
      </a>
      <Intro lang={lang} name={me.fullName} />
      <div id="top" className="sky">
        <Header lang={lang} cv={content.cv} />
        <main id="main">
          <Hero content={content} lang={lang} />
          <Profile content={content} lang={lang} />
          <Experiences content={content} lang={lang} />
          <Projects content={content} lang={lang} />
          <Skills content={content} lang={lang} />
          <Education content={content} lang={lang} />
          <Faq content={content} lang={lang} />
        </main>
        <Footer content={content} lang={lang} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    </>
  );
}
