import { latestVersion, loadDraftContent, type CvContent } from "@thoadd/db/content";

export const dynamic = "force-dynamic";

const allowedHosts = ["thoadd.com", "www.thoadd.com", "manage.thoadd.com", "localhost"];

// La foto del profilo passa da qui: nessun indirizzo diretto al file, niente
// indicizzazione e niente uso da altri siti (serve un referer di thoadd.com).
export async function GET(request: Request) {
  const referer = request.headers.get("referer");
  const host = referer ? new URL(referer).hostname : null;
  if (!host || !allowedHosts.includes(host)) return new Response("Non disponibile.", { status: 403 });

  // In anteprima (iframe di manage) si usa la bozza.
  const token = new URL(request.url).searchParams.get("token");
  const draft = token && token === process.env.PREVIEW_SECRET;
  const version = draft ? null : await latestVersion();
  const profile = version ? (version.snapshot as CvContent).profile : (await loadDraftContent()).profile;
  if (!profile.photoUrl) return new Response("Nessuna foto.", { status: 404 });

  const photo = await fetch(profile.photoUrl);
  if (!photo.ok || !photo.body) return new Response("Foto non raggiungibile.", { status: 502 });

  return new Response(photo.body, {
    headers: {
      "content-type": photo.headers.get("content-type") ?? "image/webp",
      "content-disposition": "inline",
      "cache-control": "private, max-age=3600",
      "x-robots-tag": "noindex, noimageindex, noarchive",
      "cross-origin-resource-policy": "same-site",
    },
  });
}
