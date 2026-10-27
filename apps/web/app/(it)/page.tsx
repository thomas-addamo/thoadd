import { HomePage } from "@/components/home-page";
import { loadPublishedContent } from "@thoadd/db/content";

// Pagina statica, rigenerata al massimo ogni ora (e subito quando manage pubblica).
export const revalidate = 3600;

export default async function Page() {
  return <HomePage content={await loadPublishedContent()} lang="it" />;
}
