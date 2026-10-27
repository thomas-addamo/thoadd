import { Monogram } from "@thoadd/ui/monogram";

// Pagina provvisoria finché la home completa (fase 3) non è pronta.
export default function Home() {
  return (
    <main className="bg-atmosfera relative flex min-h-svh flex-col overflow-hidden">
      <header className="flex items-center gap-3 px-6 pt-8 md:px-20">
        <Monogram size={28} title="Thomas Addamo" />
        <span className="font-display text-[17px]">Thomas Addamo</span>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-[28vw] text-center">
        <h1 className="font-display m-0 text-[52px] font-light leading-[0.95] tracking-[-0.03em] md:text-[96px]">
          Thomas <em className="font-serif font-normal text-iris">Addamo</em>
        </h1>
        <p className="mt-6 text-[17px] text-slate">Software Developer</p>
        <p className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-haze bg-cloud/60 py-2 pr-4 pl-3 text-[13px] text-slate">
          <span className="size-2 rounded-full bg-iris shadow-[0_0_0_4px_rgb(143_166_224/0.35)]" />
          Il sito è in costruzione
        </p>
      </section>

      <p
        aria-hidden="true"
        className="font-display pointer-events-none absolute inset-x-0 bottom-[-0.24em] m-0 select-none whitespace-nowrap text-center text-[26vw] font-light leading-none tracking-[-0.05em] text-white/70 [mask-image:linear-gradient(180deg,#000_30%,transparent_92%)]"
      >
        thoadd
      </p>
    </main>
  );
}
