import { cvDownloads, getDb } from "@thoadd/db";
import { latestVersion } from "@thoadd/db/content";

const bot = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp/i;

// Indirizzi fissi del CV: rispondono sempre con il PDF dell'ultima versione pubblicata.
export async function serveCv(request: Request, lang: "it" | "en") {
  const version = await latestVersion();
  const url = lang === "en" ? version?.pdfEnUrl ?? version?.pdfItUrl : version?.pdfItUrl;
  if (!version || !url) return new Response("Il CV non è ancora disponibile.", { status: 404 });

  const pdf = await fetch(url);
  if (!pdf.ok || !pdf.body) return new Response("Il CV non è raggiungibile, riprova tra poco.", { status: 502 });

  // Conteggio anonimo: lingua, versione e paese, nessun dato personale.
  if (!bot.test(request.headers.get("user-agent") ?? "")) {
    await getDb()
      .insert(cvDownloads)
      .values({ lang, versionId: version.id, country: request.headers.get("x-vercel-ip-country") })
      .catch((error) => console.error("Download non registrato", error));
  }

  const filename = lang === "en" ? "Thomas-Addamo-CV-EN.pdf" : "Thomas-Addamo-CV.pdf";
  return new Response(pdf.body, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
