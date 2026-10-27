import { Fragment } from "react";

// "Dove ho *imparato* il mestiere" → la parola tra asterischi in Instrument Serif corsivo.
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
