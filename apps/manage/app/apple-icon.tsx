import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icona per la schermata Home di iPhone e Android: monogramma TA sul cielo di Atmosfera.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg, #ffffff, #dce3f7 45%, #8fa6e0)" }}>
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none" stroke="#111318" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 27 L21 5 L29 27" />
          <path d="M3 13 H23.9" />
          <path d="M10.5 13 V27" />
        </svg>
      </div>
    ),
    size,
  );
}
