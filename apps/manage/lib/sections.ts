import {
  certifications,
  education,
  experiences,
  faqs,
  languages,
  links,
  projects,
  skills,
  pathKinds,
  studyStatuses,
  type Localized,
  type ProjectFile,
  type ProjectImage,
  type ProjectLink,
} from "@thoadd/db";

type Base = { name: string; label: string; required?: boolean; hint?: string };
export type Field =
  | (Base & { kind: "text" | "url" | "email" | "slug" | "links" })
  | (Base & { kind: "image"; watermark?: boolean; maxWidth?: number })
  | (Base & { kind: "gallery" | "files" })
  | (Base & { kind: "localized"; long?: boolean })
  | (Base & { kind: "number" | "date" | "boolean" | "tags" })
  | (Base & { kind: "select"; options: { value: string; label: string }[] });

type Row = Record<string, unknown>;

export type SectionConfig = {
  slug: string;
  title: string;
  singular: string;
  table: typeof experiences | typeof projects | typeof skills | typeof languages | typeof education | typeof certifications | typeof links | typeof faqs;
  fields: Field[];
  summary: (row: Row) => string;
};

const it = (v: unknown) => (v as Localized | null)?.it ?? "";
const year = (v: unknown) => (typeof v === "string" ? v.slice(0, 4) : "");

const accentHint = "Le parole tra *asterischi* compaiono in corsivo blu.";

