import type { Content } from "@thoadd/db/content";
import { ui, type Lang } from "@/lib/i18n";
import { Footer } from "./footer";
import { Header } from "./header";
import { Interactions } from "./interactions";
import { ScrollTop } from "./scroll-top";

export const githubUrl = (content: Content) => content.links.find((l) => l.kind === "github")?.url ?? "https://github.com/thomas-addamo";

// Cornice comune a home, pagine dei progetti e pagine legali.
export function SiteShell({ content, lang, onHome = false, children }: { content: Content; lang: Lang; onHome?: boolean; children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-pill focus:px-5 focus:py-3 focus:text-pill-ink"
      >
        {ui[lang].skip}
      </a>
      <div id="top" className="sky">
        <Header lang={lang} cv={content.cv} github={githubUrl(content)} onHome={onHome} />
        <main id="main">{children}</main>
        <Footer content={content} lang={lang} onHome={onHome} />
      </div>
      <ScrollTop label={ui[lang].scrollTop} />
      <Interactions />
    </>
  );
}
