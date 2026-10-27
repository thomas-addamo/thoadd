import type { Metadata } from "next";
import { fontVariables } from "@thoadd/ui/fonts";
import { themeScript } from "@thoadd/ui/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "manage · thoadd",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="m-0">{children}</body>
    </html>
  );
}
