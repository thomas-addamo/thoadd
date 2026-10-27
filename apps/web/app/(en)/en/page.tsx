import { HomePage } from "@/components/home-page";
import { getContent } from "@/lib/content";

// Pagina statica, rigenerata al massimo ogni ora (e subito quando manage pubblica).
export const revalidate = 3600;

export default async function Page() {
  return <HomePage content={await getContent()} lang="en" />;
}
