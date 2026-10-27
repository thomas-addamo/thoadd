"use client";

// La foto si vede ma non si salva facilmente: niente <img>, niente tasto destro né
// trascinamento, un velo trasparente sopra e la filigrana "© thoadd" già impressa nel file.
// Uno screenshot resta sempre possibile: nessun sito può impedirlo.
export function ProtectedPhoto({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const block = (e: React.SyntheticEvent) => e.preventDefault();
  return (
    <div
      role="img"
      aria-label={alt}
      onContextMenu={block}
      onDragStart={block}
      className={`protected relative overflow-hidden bg-mist bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url("${src}")` }}
    >
      <div aria-hidden="true" className="absolute inset-0" onContextMenu={block} />
      <span aria-hidden="true" className="pointer-events-none absolute right-3 bottom-2 text-[11px] tracking-wide text-white/70 mix-blend-difference">
        © thoadd
      </span>
    </div>
  );
}
