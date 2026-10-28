import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "thoadd — Thomas Addamo";
export const size = ogSize;
export const contentType = ogContentType;

// Home: solo il marchio thoadd.
export default function Image() {
  return renderOgImage({});
}
