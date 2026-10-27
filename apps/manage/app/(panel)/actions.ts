"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { asc, cvVersions, desc, eq, experiences, getDb, profile } from "@thoadd/db";
import { loadDraftContent } from "@thoadd/db/content";
import { requireSession } from "@/lib/session";
import { findSection, parseFields, profileFields } from "@/lib/sections";

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
  const id = Number(form.get("id")) || null;
  const path = `/${slug}`;
  if (errors.length) back(path, { errore: errors.join(" · "), ...(id ? { apri: String(id) } : { nuovo: "1" }) });

  const db = getDb();
  if (id) {
    await db.update(t).set({ ...values, updatedAt: new Date() } as never).where(eq(t.id, id));
  } else {
    const [last] = await db.select({ position: t.position }).from(t).orderBy(desc(t.position)).limit(1);
    await db.insert(t).values({ ...values, position: (last?.position ?? -1) + 1 } as never);
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

// "Pubblica": fotografa la bozza in una nuova versione e aggiorna subito thoadd.com.
export async function publish() {
  await requireSession();
  const snapshot = await loadDraftContent();
  await getDb().insert(cvVersions).values({ snapshot });
  const live = await revalidateWebsite();
  revalidatePath("/", "layout");
  back("/", live ? { ok: "Pubblicato su thoadd.com" } : { errore: "Versione salvata, ma thoadd.com non si è aggiornato: riprova tra poco" });
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
