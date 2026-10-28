import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Immagine di anteprima quando si condivide un link (WhatsApp, LinkedIn, X, Telegram…):
// lo stesso cielo del footer, "thoadd" gigante tagliato dal bordo e il titolo della pagina.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontsDir = join(process.cwd(), "public/fonts");
const font = (file: string) => readFile(join(fontsDir, file));

// Instrument Serif corsivo per le parole tra *asterischi*; se Google non risponde si usa Clash.
async function instrumentItalic() {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1").then((r) => r.text());
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    return url ? await fetch(url).then((r) => r.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

function Monogram({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="#111318" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 27 L21 5 L29 27" />
      <path d="M3 13 H23.9" />
      <path d="M10.5 13 V27" />
    </svg>
  );
}

export async function renderOgImage({ title, kicker }: { title?: string; kicker?: string }) {
  const [light, regular, sans, serif] = await Promise.all([
    font("ClashDisplay-Light.otf"),
    font("ClashDisplay-Regular.otf"),
    font("GeneralSans-Regular.otf"),
    instrumentItalic(),
  ]);

  const parts = (title ?? "").split(/\*([^*]+)\*/g);
  const wordSize = 372;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "General Sans",
          color: "#111318",
          background:
            "radial-gradient(60% 70% at 0% 100%, rgba(246,227,218,0.85), rgba(246,227,218,0) 70%), radial-gradient(50% 60% at 100% 0%, rgba(246,227,218,0.55), rgba(246,227,218,0) 70%), linear-gradient(180deg, #FFFFFF 0%, #DCE3F7 48%, #8FA6E0 100%)",
        }}
      >
        {/* Il nome gigante del footer, tagliato dal bordo inferiore. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: -wordSize * 0.25,
            display: "flex",
            justifyContent: "center",
            fontFamily: "Clash Display",
            fontWeight: 300,
            fontSize: wordSize,
            lineHeight: 1,
            letterSpacing: -wordSize * 0.05,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          thoadd
        </div>
        {/* La sfumatura che fa svanire il nome nel cielo, come la maschera del footer. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 150,
            display: "flex",
            background: "linear-gradient(180deg, rgba(143,166,224,0) 0%, rgba(143,166,224,0.9) 100%)",
          }}
        />

        <div style={{ position: "absolute", top: 56, left: 64, right: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Monogram size={46} />
            <div style={{ display: "flex", fontFamily: "Clash Display", fontWeight: 400, fontSize: 30 }}>Thomas Addamo</div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#5B6170" }}>thoadd.com</div>
        </div>

        {title && (
          <div style={{ position: "absolute", top: 150, left: 64, right: 64, display: "flex", flexDirection: "column" }}>
            {kicker && <div style={{ display: "flex", fontSize: 26, color: "#5B6170", marginBottom: 14 }}>{kicker}</div>}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                columnGap: 22,
                fontFamily: "Clash Display",
                fontWeight: 300,
                fontSize: title.length > 26 ? 68 : 92,
                lineHeight: 1.02,
                letterSpacing: -2.5,
              }}
            >
              {parts.map((part, i) =>
                i % 2 === 1 ? (
                  <span key={i} style={{ fontFamily: serif ? "Instrument Serif" : "Clash Display", fontStyle: "italic", fontWeight: 400, color: "#3D4FB8", letterSpacing: -1 }}>
                    {part}
                  </span>
                ) : (
                  part.trim() && <span key={i}>{part.trim()}</span>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Clash Display", data: light, weight: 300, style: "normal" },
        { name: "Clash Display", data: regular, weight: 400, style: "normal" },
        { name: "General Sans", data: sans, weight: 400, style: "normal" },
        ...(serif ? [{ name: "Instrument Serif", data: serif, weight: 400 as const, style: "italic" as const }] : []),
      ],
    },
  );
}
