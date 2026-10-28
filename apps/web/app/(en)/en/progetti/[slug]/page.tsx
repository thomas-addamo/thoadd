import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPublishedContent } from "@thoadd/db/content";
import { ProjectPage } from "@/components/project-page";
import { tr } from "@/lib/i18n";
import { pageMetadata, plain } from "@/lib/seo";

const lang = "en";
export const revalidate = 3600;

export async function generateStaticParams() {
  const content = await loadPublishedContent();
  return content.projects.filter((p) => p.slug).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await loadPublishedContent()).projects.find((x) => x.slug === slug);
  if (!p) return {};
  return pageMetadata({ lang, path: `/progetti/${slug}`, title: p.title, description: plain(tr(p.summary, lang)) });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await loadPublishedContent();
  if (!content.projects.some((p) => p.slug === slug)) notFound();
  return <ProjectPage content={content} lang={lang} slug={slug} />;
}
