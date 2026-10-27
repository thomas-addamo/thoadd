import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Ogni testo visibile esiste in italiano (predefinito) e, se compilato, in inglese.
// Le parole tra *asterischi* vengono mostrate in Instrument Serif corsivo.
export type Localized = { it: string; en?: string };

const localized = (name: string) => jsonb(name).$type<Localized>().notNull();
const localizedOptional = (name: string) => jsonb(name).$type<Localized>();

// Campi comuni a ogni elemento ordinabile del CV.
const listItem = {
  id: serial("id").primaryKey(),
  position: integer("position").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const profile = pgTable("profile", {
  id: integer("id").primaryKey().default(1),
  fullName: text("full_name").notNull().default("Thomas Addamo"),
  role: localized("role"),
  // Hero: frase principale, frase su cosa cerchi, etichetta di disponibilità.
  tagline: localized("tagline"),
  lookingFor: localizedOptional("looking_for"),
  status: localizedOptional("status"),
  available: boolean("available").notNull().default(true),
  // Profilo: titolo, bio breve, paragrafo personale e i tre dati in fondo.
  headline: localizedOptional("headline"),
  bio: localized("bio"),
  bioPersonal: localizedOptional("bio_personal"),
  currentRole: text("current_role"),
  focus: localizedOptional("focus"),
  seeking: localizedOptional("seeking"),
  workMode: localizedOptional("work_mode"),
  city: text("city"),
  photoUrl: text("photo_url"),
  email: text("email"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const experiences = pgTable("experiences", {
  ...listItem,
  company: text("company").notNull(),
  role: localized("role"),
  city: text("city"),
  employmentType: localizedOptional("employment_type"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  description: localizedOptional("description"),
  technologies: text("technologies").array().notNull().default([]),
});

export const education = pgTable("education", {
  ...listItem,
  school: text("school").notNull(),
  title: localized("title"),
  city: text("city"),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  grade: text("grade"),
});

export const projects = pgTable("projects", {
  ...listItem,
  title: text("title").notNull(),
  kind: localizedOptional("kind"),
  year: integer("year"),
  summary: localized("summary"),
  imageUrl: text("image_url"),
  url: text("url"),
  repoUrl: text("repo_url"),
  featured: boolean("featured").notNull().default(false),
  technologies: text("technologies").array().notNull().default([]),
});

// level: 3 uso ogni giorno, 2 conosco bene, 1 sto approfondendo.
// size: 1-3, la dimensione nella composizione tipografica; accent = in corsivo serif.
export const skills = pgTable("skills", {
  ...listItem,
  name: text("name").notNull(),
  category: text("category"),
  level: integer("level").notNull().default(2),
  size: integer("size").notNull().default(2),
  accent: boolean("accent").notNull().default(false),
});

export const cefrLevel = pgEnum("cefr_level", ["A1", "A2", "B1", "B2", "C1", "C2", "native"]);

export const languages = pgTable("languages", {
  ...listItem,
  name: localized("name"),
  level: cefrLevel("level").notNull(),
});

export const certifications = pgTable("certifications", {
  ...listItem,
  name: text("name").notNull(),
  issuer: text("issuer"),
  issuedOn: date("issued_on"),
  url: text("url"),
});

export const links = pgTable("links", {
  ...listItem,
  kind: text("kind").notNull(),
  label: text("label"),
  url: text("url").notNull(),
});

export const faqs = pgTable("faqs", {
  ...listItem,
  question: localized("question"),
  answer: localized("answer"),
});

// Una riga per ogni "Pubblica": il sito e i PDF usano sempre l'ultima.
export const cvVersions = pgTable("cv_versions", {
  id: serial("id").primaryKey(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  snapshot: jsonb("snapshot").notNull(),
  pdfItUrl: text("pdf_it_url"),
  pdfEnUrl: text("pdf_en_url"),
});

// Conteggio anonimo dei download: nessun dato personale.
export const cvDownloads = pgTable("cv_downloads", {
  id: serial("id").primaryKey(),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
  lang: text("lang").notNull(),
  versionId: integer("version_id").references(() => cvVersions.id),
  country: text("country"),
});
