// Contenuti segnaposto presi dal design Atmosfera. Si possono rilanciare:
// svuota le tabelle del CV e le riempie di nuovo. Da sostituire con manage.thoadd.com.
import { getDb } from "./index";
import {
  certifications,
  education,
  experiences,
  faqs,
  languages,
  links,
  profile,
  projects,
  skills,
} from "./schema";

const db = getDb();

await db.delete(profile);
await db.insert(profile).values({
  id: 1,
  fullName: "Thomas Addamo",
  role: { it: "Software Developer", en: "Software Developer" },
  tagline: {
    it: "Software developer che costruisce prodotti web chiari, veloci e piacevoli da usare.",
    en: "Software developer building web products that are clear, fast and a pleasure to use.",
  },
  lookingFor: {
    it: "[Una frase su cosa cerchi: il tipo di team, il ruolo, il settore.]",
    en: "[One sentence on what you are looking for: the team, the role, the industry.]",
  },
  status: { it: "disponibile da [mese anno]", en: "available from [month year]" },
  available: true,
  headline: {
    it: "Scrivo codice pensando a chi *lo userà*.",
    en: "I write code with *the people who use it* in mind.",
  },
  bio: {
    it: "[Due o tre frasi su chi sei: da dove vieni, cosa sai fare meglio, che tipo di problemi ti piace risolvere.]",
    en: "[Two or three sentences on who you are: where you come from, what you do best, the problems you like to solve.]",
  },
  bioPersonal: {
    it: "[Un paragrafo più personale: come lavori in team, cosa stai imparando ora, che cosa ti rende affidabile.]",
    en: "[A more personal paragraph: how you work in a team, what you are learning now, what makes you reliable.]",
  },
  currentRole: "[Ruolo] · [Azienda]",
  focus: { it: "Web, front-end, prodotto", en: "Web, front-end, product" },
  seeking: { it: "[Tipo di ruolo]", en: "[Kind of role]" },
  workMode: { it: "[In sede / ibrido / remoto]", en: "[On site / hybrid / remote]" },
  city: "[Città]",
  email: "ciao@thoadd.com",
});

await db.delete(experiences);
await db.insert(experiences).values([
  {
    position: 0,
    company: "[Azienda]",
    role: { it: "Software Developer", en: "Software Developer" },
    city: "[Città]",
    employmentType: { it: "[tempo pieno]", en: "[full time]" },
    startDate: "2024-01-01",
    endDate: null,
    description: {
      it: "[Che cosa hai costruito o migliorato, in una o due righe concrete.]",
      en: "[What you built or improved, in one or two concrete lines.]",
    },
    technologies: ["[Tecnologia]", "[Tecnologia]", "[Tecnologia]"],
  },
  {
    position: 1,
    company: "[Azienda]",
    role: { it: "Junior Web Developer", en: "Junior Web Developer" },
    city: "[Città]",
    employmentType: { it: "[contratto]", en: "[contract]" },
    startDate: "2022-01-01",
    endDate: "2024-01-01",
    description: {
      it: "[Responsabilità principale e un risultato che si può verificare.]",
      en: "[Main responsibility and a result that can be checked.]",
    },
    technologies: ["[Tecnologia]", "[Tecnologia]"],
  },
  {
    position: 2,
    company: "[Azienda]",
    role: { it: "Stage sviluppo software", en: "Software development internship" },
    city: "[Città]",
    employmentType: { it: "[tirocinio]", en: "[internship]" },
    startDate: "2021-01-01",
    endDate: "2021-12-31",
    description: {
      it: "[Che cosa hai imparato e su quale progetto hai lavorato.]",
      en: "[What you learned and which project you worked on.]",
    },
    technologies: ["[Tecnologia]", "[Tecnologia]"],
  },
]);

await db.delete(projects);
await db.insert(projects).values([
  {
    position: 0,
    title: "[Nome progetto]",
    kind: { it: "App web", en: "Web app" },
    year: 2025,
    summary: {
      it: "[Il problema in una riga e che cosa è cambiato dopo.]",
      en: "[The problem in one line and what changed afterwards.]",
    },
    featured: true,
  },
  {
    position: 1,
    title: "[Nome progetto]",
    kind: { it: "Strumento interno", en: "Internal tool" },
    year: 2024,
    summary: {
      it: "[Per chi è, che cosa fa, quale parte hai sviluppato tu.]",
      en: "[Who it is for, what it does, which part you built.]",
    },
  },
  {
    position: 2,
    title: "[Nome progetto]",
    kind: { it: "Progetto personale", en: "Personal project" },
    year: 2023,
    summary: {
      it: "[Perché l'hai fatto e che cosa ti ha insegnato.]",
      en: "[Why you built it and what it taught you.]",
    },
  },
]);

// Stesse dimensioni, colori e corsivi della composizione nel design.
const skillRows: { name: string; level: number; size: number; accent?: boolean }[] = [
  { name: "TypeScript", level: 3, size: 3 },
  { name: "React", level: 2, size: 3, accent: true },
  { name: "Node.js", level: 1, size: 1 },
  { name: "Python", level: 2, size: 1 },
  { name: "SQL", level: 3, size: 3 },
  { name: "HTML & CSS", level: 3, size: 1 },
  { name: "Accessibilità", level: 1, size: 2, accent: true },
  { name: "Git", level: 2, size: 2 },
  { name: "Test automatici", level: 1, size: 1 },
  { name: "Figma", level: 3, size: 3 },
  { name: "REST API", level: 2, size: 1 },
];
await db.delete(skills);
await db.insert(skills).values(skillRows.map((s, position) => ({ ...s, position })));

await db.delete(languages);
await db.insert(languages).values([
  { position: 0, name: { it: "Italiano", en: "Italian" }, level: "native" },
  { position: 1, name: { it: "English", en: "English" }, level: "B2" },
]);

await db.delete(education);
await db.insert(education).values({
  position: 0,
  school: "[Istituto]",
  title: { it: "Diploma in *Informatica*", en: "Diploma in *Computer Science*" },
  city: "[Città]",
  startYear: null,
  endYear: null,
});

await db.delete(certifications);
await db.insert(certifications).values({
  position: 0,
  name: "[Certificazione o corso]",
  issuer: "[Ente]",
});

await db.delete(links);
await db.insert(links).values([
  { position: 0, kind: "linkedin", label: "LinkedIn", url: "#" },
  { position: 1, kind: "github", label: "GitHub", url: "https://github.com/thomas-addamo" },
]);

await db.delete(faqs);
await db.insert(faqs).values([
  {
    position: 0,
    question: { it: "Quando puoi iniziare?", en: "When can you start?" },
    answer: { it: "[Disponibilità e preavviso.]", en: "[Availability and notice period.]" },
  },
  {
    position: 1,
    question: { it: "Lavori anche da remoto?", en: "Do you work remotely?" },
    answer: { it: "[Risposta.]", en: "[Answer.]" },
  },
  {
    position: 2,
    question: { it: "Puoi fornire referenze?", en: "Can you provide references?" },
    answer: { it: "[Risposta.]", en: "[Answer.]" },
  },
]);

console.log("Contenuti segnaposto inseriti.");
