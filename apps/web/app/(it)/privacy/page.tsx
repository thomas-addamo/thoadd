import type { Metadata } from "next";
import { loadPublishedContent } from "@thoadd/db/content";
import { LegalPage } from "@/components/legal-page";
import { descriptions, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const metadata: Metadata = pageMetadata({ lang: "it", path: "/privacy", title: "Privacy", description: descriptions.privacy.it });

export default async function Page() {
  return <LegalPage content={await loadPublishedContent()} lang="it" kind="privacy" />;
}
