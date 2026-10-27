import { Fragment } from "react";

// "Il mio *percorso*" → la parola tra asterischi in Instrument Serif corsivo.
export function Rich({ text, accentClass = "text-iris" }: { text: string; accentClass?: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className={`accent ${accentClass}`}>
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

// Come Rich, ma ogni parola entra da sola allo scroll (data-words, vedi globals.css).
export function RevealWords({ text, accentClass = "text-iris" }: { text: string; accentClass?: string }) {
  let i = 0;
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, p) =>
        part
          .split(/(\s+)/)
          .filter(Boolean)
          .map((word, k) =>
            /^\s+$/.test(word) ? (
              <Fragment key={`${p}-${k}`}> </Fragment>
            ) : (
              <span key={`${p}-${k}`} className="w" style={{ "--i": i++ } as React.CSSProperties}>
                {p % 2 === 1 ? <em className={`accent ${accentClass}`}>{word}</em> : word}
              </span>
            ),
          ),
      )}
    </>
  );
}
