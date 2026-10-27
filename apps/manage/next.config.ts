import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@thoadd/ui", "@thoadd/db", "@thoadd/cv-pdf"],
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    // Foto e immagini dei progetti passano dai moduli: fino a 4 MB (il limite di Vercel è 4,5).
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
