import { count, cvDownloads, cvVersions, desc, eq, getDb, gte } from "@thoadd/db";
import { ConfirmButton } from "@/components/confirm-button";
import { Notice } from "@/components/fields";
import { PageTitle } from "@/components/page-title";
import { publish, restoreVersion } from "./actions";

export const dynamic = "force-dynamic";

const when = (d: Date) =>
  new Intl.DateTimeFormat("it-IT", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Rome" }).format(d);

export default async function Overview({ searchParams }: { searchParams: Promise<{ ok?: string; errore?: string; lingua?: string }> }) {
  const { ok, errore, lingua } = await searchParams;
  const lang = lingua === "en" ? "en" : "it";
  const db = getDb();
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [versions, [total], [lastMonth], [english]] = await Promise.all([
    db
      .select({ id: cvVersions.id, publishedAt: cvVersions.publishedAt, pdf: cvVersions.pdfItUrl })
      .from(cvVersions)
      .orderBy(desc(cvVersions.publishedAt))
      .limit(10),
    db.select({ n: count() }).from(cvDownloads),
    db.select({ n: count() }).from(cvDownloads).where(gte(cvDownloads.at, monthAgo)),
    db.select({ n: count() }).from(cvDownloads).where(eq(cvDownloads.lang, "en")),
  ]);
  const [current] = versions;

  const web = process.env.WEB_URL ?? "https://thoadd.com";
  const previewUrl = `${web}/anteprima?token=${encodeURIComponent(process.env.PREVIEW_SECRET ?? "")}&lang=${lang}`;

  return (
    <>
      <PageTitle title="Panoramica" note="Controlla la bozza nell'anteprima, poi pubblicala su thoadd.com." />
      <Notice ok={ok} error={errore} />

      <section className="mb-8 flex flex-col gap-5 rounded-[var(--radius-sheet)] bg-cloud p-6 shadow-[var(--shadow-sheet)] md:flex-row md:items-center md:p-8">
        <div className="flex-1">
          <p className="m-0 text-[13px] text-slate">Online su thoadd.com</p>
          <p className="font-display mt-1 mb-0 text-[24px]">
            {current ? `Versione ${current.id} · ${when(current.publishedAt)}` : "Nessuna pubblicazione: il sito mostra la bozza"}
          </p>
          {current?.pdf && (
            <p className="mt-2 mb-0 text-[13px]">
              <a href={`${web}/cv.pdf`} target="_blank" rel="noopener">thoadd.com/cv.pdf ↗</a>
              {" · "}
              <a href={`${web}/cv-en.pdf`} target="_blank" rel="noopener">cv-en.pdf ↗</a>
            </p>
          )}
        </div>
        <form action={publish}>
          <ConfirmButton
            message="Pubblicare la bozza attuale su thoadd.com?"
            className="inline-flex h-14 items-center rounded-full bg-night px-7 font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-pill)]"
          >
            Pubblica
          </ConfirmButton>
        </form>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Download del CV", value: total.n },
          { label: "Ultimi 30 giorni", value: lastMonth.n },
          { label: "In inglese", value: english.n },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--radius-card)] bg-cloud p-6 shadow-[var(--shadow-sheet)]">
            <p className="m-0 text-[13px] text-slate">{stat.label}</p>
            <p className="font-display mt-1 mb-0 text-[40px] leading-none font-light">{stat.value}</p>
          </div>
        ))}
        {current && !current.pdf && (
          <p className="col-span-full m-0 rounded-2xl bg-dawn px-5 py-3 text-[15px]">
            La versione online non ha ancora il PDF: premi Pubblica per crearlo.
          </p>
        )}
      </section>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="font-display m-0 text-[24px] font-normal">Anteprima della bozza</h2>
          <div className="flex rounded-full border border-haze bg-white/60 p-1 text-[13px]">
            {(["it", "en"] as const).map((code) => (
              <a
                key={code}
                href={`/?lingua=${code}`}
                aria-current={code === lang ? "true" : undefined}
                className={`grid h-9 min-w-11 place-items-center rounded-full no-underline ${code === lang ? "bg-white font-medium text-ink shadow-sm" : "text-slate"}`}
              >
                {code.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[var(--radius-sheet)] border border-haze bg-white shadow-[var(--shadow-sheet)]">
          <iframe src={previewUrl} title="Anteprima di thoadd.com con la bozza" className="block h-[70vh] w-full" />
        </div>
      </section>

      {versions.length > 0 && (
        <section>
          <h2 className="font-display mt-0 mb-3 text-[24px] font-normal">Versioni pubblicate</h2>
          <ol className="m-0 list-none divide-y divide-haze rounded-[var(--radius-card)] bg-cloud p-0 shadow-[var(--shadow-sheet)]">
            {versions.map((v) => (
              <li key={v.id} className="flex min-h-14 items-center gap-4 px-5">
                <span className="flex-1 text-[15px]">
                  Versione {v.id} · {when(v.publishedAt)}
                  {v.id === current?.id && <span className="ml-2 rounded-full bg-mist px-2.5 py-1 text-[12px] text-iris">online</span>}
                </span>
                {v.id !== current?.id && (
                  <form action={restoreVersion.bind(null, v.id)}>
                    <ConfirmButton message={`Rimettere online la versione ${v.id}?`} className="h-9 rounded-full border border-haze px-3.5 text-[13px] hover:border-iris">
                      Ripristina
                    </ConfirmButton>
                  </form>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
