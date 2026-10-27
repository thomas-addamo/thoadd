import {
  certifications,
  education,
  experiences,
  faqs,
  languages,
  links,
  projects,
  skills,
  type Localized,
} from "@thoadd/db";

type Base = { name: string; label: string; required?: boolean; hint?: string };
export type Field =
  | (Base & { kind: "text" | "url" | "email" })
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
    slug: "esperienze",
    title: "Esperienze",
    singular: "esperienza",
    table: experiences,
    fields: [
      { name: "role", label: "Ruolo", kind: "localized", required: true },
      { name: "company", label: "Azienda", kind: "text", required: true },
      { name: "city", label: "Città", kind: "text" },
      { name: "employmentType", label: "Tipo di contratto", kind: "localized", hint: "Ad esempio tempo pieno, contratto, tirocinio." },
      { name: "startDate", label: "Inizio", kind: "date", required: true },
      { name: "endDate", label: "Fine", kind: "date", hint: "Vuoto = in corso (mostra \"oggi\")." },
      { name: "description", label: "Che cosa hai fatto", kind: "localized", long: true },
      { name: "technologies", label: "Tecnologie", kind: "tags", hint: "Separate da virgole." },
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
      { name: "kind", label: "Tipo", kind: "localized", hint: "Ad esempio app web, strumento interno." },
      { name: "year", label: "Anno", kind: "number" },
      { name: "summary", label: "Descrizione", kind: "localized", long: true, required: true },
      { name: "url", label: "Link al caso o al sito", kind: "url", hint: "Se c'è, compare \"Leggi il caso\"." },
      { name: "repoUrl", label: "Repository", kind: "url" },
      { name: "imageUrl", label: "Immagine (URL)", kind: "url", hint: "Vuoto = sfumatura del design." },
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
    slug: "formazione",
    title: "Formazione",
    singular: "titolo di studio",
    table: education,
    fields: [
      { name: "title", label: "Titolo", kind: "localized", required: true, hint: accentHint },
      { name: "school", label: "Istituto", kind: "text", required: true },
      { name: "city", label: "Città", kind: "text" },
      { name: "startYear", label: "Anno di inizio", kind: "number" },
      { name: "endYear", label: "Anno di fine", kind: "number" },
      { name: "grade", label: "Voto", kind: "text" },
    ],
    summary: (r) => `${it(r.title).replaceAll("*", "")} · ${r.school}`,
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
  { name: "photoUrl", label: "Foto (URL)", kind: "url", hint: "Vuoto = segnaposto del design." },
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
      case "url":
        if (raw && !/^(https?:\/\/|mailto:|#)/.test(raw)) errors.push(`${f.label}: deve iniziare con https://`);
        values[f.name] = raw || null;
        break;
      case "select":
        values[f.name] = ["level", "size"].includes(f.name) && /^\d$/.test(raw) ? Number(raw) : raw;
        break;
      default:
        values[f.name] = raw || null;
    }
    if (f.required && f.kind !== "localized" && f.kind !== "boolean" && !raw) errors.push(`${f.label}: campo obbligatorio`);
  }
  return { values, errors };
}
