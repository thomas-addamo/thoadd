# thoadd

Il CV online di Thomas Addamo.

| Cartella | Cosa contiene | Dominio |
| --- | --- | --- |
| `apps/web` | Sito pubblico | thoadd.com |
| `apps/manage` | Pannello privato per gestire il CV | manage.thoadd.com |
| `packages/ui` | Token di design "Atmosfera", font, monogramma | — |
| `packages/db` | Schema Drizzle e client Neon Postgres | — |
| `design/atmosfera` | Tavole del design di riferimento (Claude Design) | — |

## Sviluppo

```bash
pnpm install
pnpm dev          # web su :3000, manage su :3001
pnpm build
pnpm db:generate  # dopo una modifica a packages/db/src/schema.ts
pnpm db:migrate
```

Serve `DATABASE_URL` in `.env.local` dentro `apps/web`, `apps/manage` e `packages/db` (vedi `.env.example`).

## Font

Clash Display e General Sans (Fontshare, ITF Free Font License) sono in `packages/ui/fonts`; Instrument Serif arriva da Google Fonts tramite `next/font`.