export const sections: SectionConfig[] = [
  {
    slug: "percorso",
    title: "Percorso",
    singular: "voce del percorso",
    table: experiences,
    fields: [
      {
        name: "kind",
        label: "Tipo",
        kind: "select",
        options: pathKinds.map((v) => ({ value: v, label: { attestato: "Attestato", qualifica: "Qualifica", attivita: "Attività", esperienza: "Esperienza" }[v] })),
      },
      { name: "role", label: "Titolo", kind: "localized", required: true, hint: "Ad esempio il nome dell'attestato, della qualifica o del ruolo." },
      { name: "company", label: "Ente o azienda", kind: "text", required: true },
      { name: "city", label: "Città", kind: "text" },
      { name: "employmentType", label: "Dettaglio", kind: "localized", hint: "Ad esempio tempo pieno, tirocinio, 40 ore, online." },
      { name: "startDate", label: "Inizio", kind: "date", required: true },
      { name: "endDate", label: "Fine", kind: "date", hint: "Vuoto = in corso (mostra \"oggi\"). Stessa data dell'inizio = solo l'anno." },
      { name: "description", label: "Descrizione", kind: "localized", long: true, hint: "Nel PDF ogni riga diventa un punto elenco." },
      { name: "technologies", label: "Tecnologie o competenze", kind: "tags", hint: "Separate da virgole." },
    ],
    summary: (r) => `${it(r.role)} · ${r.company} · ${year(r.startDate)}`,
  },
  {
    slug: "progetti",
    title: "Progetti",
    singular: "progetto",
    table: projects,
    fields: [
      { name: "title", label: "Nome", kind: "text", required: true },
      { name: "slug", label: "Indirizzo della pagina", kind: "slug", hint: "thoadd.com/progetti/… — se vuoto si crea dal nome." },
      { name: "kind", label: "Tipo", kind: "localized", hint: "Ad esempio app web, strumento interno." },
      { name: "year", label: "Anno", kind: "number" },
      { name: "summary", label: "Descrizione breve", kind: "localized", long: true, required: true, hint: "Compare nella card in home e in cima alla pagina." },
      {
        name: "body",
        label: "Pagina del progetto",
        kind: "localized",
        long: true,
        hint: "## Titoletto · - punto elenco · **grassetto** · *corsivo blu* · [testo](https://link). Una riga vuota separa i paragrafi.",
      },
      { name: "imageUrl", label: "Immagine di copertina", kind: "image", maxWidth: 2000, hint: "JPG, PNG o WebP fino a 4 MB. Senza immagine si usa la sfumatura del design." },
      { name: "gallery", label: "Galleria", kind: "gallery", hint: "Puoi sceglierne più di una alla volta, ognuna fino a 4 MB." },
      { name: "url", label: "Sito del progetto", kind: "url" },
      { name: "repoUrl", label: "Repository", kind: "url" },
      { name: "links", label: "Altri link", kind: "links", hint: "Uno per riga: Testo | https://indirizzo" },
      { name: "attachments", label: "Allegati", kind: "files", hint: "PDF, documenti, archivi o immagini fino a 4 MB ciascuno." },
      { name: "technologies", label: "Tecnologie", kind: "tags", hint: "Separate da virgole." },
      { name: "featured", label: "In evidenza", kind: "boolean" },
    ],
    summary: (r) => `${r.title} · ${it(r.kind)} ${r.year ?? ""}`,
  },
  {
    slug: "competenze",
    title: "Competenze",
    singular: "competenza",
    table: skills,
    fields: [
      { name: "name", label: "Nome", kind: "text", required: true },
      {
        name: "level",
        label: "Livello (colore)",
        kind: "select",
        options: [
          { value: "3", label: "Uso ogni giorno (nero)" },
          { value: "2", label: "Conosco bene (blu)" },
          { value: "1", label: "Sto approfondendo (grigio)" },
        ],
      },
      {
        name: "size",
        label: "Dimensione",
        kind: "select",
        options: [
          { value: "3", label: "Grande" },
          { value: "2", label: "Media" },
          { value: "1", label: "Piccola" },
        ],
      },
      { name: "accent", label: "In corsivo serif", kind: "boolean" },
      { name: "category", label: "Categoria", kind: "text", hint: "Facoltativa, per il PDF." },
    ],
    summary: (r) => String(r.name),
  },
  {
    slug: "lingue",
    title: "Lingue",
    singular: "lingua",
    table: languages,
    fields: [
      { name: "name", label: "Lingua", kind: "localized", required: true },
      {
        name: "level",
        label: "Livello",
        kind: "select",
        options: ["native", "C2", "C1", "B2", "B1", "A2", "A1"].map((v) => ({ value: v, label: v === "native" ? "Madrelingua" : v })),
      },
    ],
    summary: (r) => `${it(r.name)} · ${r.level}`,
  },
  {
    slug: "studi",
    title: "Studi",
    singular: "percorso di studio",
    table: education,
    fields: [
      {
        name: "status",
        label: "Stato",
        kind: "select",
        options: studyStatuses.map((v) => ({ value: v, label: { completato: "Completato", in_corso: "In corso", in_programma: "In programma (futuro)" }[v] })),
      },
      { name: "title", label: "Titolo", kind: "localized", required: true, hint: `Ad esempio "Laurea in *Ingegneria informatica*". ${accentHint}` },
      { name: "description", label: "Descrizione", kind: "localized", long: true, hint: "Facoltativa: perché questa scelta, che cosa vuoi imparare." },
      { name: "school", label: "Istituto", kind: "text", required: true },
      { name: "city", label: "Città", kind: "text" },
      { name: "startYear", label: "Anno di inizio", kind: "number" },
      { name: "endYear", label: "Anno di fine", kind: "number" },
      { name: "grade", label: "Voto", kind: "text" },
    ],
    summary: (r) => `${it(r.title).replaceAll("*", "")} · ${r.school} · ${String(r.status).replace("_", " ")}`,
  },
  {
    slug: "certificazioni",
    title: "Certificazioni",
    singular: "certificazione",
    table: certifications,
    fields: [
      { name: "name", label: "Nome", kind: "text", required: true },
      { name: "issuer", label: "Ente", kind: "text" },
      { name: "issuedOn", label: "Data", kind: "date" },
      { name: "url", label: "Link di verifica", kind: "url" },
    ],
    summary: (r) => `${r.name} · ${r.issuer ?? ""}`,
  },
  {
    slug: "link",
    title: "Link",
    singular: "link",
    table: links,
    fields: [
      {
        name: "kind",
        label: "Tipo",
        kind: "select",
        options: ["linkedin", "github", "instagram", "sito", "altro"].map((v) => ({ value: v, label: v })),
      },
      { name: "label", label: "Testo mostrato", kind: "text", required: true },
      { name: "url", label: "Indirizzo", kind: "url", required: true },
    ],
    summary: (r) => `${r.label} · ${r.url}`,
  },
  {
    slug: "domande",
    title: "Domande",
    singular: "domanda",
    table: faqs,
    fields: [
      { name: "question", label: "Domanda", kind: "localized", required: true },
      { name: "answer", label: "Risposta", kind: "localized", long: true, required: true },
    ],
    summary: (r) => it(r.question),
  },
];

