import type { Metadata } from "next";
import { loadPublishedContent } from "@thoadd/db/content";
import { LegalPage } from "@/components/legal-page";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Copyright · Thomas Addamo", alternates: { canonical: "/en/copyright" } };

export default async function Page() {
  return <LegalPage content={await loadPublishedContent()} lang="en" kind="copyright" />;
}
