import { notFound } from "next/navigation";
import { asc, experiences, getDb } from "@thoadd/db";
import { ConfirmButton } from "@/components/confirm-button";
import { Fields, Notice, SaveButton } from "@/components/fields";
import { PageTitle } from "@/components/page-title";
import { findSection, sections } from "@/lib/sections";
import { deleteItem, moveItem, saveItem, toggleItem } from "../actions";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.slug }));
}

const small = "grid size-9 place-items-center rounded-full border border-haze bg-cloud text-[15px] text-ink transition hover:border-iris disabled:opacity-30";

export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ ok?: string; errore?: string; apri?: string; nuovo?: string }>;
}) {
  const [{ section: slug }, query] = await Promise.all([params, searchParams]);
  const section = findSection(slug);
  if (!section) notFound();

  // Stessa forma per tutte le tabelle delle sezioni (id, position, visible).
  const t = section.table as unknown as typeof experiences;
  const rows = (await getDb().select().from(t).orderBy(asc(t.position), asc(t.id))) as unknown as Record<string, unknown>[];
  const save = saveItem.bind(null, slug);

  return (
    <>
      <PageTitle title={section.title} note="Le modifiche restano in bozza: vanno online quando premi Pubblica nella Panoramica." />
      <Notice ok={query.ok} error={query.errore} />

      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {rows.map((row, i) => {
          const id = row.id as number;
          const visible = row.visible as boolean;
          return (
            <li key={id} className={`rounded-[var(--radius-card)] bg-cloud shadow-[var(--shadow-sheet)] ${visible ? "" : "opacity-60"}`}>
              <details open={query.apri === String(id)}>
                <summary className="flex min-h-16 items-center gap-3 px-5 py-3">
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium">{section.summary(row)}</span>
                  {!visible && <span className="rounded-full bg-mist px-2.5 py-1 text-[12px] text-slate">Nascosto</span>}
                  <span className="text-[13px] text-iris">Modifica</span>
                </summary>
                <div className="border-t border-haze px-5 pt-5 pb-6">
                  <form action={save}>
                    <input type="hidden" name="id" value={id} />
                    <Fields fields={section.fields} values={row} idPrefix={`${slug}-${id}`} />
                    <div className="mt-6 flex justify-end">
                      <SaveButton />
                    </div>
                  </form>
                </div>
              </details>
              <div className="flex items-center gap-2 border-t border-haze px-5 py-2.5">
                <form action={moveItem.bind(null, slug, id, -1)}>
                  <button type="submit" className={small} disabled={i === 0} aria-label="Sposta su">↑</button>
                </form>
                <form action={moveItem.bind(null, slug, id, 1)}>
                  <button type="submit" className={small} disabled={i === rows.length - 1} aria-label="Sposta giù">↓</button>
                </form>
                <form action={toggleItem.bind(null, slug, id, !visible)}>
                  <button type="submit" className="h-9 rounded-full border border-haze bg-cloud px-3.5 text-[13px] text-ink hover:border-iris">
                    {visible ? "Nascondi" : "Mostra"}
                  </button>
                </form>
                <form action={deleteItem.bind(null, slug, id)} className="ml-auto">
                  <ConfirmButton
                    message={`Eliminare "${section.summary(row)}"? Non si può annullare.`}
                    className="h-9 rounded-full px-3.5 text-[13px] text-slate hover:bg-dawn hover:text-ink"
                  >
                    Elimina
                  </ConfirmButton>
                </form>
              </div>
            </li>
          );
        })}
      </ol>

      <details open={query.nuovo === "1" || rows.length === 0} className="mt-6 rounded-[var(--radius-card)] border border-dashed border-haze-strong bg-cloud/50">
        <summary className="flex min-h-14 items-center px-5 text-[15px] font-medium text-iris">+ Aggiungi {section.singular}</summary>
        <form action={save} className="border-t border-haze px-5 pt-5 pb-6">
          <Fields fields={section.fields} values={{}} idPrefix={`${slug}-nuovo`} />
          <div className="mt-6 flex justify-end">
            <SaveButton>Aggiungi</SaveButton>
          </div>
        </form>
      </details>
    </>
  );
}
