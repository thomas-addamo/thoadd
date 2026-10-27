import sharp from "sharp";
import { put } from "@vercel/blob";
import type { Storage } from "./sections";

// Filigrana leggera "© thoadd" ripetuta in diagonale più una firma in basso a destra.
function watermarkSvg(width: number, height: number) {
  const size = Math.round(width / 22);
  const step = size * 9;
  const marks: string[] = [];
  for (let y = -height; y < height * 2; y += step) {
    for (let x = -width; x < width * 2; x += step * 1.6) {
      marks.push(`<text x="${x}" y="${y}" font-size="${size}">© thoadd</text>`);
    }
  }
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <g font-family="Helvetica, Arial, sans-serif" fill="#ffffff" fill-opacity="0.09" transform="rotate(-28 ${width / 2} ${height / 2})">${marks.join("")}</g>
      <text x="${width - size * 0.8}" y="${height - size * 0.8}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="${size}" fill="#ffffff" fill-opacity="0.55">© thoadd</text>
    </svg>`,
  );
}

export const blobStorage: Storage = {
  async saveImage(file, { maxWidth, watermark }) {
    let image = sharp(Buffer.from(await file.arrayBuffer())).rotate().resize({ width: maxWidth, withoutEnlargement: true });
    if (watermark) {
      const { data, info } = await image.toBuffer({ resolveWithObject: true });
      image = sharp(data).composite([{ input: watermarkSvg(info.width, info.height) }]);
    }
    // Niente metadati (posizione GPS, fotocamera) nei file pubblicati.
    const body = await image.webp({ quality: 82 }).toBuffer();
    const { url } = await put(`immagini/${crypto.randomUUID()}.webp`, body, { access: "public", contentType: "image/webp" });
    return url;
  },
  async saveFile(file) {
    const safe = file.name.normalize("NFD").replace(/[^\w.-]+/g, "-").slice(-80);
    const { url } = await put(`allegati/${crypto.randomUUID()}-${safe}`, file, { access: "public", contentType: file.type || "application/octet-stream" });
    return url;
  },
};
