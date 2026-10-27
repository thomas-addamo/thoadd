export function PageTitle({ title, note }: { title: string; note: string }) {
  return (
    <header className="mb-8">
      <h1 className="font-display m-0 text-[clamp(32px,3.5vw,48px)] font-light tracking-[-0.02em]">{title}</h1>
      <p className="mt-2 mb-0 text-slate">{note}</p>
    </header>
  );
}
