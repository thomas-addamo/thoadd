import type { Metadata } from "next";
import { fontVariables } from "@thoadd/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thoadd.com"),
  title: "Thomas Addamo · Software Developer",
  description: "Il CV di Thomas Addamo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables}>
      <body className="m-0">{children}</body>
    </html>
  );
}
