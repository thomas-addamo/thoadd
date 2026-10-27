"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { asc, cvVersions, desc, eq, experiences, getDb, profile } from "@thoadd/db";
import { loadDraftContent, type CvContent } from "@thoadd/db/content";
import { renderCvPdf } from "@thoadd/cv-pdf";
import { put } from "@vercel/blob";
import { requireSession } from "@/lib/session";
import { findSection, parseFields, profileFields, uploadFiles } from "@/lib/sections";
import { blobStorage } from "@/lib/storage";

const back = (path: string, params: Record<string, string>) => redirect(`${path}?${new URLSearchParams(params)}`);

// Tutte le tabelle delle sezioni hanno id, position, visible e updatedAt: le trattiamo
// con la forma di una di esse; i valori sono già validati da parseFields.
type ListTable = typeof experiences;

function sectionOrThrow(slug: string) {
  const section = findSection(slug);
  if (!section) throw new Error(`Sezione sconosciuta: ${slug}`);
  return { section, t: section.table as unknown as ListTable };
}

export async function saveProfile(form: FormData) {
  await requireSession();
  const { values, errors } = parseFields(profileFields, form);
  await uploadFiles(profileFields, form, values, errors, blobStorage);
  if (errors.length) back("/profilo", { errore: errors.join(" · ") });
  await getDb()
    .update(profile)
    .set({ ...values, updatedAt: new Date() } as never)
    .where(eq(profile.id, 1));
  revalidatePath("/", "layout");
  back("/profilo", { ok: "Profilo salvato" });
}

export async function saveItem(slug: string, form: FormData) {
  await requireSession();
  const { section, t } = sectionOrThrow(slug);
  const { values, errors } = parseFields(section.fields, form);
  await uploadFiles(section.fields, form, values, errors, blobStorage);
  const id = Number(form.get("id")) || null;
  const path = `/${slug}`;
  if (errors.length) back(path, { errore: errors.join(" · "), ...(id ? { apri: String(id) } : { nuovo: "1" }) });

  const db = getDb();
  try {
    if (id) {
      await db.update(t).set({ ...values, updatedAt: new Date() } as never).where(eq(t.id, id));
    } else {
      const [last] = await db.select({ position: t.position }).from(t).orderBy(desc(t.position)).limit(1);
      await db.insert(t).values({ ...values, position: (last?.position ?? -1) + 1 } as never);
    }
  } catch (error) {
    // L'unico vincolo che un modulo può violare è l'indirizzo unico della pagina progetto.
    if (String((error as { cause?: unknown })?.cause ?? error).includes("unique")) {
      back(path, { errore: "Esiste già un progetto con questo indirizzo: cambialo", ...(id ? { apri: String(id) } : { nuovo: "1" }) });
    }
    throw error;
  }
  revalidatePath("/", "layout");
  back(path, { ok: "Salvato" });
}

export async function deleteItem(slug: string, id: number) {
  await requireSession();
  const { t } = sectionOrThrow(slug);
  await getDb().delete(t).where(eq(t.id, id));
  revalidatePath("/", "layout");
  back(`/${slug}`, { ok: "Eliminato" });
}

export async function toggleItem(slug: string, id: number, visible: boolean) {
  await requireSession();
  const { t } = sectionOrThrow(slug);
  await getDb().update(t).set({ visible }).where(eq(t.id, id));
  revalidatePath("/", "layout");
}

// Scambia la posizione con l'elemento sopra o sotto, poi rinumera da 0.
export async function moveItem(slug: string, id: number, direction: -1 | 1) {
  await requireSession();
  const { t } = sectionOrThrow(slug);
  const db = getDb();
  const rows = await db.select({ id: t.id }).from(t).orderBy(asc(t.position), asc(t.id));
  const i = rows.findIndex((r) => r.id === id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= rows.length) return;
  [rows[i], rows[j]] = [rows[j], rows[i]];
  await Promise.all(rows.map((r, position) => db.update(t).set({ position }).where(eq(t.id, r.id))));
  revalidatePath("/", "layout");
}

async function revalidateWebsite() {
  const url = process.env.WEB_URL ?? "https://thoadd.com";
  try {
    const res = await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.REVALIDATE_SECRET}` },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// I due PDF della versione, caricati su Vercel Blob con un nome che non cambia più.
async function buildPdfs(versionId: number, snapshot: CvContent) {
  const fontBaseUrl = `${process.env.WEB_URL ?? "https://thoadd.com"}/fonts`;
  const [it, en] = await Promise.all([
    renderCvPdf(snapshot, "it", { fontBaseUrl }),
    renderCvPdf(snapshot, "en", { fontBaseUrl }),
  ]);
  const upload = (lang: string, body: Buffer) =>
    put(`cv/versione-${versionId}-${lang}.pdf`, body, { access: "public", contentType: "application/pdf", addRandomSuffix: false, allowOverwrite: true });
  const [pdfIt, pdfEn] = await Promise.all([upload("it", it), upload("en", en)]);
  return { pdfItUrl: pdfIt.url, pdfEnUrl: pdfEn.url };
}

// "Pubblica": fotografa la bozza in una nuova versione, crea i PDF e aggiorna subito thoadd.com.
export async function publish() {
  await requireSession();
  const db = getDb();
  const snapshot = await loadDraftContent();
  const [version] = await db.insert(cvVersions).values({ snapshot }).returning({ id: cvVersions.id });

  let pdfError = false;
  try {
    await db.update(cvVersions).set(await buildPdfs(version.id, snapshot)).where(eq(cvVersions.id, version.id));
  } catch (error) {
    console.error("PDF non generato", error);
    pdfError = true;
  }

  const live = await revalidateWebsite();
  revalidatePath("/", "layout");
  if (pdfError) back("/", { errore: "Sito aggiornato, ma il PDF non è stato creato: premi di nuovo Pubblica" });
  back("/", live ? { ok: "Pubblicato su thoadd.com, PDF compresi" } : { errore: "Versione salvata, ma thoadd.com non si è aggiornato: riprova tra poco" });
}

// Rimette online una versione precedente creando una nuova versione identica.
export async function restoreVersion(id: number) {
  await requireSession();
  const db = getDb();
  const [old] = await db.select().from(cvVersions).where(eq(cvVersions.id, id)).limit(1);
  if (!old) back("/", { errore: "Versione non trovata" });
  await db.insert(cvVersions).values({ snapshot: old.snapshot, pdfItUrl: old.pdfItUrl, pdfEnUrl: old.pdfEnUrl });
  const live = await revalidateWebsite();
  revalidatePath("/", "layout");
  back("/", live ? { ok: `Versione ${id} di nuovo online` } : { errore: "Versione ripristinata, ma thoadd.com non si è aggiornato" });
}
