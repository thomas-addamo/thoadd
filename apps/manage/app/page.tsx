import { Monogram } from "@thoadd/ui/monogram";

// Segnaposto: login GitHub ed editor arrivano nella fase 4.
export default function ManageHome() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md rounded-[var(--radius-sheet)] bg-cloud p-10 text-center shadow-[var(--shadow-sheet)]">
        <Monogram size={40} className="mx-auto" title="thoadd" />
        <h1 className="font-display mt-6 mb-0 text-[32px] font-light tracking-[-0.02em]">
          manage<em className="font-serif font-normal text-iris">.thoadd</em>
        </h1>
        <p className="mt-3 text-slate">Pannello in arrivo.</p>
      </div>
    </main>
  );
}
