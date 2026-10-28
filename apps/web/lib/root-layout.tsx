import type { Metadata, Viewport } from "next";
import { fontVariables } from "@thoadd/ui/fonts";
import { themeScript } from "@thoadd/ui/theme-script";
import { introScript } from "./intro-script";
import type { Lang } from "./i18n";
import { descriptions, pageMetadata } from "./seo";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0C14" },
  ],
};

export function siteMetadata(lang: Lang): Metadata {
  return {
    metadataBase: new URL("https://thoadd.com"),
    // Home: solo "Thomas Addamo"; le altre pagine: "Copyright · Thomas Addamo".
    title: { default: "Thomas Addamo", template: "%s · Thomas Addamo" },
    applicationName: "thoadd",
    authors: [{ name: "Thomas Addamo", url: "https://thoadd.com" }],
    creator: "Thomas Addamo",
    ...pageMetadata({ lang, path: "/", description: descriptions.home[lang] }),
  };
}

// I due layout radice (italiano su "/", inglese su "/en") differiscono solo per la lingua.
export function RootHtml({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + introScript }} />
      </head>
      <body className="m-0">{children}</body>
    </html>
  );
}
