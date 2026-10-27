import type { Metadata } from "next";
import { fontVariables } from "@thoadd/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "manage · thoadd",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables}>
      <body className="m-0">{children}</body>
    </html>
  );
}
