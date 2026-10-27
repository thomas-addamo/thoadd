import type { MetadataRoute } from "next";

// I crawler per l'addestramento di modelli AI sono esclusi (riserva TDM, vedi /copyright).
const aiCrawlers = ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "Google-Extended", "CCBot", "PerplexityBot", "Bytespider", "Applebot-Extended", "meta-externalagent"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/foto", "/anteprima", "/api/"] },
      { userAgent: aiCrawlers, disallow: "/" },
    ],
  };
}
