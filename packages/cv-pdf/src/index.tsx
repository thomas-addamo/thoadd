import {
  Defs,
  Document,
  Font,
  Page,
  Path,
  RadialGradient,
  Rect,
  renderToBuffer,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import type { CvContent } from "@thoadd/db/content";
import type { Localized } from "@thoadd/db/schema";

export type Lang = "it" | "en";

// Le misure del design sono in px su un A4 di 794 px: in punti PDF valgono 0,75.
const px = (n: number) => n * 0.75;

const color = {
  ink: "#111318",
  slate: "#5B6170",
  iris: "#3D4FB8",
  haze: "#DDE3F3",
  aura: "#8FA6E0",
  dawn: "#F6E3DA",
};

const labels = {
  it: {
    profile: "Profilo",
    experience: "Esperienze",
    education: "Formazione",
    projects: "Progetti",
    skills: "Competenze",
    languages: "Lingue",
    now: "oggi",
    native: "madrelingua",
    page: "pagina",
    otherSkills: "Competenze",
    consent: "Autorizzo il trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679 (GDPR).",
  },
  en: {
    profile: "Profile",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    languages: "Languages",
    now: "now",
    native: "native",
    page: "page",
    otherSkills: "Skills",
    consent: "I authorise the processing of my personal data under EU Regulation 2016/679 (GDPR).",
  },
};

const tr = (v: Localized | null | undefined, lang: Lang) => (v ? (lang === "en" && v.en) || v.it : "");

let fontsReady: Promise<void> | null = null;

// Clash Display e General Sans arrivano da thoadd.com/fonts; Instrument Serif da Google Fonts.
async function registerFonts(fontBaseUrl: string) {
  Font.register({
    family: "Clash",
    fonts: [
      { src: `${fontBaseUrl}/ClashDisplay-Light.otf`, fontWeight: 300 },
      { src: `${fontBaseUrl}/ClashDisplay-Regular.otf`, fontWeight: 400 },
      { src: `${fontBaseUrl}/ClashDisplay-Medium.otf`, fontWeight: 500 },
    ],
  });
  Font.register({
    family: "General",
    fonts: [
      { src: `${fontBaseUrl}/GeneralSans-Regular.otf`, fontWeight: 400 },
      { src: `${fontBaseUrl}/GeneralSans-Medium.otf`, fontWeight: 500 },
    ],
  });
  // Senza user agent Google Fonts risponde con un TTF, che il motore PDF sa leggere.
  const css = await fetch("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1").then((r) => r.text());
  const ttf = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
  Font.register({
    family: "Instrument",
    fonts: [{ src: ttf ?? `${fontBaseUrl}/ClashDisplay-Light.otf`, fontStyle: "italic" }],
  });
  Font.registerHyphenationCallback((word) => [word]);
}

const s = StyleSheet.create({
  page: { fontFamily: "General", fontSize: px(13), lineHeight: 1.55, color: color.ink, backgroundColor: "#FFFFFF" },
  wrap: { paddingHorizontal: px(64) },
  h2: { fontFamily: "Clash", fontWeight: 400, fontSize: px(24), letterSpacing: -0.2, marginBottom: px(8) },
  row: { flexDirection: "row", paddingVertical: px(16), borderBottomWidth: 0.75, borderBottomColor: color.haze },
  dateCol: { width: px(136), marginRight: px(24) },
  strong: { fontWeight: 500 },
  muted: { color: color.slate },
  footer: { position: "absolute", left: px(64), right: px(64), flexDirection: "row", justifyContent: "space-between", fontSize: px(12) },
});

function Rich({ text, accent = color.iris }: { text: string; accent?: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text key={i} style={{ fontFamily: "Instrument", fontStyle: "italic", fontWeight: 400, color: accent }}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Monogram({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {["M13 27 L21 5 L29 27", "M3 13 H23.9", "M10.5 13 V27"].map((d) => (
        <Path key={d} d={d} stroke={color.ink} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
    </Svg>
  );
}

function Qr({ modules, size }: { modules: boolean[][]; size: number }) {
  const n = modules.length;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${n} ${n}`}>
      {modules.flatMap((row, y) => row.map((on, x) => (on ? <Rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={color.ink} /> : null)))}
    </Svg>
  );
}

// Sfumatura verticale disegnata a strisce: il motore PDF sbaglia la direzione dei LinearGradient.
function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function VerticalFade({ width, height, stops, steps = 90 }: { width: number; height: number; stops: [number, string][]; steps?: number }) {
  const at = (t: number) => {
    const i = Math.max(0, stops.findIndex(([o]) => o >= t) - 1);
    const [o1, c1] = stops[i];
    const [o2, c2] = stops[Math.min(i + 1, stops.length - 1)];
    const k = o2 === o1 ? 0 : (t - o1) / (o2 - o1);
    const [a, b] = [hexToRgb(c1), hexToRgb(c2)];
    return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(",")})`;
  };
  const h = height / steps;
  return (
    <>
      {Array.from({ length: steps }, (_, i) => (
        <Rect key={i} x={0} y={i * h} width={width} height={h + 0.5} fill={at((i + 0.5) / steps)} />
      ))}
    </>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={s.h2}>{children}</Text>;
}

const year = (d: string | null) => (d ? d.slice(0, 4) : null);

function CvDocument({ c, lang, qr }: { c: CvContent; lang: Lang; qr: boolean[][] }) {
  const t = labels[lang];
  const me = c.profile;
  const [first, ...rest] = me.fullName.split(" ");
  const contacts = [me.email, me.city ? `${me.city}, Italia` : null, "thoadd.com"].filter(Boolean).join(" · ");
  const pageW = px(794);

  const skillGroups = new Map<string, string[]>();
  for (const skill of c.skills) {
    const key = skill.category || t.otherSkills;
    skillGroups.set(key, [...(skillGroups.get(key) ?? []), skill.name]);
  }

  return (
    <Document title={`${me.fullName} — CV`} author={me.fullName} language={lang}>
      <Page size="A4" style={s.page}>
        {/* Fascia sfumata in alto, come nel design. */}
        <Svg style={{ position: "absolute", top: 0, left: 0 }} width={pageW} height={px(300)}>
          <Defs>
            <RadialGradient id="dawn" cx="100%" cy="0%" r="30%">
              <Stop offset="0" stopColor={color.dawn} stopOpacity={0.8} />
              <Stop offset="1" stopColor={color.dawn} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <VerticalFade width={pageW} height={px(300)} stops={[[0, "#DCE3F7"], [0.6, "#F4F6FB"], [1, "#FFFFFF"]]} />
          <Rect x={0} y={0} width={pageW} height={px(300)} fill="url(#dawn)" />
        </Svg>

        <View style={[s.wrap, { paddingTop: px(56), flexDirection: "row", justifyContent: "space-between" }]}>
          <View style={{ flex: 1 }}>
            <Monogram size={px(32)} />
            <Text style={{ marginTop: px(24), fontFamily: "Clash", fontWeight: 300, fontSize: px(52), lineHeight: 1, letterSpacing: -1.2 }}>
              {first} <Text style={{ fontFamily: "Instrument", fontStyle: "italic", color: color.iris, letterSpacing: -0.4 }}>{rest.join(" ")}</Text>
            </Text>
            <Text style={{ marginTop: px(12), fontSize: px(17) }}>{tr(me.role, lang)}</Text>
            <Text style={[s.muted, { marginTop: px(16) }]}>{contacts}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <View style={{ padding: px(10), backgroundColor: "#FFFFFF", borderRadius: px(16), borderWidth: 0.75, borderColor: color.haze }}>
              <Qr modules={qr} size={px(84)} />
            </View>
            <Text style={[s.muted, { marginTop: px(8), fontSize: px(12) }]}>thoadd.com</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: px(48),
            marginHorizontal: px(64),
            paddingVertical: px(24),
            paddingHorizontal: px(28),
            borderRadius: px(24),
            borderWidth: 0.75,
            borderColor: color.haze,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Text style={[s.muted, { fontSize: px(12), fontWeight: 500 }]}>{t.profile}</Text>
          <Text style={{ marginTop: px(8), fontSize: px(15) }}>
            <Rich text={tr(me.tagline, lang)} />
          </Text>
          <Text style={{ marginTop: px(6) }}>{tr(me.bio, lang)}</Text>
        </View>

        {c.experiences.length > 0 && (
          <View style={[s.wrap, { marginTop: px(40) }]}>
            <SectionTitle>{t.experience}</SectionTitle>
            <View style={{ borderTopWidth: 0.75, borderTopColor: color.haze }}>
              {c.experiences.map((e) => {
                const from = year(e.startDate);
                const to = year(e.endDate);
                const range = !to ? `${from} — ${t.now}` : from === to ? from : `${from} — ${to}`;
                const bullets = tr(e.description, lang).split("\n").map((l) => l.trim()).filter(Boolean);
                return (
                  <View key={e.id} style={[s.row, { paddingVertical: px(20) }]} wrap={false}>
                    <View style={s.dateCol}>
                      <Text style={s.strong}>{range}</Text>
                      {e.city && <Text style={s.muted}>{e.city}</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: px(15), fontWeight: 500 }}>
                        {tr(e.role, lang)} · <Text style={{ color: color.iris }}>{e.company}</Text>
                      </Text>
                      {bullets.map((b, i) => (
                        <Text key={i} style={{ marginTop: px(i === 0 ? 8 : 4) }}>
                          •  {b}
                        </Text>
                      ))}
                      {e.technologies.length > 0 && <Text style={[s.muted, { marginTop: px(6) }]}>{e.technologies.join(" · ")}</Text>}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {(c.education.length > 0 || c.certifications.length > 0) && (
          <View style={[s.wrap, { marginTop: px(40) }]} wrap={false}>
            <SectionTitle>{t.education}</SectionTitle>
            <View style={{ borderTopWidth: 0.75, borderTopColor: color.haze }}>
              {c.education.map((e) => (
                <View key={`e${e.id}`} style={s.row}>
                  <Text style={[s.dateCol, s.strong]}>{[e.startYear, e.endYear].filter(Boolean).join(" — ")}</Text>
                  <Text style={{ flex: 1 }}>
                    <Text style={{ fontSize: px(15), fontWeight: 500 }}>
                      <Rich text={tr(e.title, lang)} accent={color.ink} />
                    </Text>
                    {[e.school, e.city].filter(Boolean).length > 0 && ` · ${[e.school, e.city].filter(Boolean).join(", ")}`}
                  </Text>
                </View>
              ))}
              {c.certifications.map((cert) => (
                <View key={`c${cert.id}`} style={s.row}>
                  <Text style={[s.dateCol, s.strong]}>{cert.issuedOn?.slice(0, 4) ?? ""}</Text>
                  <Text style={{ flex: 1 }}>
                    <Text style={{ fontSize: px(15), fontWeight: 500 }}>{cert.name}</Text>
                    {cert.issuer && ` · ${cert.issuer}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[s.footer, { bottom: px(40), color: color.slate }]}>
          <Text>{me.fullName} · CV</Text>
          <Text>1 / 2</Text>
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        {/* Il cielo che si addensa in fondo e il nome gigante tagliato dal bordo. */}
        <Svg style={{ position: "absolute", top: 0, left: 0 }} width={pageW} height={px(1120)} fixed>
          <VerticalFade width={pageW} height={px(1120)} steps={140} stops={[[0, "#FFFFFF"], [0.68, "#FFFFFF"], [0.84, "#E9EDF9"], [1, "#B8C6EC"]]} />
        </Svg>
        <Text
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: px(-48),
            textAlign: "center",
            fontFamily: "Clash",
            fontWeight: 300,
            fontSize: px(200),
            lineHeight: 1,
            letterSpacing: -7,
            color: "#FFFFFF",
            opacity: 0.8,
          }}
          fixed
        >
          thoadd
        </Text>

        {c.projects.length > 0 && (
          <View style={[s.wrap, { marginTop: px(64) }]}>
            <Text style={[s.h2, { marginBottom: px(16) }]}>{t.projects}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: px(-8) }}>
              {c.projects.map((p) => (
                <View key={p.id} style={{ width: "33.333%", padding: px(8) }} wrap={false}>
                  <View style={{ padding: px(20), borderRadius: px(24), borderWidth: 0.75, borderColor: color.haze, backgroundColor: "#FFFFFF", minHeight: px(150) }}>
                    <Text style={[s.muted, { fontSize: px(12) }]}>{[tr(p.kind, lang), p.year].filter(Boolean).join(" · ")}</Text>
                    <Text style={{ marginTop: px(6), fontSize: px(15), fontWeight: 500 }}>{p.title}</Text>
                    <Text style={{ marginTop: px(6) }}>{tr(p.summary, lang)}</Text>
                    {(p.url ?? p.repoUrl) && <Text style={{ marginTop: px(6), color: color.iris, fontSize: px(12) }}>{(p.url ?? p.repoUrl)!.replace(/^https?:\/\//, "")}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {skillGroups.size > 0 && (
          <View style={[s.wrap, { marginTop: px(48) }]} wrap={false}>
            <SectionTitle>{t.skills}</SectionTitle>
            <View style={{ borderTopWidth: 0.75, borderTopColor: color.haze }}>
              {[...skillGroups].map(([group, names]) => (
                <View key={group} style={s.row}>
                  {skillGroups.size > 1 && <Text style={[s.dateCol, s.strong]}>{group}</Text>}
                  <Text style={{ flex: 1 }}>{names.join(" · ")}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {c.languages.length > 0 && (
          <View style={[s.wrap, { marginTop: px(48), width: "60%" }]} wrap={false}>
            <SectionTitle>{t.languages}</SectionTitle>
            <View style={{ borderTopWidth: 0.75, borderTopColor: color.haze }}>
              {c.languages.map((l) => (
                <View key={l.id} style={[s.row, { paddingVertical: px(12), justifyContent: "space-between" }]}>
                  <Text style={s.strong}>{tr(l.name, lang)}</Text>
                  <Text style={s.muted}>{l.level === "native" ? t.native : l.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={[s.wrap, s.muted, { marginTop: px(40), fontSize: px(12) }]}>{t.consent}</Text>

        <View style={[s.footer, { bottom: px(132), color: color.ink }]}>
          <Text>{[me.email, "thoadd.com"].filter(Boolean).join(" · ")}</Text>
          <Text>2 / 2</Text>
        </View>
      </Page>
    </Document>
  );
}

// Il PDF del CV in una lingua, costruito dagli stessi dati della home.
export async function renderCvPdf(content: CvContent, lang: Lang, { fontBaseUrl }: { fontBaseUrl: string }) {
  fontsReady ??= registerFonts(fontBaseUrl);
  await fontsReady;
  const qr = QRCode.create("https://thoadd.com", { errorCorrectionLevel: "M" }).modules;
  const n = qr.size;
  const modules = Array.from({ length: n }, (_, y) => Array.from({ length: n }, (_, x) => Boolean(qr.get(x, y))));
  return renderToBuffer(<CvDocument c={content} lang={lang} qr={modules} />);
}
