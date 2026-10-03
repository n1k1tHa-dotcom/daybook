# Daybook — Digital Scrapbook Journal & Planner

[![CI](https://github.com/n1k1tHa-dotcom/daybook/actions/workflows/ci.yml/badge.svg)](https://github.com/n1k1tHa-dotcom/daybook/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-blue)
![pnpm](https://img.shields.io/badge/package_manager-pnpm-F69220)
![Stack](https://img.shields.io/badge/stack-React_19_%2B_tRPC_%2B_Drizzle-61DAFB)

A journal that behaves like a physical book: the left page is your scrapbook of memories, the right page is today's planner and journal. Snap a photo, tape it onto the page, write the day down, tick off your goals — then seal the day and come back to it a year later.

![Daybook demo](docs/demo.jpg)

## Features

- **Open-book layout** — a memory/scrapbook page on the left, planner + journal on the right, responsive down to a page-by-page phone sequence.
- **Photo memories** — Polaroid-style cards with tape, captions, imperfect rotation; add photos straight from the capture sheet.
- **Scrapbook mode** — move, rotate and decorate the page with tape, stickers, labels and doodles.
- **Tiny Moments** — quick timestamped notes that collage into the day's timeline and count toward the day's memory total.
- **Planner + journal** — goals with a progress bar and a quote for the day, plus free writing on ruled paper.
- **Vibe presets** — Soft, Midnight, Cozy, Academic, Pink scrapbook, Dark academia, Nature and Y2K retint the whole spread.
- **Memory capsule** — daily stats (memories, words, goals) and a **seal this day** lock that stamps the entry as a kept promise.
- **On this day** — a small time machine showing what happened on the same date in earlier years.
- **Persistence** — days, tasks, memories, tiny moments and scrapbook elements are saved through tRPC to a MySQL database (Drizzle migrations included); unauthenticated visitors get a local preview mode.

## Tech stack

| Layer     | Choice |
| --------- | ------ |
| Frontend  | React 19, TypeScript, Vite 7, Tailwind CSS 4, Radix UI/shadcn, framer-motion, wouter |
| API       | tRPC 11 + TanStack Query on Express |
| Data      | Drizzle ORM (MySQL dialect) with checked-in migrations |
| Auth      | Signed session cookies (`jose`) |
| Testing   | Vitest |
| Tooling   | pnpm workspaces, Prettier, GitHub Actions CI |

## Getting started

**Requirements:** Node.js 20+ (24 recommended), [pnpm](https://pnpm.io) 10, a MySQL database.

```bash
git clone https://github.com/n1k1tHa-dotcom/daybook.git
cd daybook
pnpm install
```

Create a `.env` in the project root (never commit it — it is gitignored):

```bash
DATABASE_URL=mysql://user:password@localhost:3306/daybook
MANUS_JWT_SECRET=change-me
```

Then:

```bash
pnpm db:migrate   # apply the checked-in migrations
pnpm dev          # http://localhost:3000
```

## Scripts

| Command          | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `pnpm dev`       | Dev server with API, honors `PORT` (default `3000`)   |
| `pnpm dev:static`| Vite only (frontend, no API)                          |
| `pnpm build`     | Build the client and bundle the server into `dist/`   |
| `pnpm start`     | Serve the production build from `dist/`               |
| `pnpm check`     | TypeScript typecheck (`tsc --noEmit`)                 |
| `pnpm test`      | Run the Vitest suite                                  |
| `pnpm format`    | Format the repo with Prettier                         |
| `pnpm db:migrate`| Apply checked-in Drizzle migrations                   |
| `pnpm db:push`   | Generate schema changes and push them to the database |

## Project structure

```
client/            React app
  src/pages/       Home (the book) and 404
  src/components/  daybook pages, panels and shadcn/ui primitives
  src/lib/         daybook data model, seeded days, vibe presets
server/            Express + tRPC entry point and routers
  routers.ts       auth, user and daybook procedures
  db.ts            Drizzle queries for days, tasks, memories, elements
  _core/           env, session, cookies, storage proxy, platform helpers
shared/            types and constants shared by both sides
drizzle/           schema + SQL migrations
.github/workflows/ CI (typecheck, tests, build)
```

## Continuous integration

Every push to `main` and every pull request runs install → typecheck → tests → build on Node 24 (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

## License

MIT — see [`package.json`](package.json).
