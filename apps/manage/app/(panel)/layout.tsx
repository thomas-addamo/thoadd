import { Monogram } from "@thoadd/ui/monogram";
import { SidebarNav } from "@/components/sidebar-nav";
import { requireSession } from "@/lib/session";
import { sections } from "@/lib/sections";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const items = [
    { href: "/", label: "Panoramica" },
    { href: "/profilo", label: "Profilo" },
    ...sections.map((s) => ({ href: `/${s.slug}`, label: s.title })),
  ];

  return (
    <div className="min-h-svh bg-[linear-gradient(180deg,#fff,#f4f6fb_30%,#e9edf9)] md:grid md:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-10 flex flex-col gap-6 border-b border-haze bg-white/60 p-4 backdrop-blur-xl md:h-svh md:border-r md:border-b-0 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-3 text-ink no-underline">
            <Monogram size={28} />
            <span className="font-display text-[17px]">
              manage<em className="font-serif font-normal text-iris">.thoadd</em>
            </span>
          </a>
          <div className="flex items-center gap-3 text-[13px] md:hidden">
            <a href="https://thoadd.com" target="_blank" rel="noopener" className="text-iris">
              Sito ↗
            </a>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="rounded-full border border-haze px-3 py-1.5 text-ink">
                Esci
              </button>
            </form>
          </div>
        </div>
        <SidebarNav items={items} />
        <div className="mt-auto hidden flex-col gap-3 text-[13px] text-slate md:flex">
          <a href="https://thoadd.com" target="_blank" rel="noopener" className="text-iris">
            Apri thoadd.com ↗
          </a>
          <form action="/api/auth/logout" method="post" className="flex items-center justify-between gap-2">
            <span>@{session.login}</span>
            <button type="submit" className="rounded-full border border-haze px-3 py-1.5 text-ink hover:bg-white">
              Esci
            </button>
          </form>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-[1100px] p-4 md:p-10">{children}</main>
    </div>
  );
}
