import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "La tua privacy — thoadd";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ title: "La tua *privacy*", kicker: "Tutele e diritti" });
}
