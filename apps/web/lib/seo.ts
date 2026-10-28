import type { Metadata } from "next";
import { localePath, type Lang } from "./i18n";

// Toglie gli *asterischi* del corsivo e accorcia a una frase da anteprima (≤ 160 caratteri).
export function plain(text: string, max = 160) {
  const clean = text.replace(/\*([^*]+)\*/g, "$1").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : clean;
}

export const descriptions = {
  home: {
    it: "Percorso, progetti, studi e competenze di Thomas Addamo. Scarica il CV in PDF.",
    en: "Thomas Addamo's journey, projects, studies and skills. Download the CV as a PDF.",
  },
  copyright: {
    it: "Diritti d'autore, marchio thoadd e tutela della fotografia e dei contenuti di Thomas Addamo.",
    en: "Copyright, the thoadd trademark and the protection of Thomas Addamo's photograph and content.",
  },
  privacy: {
    it: "Quali dati raccoglie thoadd.com (pochissimi, senza cookie di profilazione) e come esercitare i tuoi diritti.",
    en: "What data thoadd.com collects (very little, no profiling cookies) and how to exercise your rights.",
  },
};

// Titolo, descrizione, lingue alternative e anteprima social di una pagina.
// L'immagine di condivisione arriva dal file opengraph-image.tsx della stessa cartella.
export function pageMetadata({ lang, path, title, description }: { lang: Lang; path: string; title?: string; description: string }): Metadata {
  const url = localePath(lang, path);
  const shareTitle = title ? `${title} · Thomas Addamo` : "Thomas Addamo";
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages: { it: localePath("it", path), en: localePath("en", path), "x-default": localePath("it", path) } },
    openGraph: {
      type: path === "/" ? "profile" : "website",
      url,
      siteName: "thoadd",
      title: shareTitle,
      description,
      locale: lang === "en" ? "en_GB" : "it_IT",
      alternateLocale: lang === "en" ? "it_IT" : "en_GB",
    },
    twitter: { card: "summary_large_image", title: shareTitle, description },
  };
}
