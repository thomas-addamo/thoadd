import { RootHtml, siteMetadata } from "@/lib/root-layout";
import "../globals.css";

export { viewport } from "@/lib/root-layout";
export const metadata = siteMetadata("it");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootHtml lang="it">{children}</RootHtml>;
}
