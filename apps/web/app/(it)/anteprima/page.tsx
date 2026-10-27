import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { latestVersion, loadDraftContent } from "@thoadd/db/content";
import { HomePage } from "@/components/home-page";

// La bozza com'è ora nel database, mostrata dentro manage.thoadd.com prima di "Pubblica".
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Preview({ searchParams }: { searchParams: Promise<{ token?: string; lang?: string }> }) {
  const { token, lang } = await searchParams;
  const secret = process.env.PREVIEW_SECRET;
  if (!secret || token !== secret) notFound();

  const [draft, cv] = await Promise.all([loadDraftContent(), latestVersion()]);
  return <HomePage content={{ ...draft, cv }} lang={lang === "en" ? "en" : "it"} intro={false} />;
}
