import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@thoadd/ui", "@thoadd/db"],
};

export default nextConfig;
