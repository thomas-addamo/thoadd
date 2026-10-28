import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Copyright and trademark — thoadd";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ title: "Copyright and *trademark*", kicker: "Protection and rights" });
}