export const findSection = (slug: string) => sections.find((s) => s.slug === slug);

export const profileFields: Field[] = [
  { name: "fullName", label: "Nome completo", kind: "text", required: true, hint: "La seconda parola compare in corsivo blu." },
  { name: "role", label: "Ruolo", kind: "localized", required: true },
  { name: "status", label: "Disponibilità", kind: "localized", hint: "Ad esempio \"disponibile da gennaio 2027\"." },
  { name: "available", label: "Mostra l'etichetta di disponibilità", kind: "boolean" },
  { name: "tagline", label: "Frase principale (hero)", kind: "localized", long: true, required: true, hint: accentHint },
  { name: "lookingFor", label: "Che cosa cerchi (hero)", kind: "localized", long: true },
  { name: "headline", label: "Titolo del profilo", kind: "localized", hint: accentHint },
  { name: "bio", label: "Bio", kind: "localized", long: true, required: true },
  { name: "bioPersonal", label: "Paragrafo personale", kind: "localized", long: true },
  { name: "currentRole", label: "Ruolo attuale", kind: "text", hint: "Ad esempio \"Developer · Azienda\"." },
  { name: "focus", label: "Focus", kind: "localized" },
  { name: "seeking", label: "Cerco", kind: "localized" },
  { name: "workMode", label: "Modalità di lavoro", kind: "localized" },
  { name: "city", label: "Città", kind: "text" },
  { name: "email", label: "Email pubblica", kind: "email" },
  {
    name: "photoUrl",
    label: "Foto",
    kind: "image",
    watermark: true,
    maxWidth: 900,
    hint: "JPG, PNG o WebP fino a 4 MB, meglio verticale 4:5. Viene ridotta e riceve la filigrana © thoadd. Senza foto si usa il segnaposto del design.",
  },
];

