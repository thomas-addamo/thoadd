import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@thoadd/ui", "@thoadd/db"],
  // I font servono anche alle immagini di condivisione generate sul server.
  outputFileTracingIncludes: { "/**": ["./public/fonts/**"] },
  // L'anteprima può stare solo dentro manage.thoadd.com; il resto del sito in nessun iframe.
  async headers() {
    return [
      {
        source: "/anteprima",
        headers: [{ key: "Content-Security-Policy", value: "frame-ancestors https://manage.thoadd.com http://localhost:3001" }],
      },
      {
        source: "/((?!anteprima).*)",
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
    ];
  },
};

export default nextConfig;
