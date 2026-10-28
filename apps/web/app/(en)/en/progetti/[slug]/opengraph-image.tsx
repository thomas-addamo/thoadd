import { loadPublishedContent } from "@thoadd/db/content";
import { tr } from "@/lib/i18n";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

const lang = "en";
export const alt = "Project — thoadd";
export const size = ogSize;
export const contentType = ogContentType;

// Ogni progetto ha la sua anteprima: titolo, tipo e anno.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (await loadPublishedContent()).projects.find((x) => x.slug === slug);
  return renderOgImage({
    title: p?.title ?? "Project",
    kicker: ["Project", p && tr(p.kind, lang), p?.year].filter(Boolean).join(" · "),
  });
}
