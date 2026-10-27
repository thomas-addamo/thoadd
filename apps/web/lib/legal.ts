import type { Lang } from "./i18n";

export type LegalDoc = { title: string; intro: string; updated: string; sections: { h: string; p: string[] }[] };

// Testi da sito personale, scritti per essere chiari; non sostituiscono un parere legale.
export function legal(kind: "copyright" | "privacy", lang: Lang, { name, email }: { name: string; email: string }): LegalDoc {
  const it = lang === "it";
  if (kind === "copyright") {
    return it
      ? {
          title: "Copyright e *marchio*",
          intro: `Tutto ciò che vedi su thoadd.com appartiene a ${name}, salvo dove indicato diversamente.`,
          updated: "Aggiornato a ottobre 2026",
          sections: [
            {
              h: "Contenuti protetti",
              p: [
                `Testi, fotografie, immagini, grafica, impaginazione, animazioni, il CV in PDF e ogni altro contenuto del sito sono opere di ${name}, protette dalla legge sul diritto d'autore (L. 633/1941) e dalle norme internazionali. Tutti i diritti sono riservati.`,
                "È vietato copiare, riprodurre, modificare, pubblicare, distribuire o usare a fini commerciali qualsiasi contenuto senza un'autorizzazione scritta. Sono consentite brevi citazioni con indicazione chiara della fonte e un link a thoadd.com.",
              ],
            },
            {
              h: "Il marchio thoadd",
              p: [
                `"thoadd", il wordmark e il monogramma TA sono segni distintivi di ${name} e lo identificano personalmente. Non possono essere usati, imitati o registrati come nomi di dominio, account o marchi senza autorizzazione, né in modo da far pensare a un legame con ${name}.`,
              ],
            },
            {
              h: "Fotografia e immagine personale",
              p: [
                `La fotografia di ${name} è un dato personale e il suo ritratto è tutelato anche dal diritto all'immagine (art. 10 c.c. e artt. 96–97 L. 633/1941). Può essere solo visualizzata sul sito: è vietato salvarla, copiarla, ritagliarla, modificarla, ripubblicarla o usarla per addestrare sistemi di riconoscimento o di intelligenza artificiale.`,
              ],
            },
            {
              h: "Intelligenza artificiale e raccolta automatica",
              p: [
                "Ai sensi dell'art. 70-quater L. 633/1941 e dell'art. 4 della Direttiva UE 2019/790, l'autore si oppone espressamente all'estrazione di testo e dati (text and data mining) dei contenuti del sito, compreso l'uso per addestrare modelli di intelligenza artificiale. Questa riserva vale anche per i crawler indicati nel file robots.txt.",
              ],
            },
            {
              h: "Codice sorgente",
              p: ["Il codice del sito è pubblicato su GitHub per trasparenza. Senza una licenza esplicita nel repository, anche il codice resta coperto da tutti i diritti riservati."],
            },
            { h: "Richieste e segnalazioni", p: [`Per autorizzazioni o per segnalare un uso non consentito scrivi a ${email}.`] },
          ],
        }
      : {
          title: "Copyright and *trademark*",
          intro: `Everything on thoadd.com belongs to ${name}, unless stated otherwise.`,
          updated: "Updated October 2026",
          sections: [
            {
              h: "Protected content",
              p: [
                `Texts, photographs, images, graphics, layout, animations, the PDF CV and all other content on this site are works by ${name}, protected by Italian copyright law (L. 633/1941) and international treaties. All rights reserved.`,
                "Copying, reproducing, modifying, publishing, distributing or using any content for commercial purposes without written permission is not allowed. Short quotations are allowed with clear attribution and a link to thoadd.com.",
              ],
            },
            {
              h: "The thoadd trademark",
              p: [
                `"thoadd", its wordmark and the TA monogram are distinctive signs of ${name} and identify the author personally. They may not be used, imitated or registered as domain names, accounts or trademarks without permission, nor in a way that suggests an affiliation with ${name}.`,
              ],
            },
            {
              h: "Photograph and personal image",
              p: [
                `The photograph of ${name} is personal data and the portrait is also protected by image rights (art. 10 of the Italian Civil Code and arts. 96–97 L. 633/1941). It may only be viewed on this site: saving, copying, cropping, editing, republishing it or using it to train recognition or AI systems is not allowed.`,
              ],
            },
            {
              h: "Artificial intelligence and automated collection",
              p: [
                "Under art. 70-quater L. 633/1941 and art. 4 of EU Directive 2019/790, the author expressly reserves the rights against text and data mining of this site's content, including its use to train artificial intelligence models. This reservation also applies to the crawlers listed in robots.txt.",
              ],
            },
            {
              h: "Source code",
              p: ["The site's code is published on GitHub for transparency. Without an explicit licence in the repository, the code is also all rights reserved."],
            },
            { h: "Requests and reports", p: [`For permissions or to report unauthorised use, write to ${email}.`] },
          ],
        };
  }

  return it
    ? {
        title: "Privacy",
        intro: "Questo sito raccoglie il minimo indispensabile: niente cookie di profilazione, niente pubblicità, niente tracciamento tra siti.",
        updated: "Aggiornato a ottobre 2026",
        sections: [
          { h: "Titolare", p: [`Il titolare del trattamento è ${name}. Per qualsiasi richiesta sulla privacy scrivi a ${email}.`] },
          {
            h: "Che cosa viene raccolto",
            p: [
              "Download del CV: per ogni download vengono salvati solo la data, la lingua, la versione del CV e il paese ricavato dalla rete. L'indirizzo IP non viene conservato e il dato non permette di identificarti.",
              "Memoria del browser: il sito salva nel tuo browser il tema scelto (chiaro o scuro) e il giorno in cui hai visto l'animazione di apertura. Sono informazioni tecniche, restano sul tuo dispositivo e non richiedono consenso.",
              "Se mi scrivi per email, uso i tuoi dati solo per risponderti.",
            ],
          },
          {
            h: "Fornitori",
            p: [
              "Il sito è ospitato da Vercel Inc. (con funzioni eseguite a Francoforte) e i contenuti sono conservati da Neon (Francoforte) e Vercel Blob. Come ogni server, Vercel registra temporaneamente dati tecnici di accesso (come l'indirizzo IP) per sicurezza e funzionamento. I font sono serviti dal dominio thoadd.com, senza richieste a Google dal tuo browser.",
            ],
          },
          {
            h: "I tuoi diritti",
            p: [
              `Puoi chiedere accesso, rettifica, cancellazione, limitazione o opposizione al trattamento (artt. 15–22 GDPR) scrivendo a ${email}. Hai anche diritto di presentare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).`,
            ],
          },
        ],
      }
    : {
        title: "Privacy",
        intro: "This site collects the bare minimum: no profiling cookies, no advertising, no cross-site tracking.",
        updated: "Updated October 2026",
        sections: [
          { h: "Controller", p: [`The data controller is ${name}. For any privacy request, write to ${email}.`] },
          {
            h: "What is collected",
            p: [
              "CV downloads: for each download only the date, the language, the CV version and the country derived from the network are stored. The IP address is not kept and the data cannot identify you.",
              "Browser storage: the site stores in your browser the theme you chose (light or dark) and the day you saw the opening animation. This is technical information, it stays on your device and needs no consent.",
              "If you email me, your data is used only to reply.",
            ],
          },
          {
            h: "Providers",
            p: [
              "The site is hosted by Vercel Inc. (with functions running in Frankfurt) and content is stored by Neon (Frankfurt) and Vercel Blob. Like any server, Vercel temporarily logs technical access data (such as the IP address) for security and operation. Fonts are served from thoadd.com, with no requests to Google from your browser.",
            ],
          },
          {
            h: "Your rights",
            p: [
              `You can request access, rectification, erasure, restriction or objection (arts. 15–22 GDPR) by writing to ${email}. You can also lodge a complaint with the Italian Data Protection Authority (garanteprivacy.it).`,
            ],
          },
        ],
      };
}
