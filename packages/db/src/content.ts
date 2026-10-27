import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "./index";
import {
  certifications,
  cvVersions,
  education,
  experiences,
  faqs,
  languages,
  links,
  profile,
  projects,
  skills,
} from "./schema";

// I contenuti del CV così come sono ora nelle tabelle (la "bozza" che si modifica da manage).
export async function loadDraftContent() {
  const db = getDb();
  const [[me], expRows, projRows, skillRows, langRows, eduRows, certRows, linkRows, faqRows] = await Promise.all([
    db.select().from(profile).limit(1),
    db.select().from(experiences).where(eq(experiences.visible, true)).orderBy(asc(experiences.position)),
    db.select().from(projects).where(eq(projects.visible, true)).orderBy(asc(projects.position)),
    db.select().from(skills).where(eq(skills.visible, true)).orderBy(asc(skills.position)),
    db.select().from(languages).where(eq(languages.visible, true)).orderBy(asc(languages.position)),
    db.select().from(education).where(eq(education.visible, true)).orderBy(asc(education.position)),
    db.select().from(certifications).where(eq(certifications.visible, true)).orderBy(asc(certifications.position)),
    db.select().from(links).where(eq(links.visible, true)).orderBy(asc(links.position)),
    db.select().from(faqs).where(eq(faqs.visible, true)).orderBy(asc(faqs.position)),
  ]);

  if (!me) throw new Error("Profilo mancante: esegui il seed del database");

  return {
    profile: me,
    experiences: expRows,
    projects: projRows,
    skills: skillRows,
    languages: langRows,
    education: eduRows,
    certifications: certRows,
    links: linkRows,
    faqs: faqRows,
  };
}

export type CvContent = Awaited<ReturnType<typeof loadDraftContent>>;

export async function latestVersion() {
  const [row] = await getDb().select().from(cvVersions).orderBy(desc(cvVersions.publishedAt)).limit(1);
  return row ?? null;
}

export type CvVersion = NonNullable<Awaited<ReturnType<typeof latestVersion>>>;

// Il sito pubblico mostra solo l'ultima versione pubblicata; prima della prima
// pubblicazione mostra la bozza, così la home non resta mai vuota.
export async function loadPublishedContent() {
  const version = await latestVersion();
  const content = version ? (version.snapshot as CvContent) : await loadDraftContent();
  return { ...content, cv: version };
}

export type Content = Awaited<ReturnType<typeof loadPublishedContent>>;
