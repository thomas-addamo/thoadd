import type { Metadata } from "next";
import { loadPublishedContent } from "@thoadd/db/content";
import { LegalPage } from "@/components/legal-page";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Privacy · Thomas Addamo", alternates: { canonical: "/privacy" } };

export default async function Page() {
  return <LegalPage content={await loadPublishedContent()} lang="it" kind="privacy" />;
}
