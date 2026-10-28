import { HomePage } from "@/components/home-page";
import type { Metadata } from "next";
import { loadPublishedContent } from "@thoadd/db/content";
import { tr } from "@/lib/i18n";
import { descriptions, pageMetadata, plain } from "@/lib/seo";

// Pagina statica, rigenerata al massimo ogni ora (e subito quando manage pubblica).
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await loadPublishedContent();
  const tagline = plain(tr(profile.tagline, "en"));
  return pageMetadata({ lang: "en", path: "/", description: tagline ? `${tagline} ${descriptions.home.en}`.slice(0, 200) : descriptions.home.en });
}

export default async function Page() {
  return <HomePage content={await loadPublishedContent()} lang="en" />;
}
