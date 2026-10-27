import type { Content } from "@thoadd/db/content";
import { ui, type Lang } from "@/lib/i18n";

export function cvUrl(cv: Content["cv"], lang: Lang) {
  if (!cv) return null;
  return lang === "en" ? cv.pdfEnUrl ?? cv.pdfItUrl : cv.pdfItUrl;
}

function DownloadIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M3 13h10" />
    </svg>
  );
}

// Finché non esiste un PDF pubblicato il pulsante resta nello stato "disattivo" del design.
export function DownloadCv({
  cv,
  lang,
  label,
  className,
  iconSize = 18,
  compact = false,
}: {
  cv: Content["cv"];
  lang: Lang;
  label: string;
  className: string;
  iconSize?: number;
  // Nella barra del telefono il testo si riduce a "CV", come nel design mobile.
  compact?: boolean;
}) {
  const href = cvUrl(cv, lang);
  const text = href ? label : ui[lang].cvSoon;
  const content = compact ? (
    <>
      <span className="hide-m">{text}</span>
      <span className="only-m" aria-hidden="true">CV</span>
      <span className="sr-only only-m">{text}</span>
    </>
  ) : (
    text
  );
  if (!href) {
    return (
      <a className={`pill ${className}`} aria-disabled="true" role="link">
        <DownloadIcon size={iconSize} />
        {content}
      </a>
    );
  }
  return (
    <a className={`pill ${className}`} href={href} download="Thomas-Addamo-CV.pdf">
      <DownloadIcon size={iconSize} />
      {content}
    </a>
  );
}
