import type { Metadata, Viewport } from "next";
import { fontVariables } from "@thoadd/ui/fonts";
import { introScript } from "@/components/intro";
import type { Lang } from "./i18n";

export const viewport: Viewport = { themeColor: "#F4F6FB" };

export function siteMetadata(lang: Lang): Metadata {
  const en = lang === "en";
  return {
    metadataBase: new URL("https://thoadd.com"),
    title: "Thomas Addamo · Software Developer",
    description: en
      ? "Thomas Addamo's CV: experience, projects and skills. Download the PDF."
      : "Il CV di Thomas Addamo: esperienze, progetti e competenze. Scarica il PDF.",
    alternates: {
      canonical: en ? "/en" : "/",
      languages: { it: "/", en: "/en" },
    },
    openGraph: {
      type: "profile",
      url: en ? "/en" : "/",
      siteName: "Thomas Addamo",
      locale: en ? "en_GB" : "it_IT",
    },
  };
}

// I due layout radice (italiano su "/", inglese su "/en") differiscono solo per la lingua.
export function RootHtml({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="m-0">{children}</body>
    </html>
  );
}
