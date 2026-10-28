import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Copyright e marchio — thoadd";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ title: "Copyright e *marchio*", kicker: "Tutele e diritti" });
}
