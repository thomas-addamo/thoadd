import {
  asc,
  desc,
  eq,
  certifications,
  cvVersions,
  education,
  experiences,
  faqs,
  getDb,
  languages,
  links,
  profile,
  projects,
  skills,
} from "@thoadd/db";

// Tutto ciò che la home mostra, letto in parallelo dal database.
export async function getContent() {
  const db = getDb();
  const [
    [me],
    expRows,
    projRows,
    skillRows,
    langRows,
    eduRows,
    certRows,
    linkRows,
    faqRows,
    [cv],
  ] = await Promise.all([
    db.select().from(profile).limit(1),
    db.select().from(experiences).where(eq(experiences.visible, true)).orderBy(asc(experiences.position)),
    db.select().from(projects).where(eq(projects.visible, true)).orderBy(asc(projects.position)),
    db.select().from(skills).where(eq(skills.visible, true)).orderBy(asc(skills.position)),
    db.select().from(languages).where(eq(languages.visible, true)).orderBy(asc(languages.position)),
    db.select().from(education).where(eq(education.visible, true)).orderBy(asc(education.position)),
    db.select().from(certifications).where(eq(certifications.visible, true)).orderBy(asc(certifications.position)),
    db.select().from(links).where(eq(links.visible, true)).orderBy(asc(links.position)),
    db.select().from(faqs).where(eq(faqs.visible, true)).orderBy(asc(faqs.position)),
    db.select().from(cvVersions).orderBy(desc(cvVersions.publishedAt)).limit(1),
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
    cv: cv ?? null,
  };
}

export type Content = Awaited<ReturnType<typeof getContent>>;
