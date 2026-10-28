import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Your privacy — thoadd";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ title: "Your *privacy*", kicker: "Protection and rights" });
}
