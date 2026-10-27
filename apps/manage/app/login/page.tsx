import { Monogram } from "@thoadd/ui/monogram";

const errors: Record<string, string> = {
  account: "Questo account GitHub non ha accesso al pannello.",
  stato: "La sessione di accesso è scaduta: riprova.",
  github: "GitHub non ha confermato l'accesso: riprova.",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ errore?: string }> }) {
  const { errore } = await searchParams;
  return (
    <main className="bg-atmosfera flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[var(--radius-sheet)] bg-cloud/80 p-10 text-center shadow-[var(--shadow-sheet)] backdrop-blur">
        <Monogram size={40} className="mx-auto" title="thoadd" />
        <h1 className="font-display mt-6 mb-0 text-[32px] font-light tracking-[-0.02em]">
          manage<em className="font-serif font-normal text-iris">.thoadd</em>
        </h1>
        <p className="mt-3 mb-8 text-slate">Il pannello per gestire il CV di thoadd.com.</p>
        {errore && (
          <p role="alert" className="mb-6 rounded-2xl bg-dawn/60 px-4 py-3 text-[15px]">
            {errors[errore] ?? "Accesso non riuscito."}
          </p>
        )}
        <a href="/api/auth/login" className="inline-flex h-14 items-center gap-3 rounded-full bg-pill px-7 font-medium text-pill-ink no-underline">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          Accedi con GitHub
        </a>
      </div>
    </main>
  );
}