// Trasforma i campi del modulo nei valori da salvare; restituisce gli errori per campo.
export function parseFields(fields: Field[], form: FormData) {
  const values: Row = {};
  const errors: string[] = [];
  for (const f of fields) {
    const raw = (form.get(f.name) as string | null)?.trim() ?? "";
    switch (f.kind) {
      case "localized": {
        const itText = (form.get(`${f.name}.it`) as string | null)?.trim() ?? "";
        const enText = (form.get(`${f.name}.en`) as string | null)?.trim() ?? "";
        if (f.required && !itText) errors.push(`${f.label}: il testo italiano è obbligatorio`);
        values[f.name] = itText ? { it: itText, ...(enText ? { en: enText } : {}) } : f.required ? { it: "" } : null;
        break;
      }
      case "boolean":
        values[f.name] = form.get(f.name) === "on";
        break;
      case "number": {
        if (raw && !/^-?\d+$/.test(raw)) errors.push(`${f.label}: serve un numero intero`);
        values[f.name] = raw ? Number(raw) : null;
        break;
      }
      case "tags":
        values[f.name] = raw ? raw.split(",").map((t) => t.trim()).filter(Boolean) : [];
        break;
      case "image":
        // Il file nuovo (se c'è) viene caricato da uploadImages; qui resta l'immagine attuale.
        values[f.name] = form.get(`${f.name}__remove`) === "on" ? null : raw || null;
        break;
      case "url":
        if (raw && !/^(https?:\/\/|mailto:|#)/.test(raw)) errors.push(`${f.label}: deve iniziare con https://`);
        values[f.name] = raw || null;
        break;
      case "slug": {
        const slug = slugify(raw || String(form.get("title") ?? ""));
        if (!slug) errors.push(`${f.label}: serve almeno una lettera o un numero`);
        values[f.name] = slug || null;
        break;
      }
      case "links": {
        const list: ProjectLink[] = [];
        for (const line of raw.split("\n").map((l) => l.trim()).filter(Boolean)) {
          const [label, url] = line.includes("|") ? line.split("|").map((x) => x.trim()) : [line.replace(/^https?:\/\//, ""), line];
          if (!/^https?:\/\//.test(url)) errors.push(`${f.label}: "${line}" non ha un indirizzo https://`);
          else list.push({ label: label || url, url });
        }
        values[f.name] = list;
        break;
      }
      case "gallery":
      case "files": {
        // Si tengono le voci attuali non spuntate in "Rimuovi"; i file nuovi li aggiunge uploadFiles.
        const removed = new Set(form.getAll(`${f.name}__remove`).map(String));
        values[f.name] = form
          .getAll(`${f.name}__keep`)
          .map((v) => JSON.parse(String(v)) as ProjectImage | ProjectFile)
          .filter((item) => !removed.has(item.url));
        break;
      }
      case "select":
        values[f.name] = ["level", "size"].includes(f.name) && /^\d$/.test(raw) ? Number(raw) : raw;
        break;
      default:
        values[f.name] = raw || null;
    }
    if (f.required && !["localized", "boolean", "slug", "gallery", "files", "links"].includes(f.kind) && !raw) errors.push(`${f.label}: campo obbligatorio`);
  }
  return { values, errors };
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE = 4 * 1024 * 1024;

export type Storage = {
  saveImage: (file: File, options: { maxWidth: number; watermark: boolean }) => Promise<string>;
  saveFile: (file: File) => Promise<string>;
};

// Carica i file scelti nei campi immagine, galleria e allegati e aggiorna i valori.
export async function uploadFiles(fields: Field[], form: FormData, values: Row, errors: string[], storage: Storage) {
  const chosen = (name: string) => form.getAll(name).filter((f): f is File => f instanceof File && f.size > 0);
  const tooBig = (f: Field, file: File) => file.size > MAX_FILE && errors.push(`${f.label}: "${file.name}" supera 4 MB`);

  for (const f of fields) {
    if (f.kind === "image") {
      const [file] = chosen(`${f.name}__file`);
      if (!file || tooBig(f, file)) continue;
      if (!imageTypes.includes(file.type)) {
        errors.push(`${f.label}: usa un file JPG, PNG, WebP o AVIF`);
        continue;
      }
      values[f.name] = await storage.saveImage(file, { maxWidth: f.maxWidth ?? 2000, watermark: f.watermark ?? false });
    }
    if (f.kind === "gallery") {
      const list = values[f.name] as ProjectImage[];
      for (const file of chosen(`${f.name}__files`)) {
        if (tooBig(f, file)) continue;
        if (!imageTypes.includes(file.type)) {
          errors.push(`${f.label}: "${file.name}" non è un'immagine JPG, PNG, WebP o AVIF`);
          continue;
        }
        list.push({ url: await storage.saveImage(file, { maxWidth: 2000, watermark: false }), alt: "" });
      }
    }
    if (f.kind === "files") {
      const list = values[f.name] as ProjectFile[];
      for (const file of chosen(`${f.name}__files`)) {
        if (tooBig(f, file)) continue;
        list.push({ name: file.name, url: await storage.saveFile(file), size: file.size });
      }
    }
  }
}
