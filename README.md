# Kraken Marketing Agency

A premium marketing-agency website with a built-in admin panel for managing
blog posts, portfolio case studies, job openings, and editable page content.

## Stack

- **React 19 + TypeScript**, bundled with **Vite 6**
- **React Router 7** (client-side SPA)
- **Tailwind CSS v4** with a custom `brand` palette
- **localStorage** data layer (current backend — see below)

## Run locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run preview  # serve the production build
npm run lint     # type-check (tsc --noEmit)
```

## Admin panel

The admin panel lives at **`/admin`** (login at `/admin/login`). From there you
can manage blog posts, portfolio projects, job openings, and the text/images of
the public pages.

Default local credentials (override with `VITE_ADMIN_EMAIL` /
`VITE_ADMIN_PASSWORD` in `.env.local`):

- **Email:** `bugashvilig@gmail.com`
- **Password:** `gvtiso1234`

## Data backend

Content is currently stored in the browser via **localStorage** — data lives in
one browser only and is not shared across devices or users. Sample content is
seeded from `src/data.ts` on first load. This is a development backend; swapping
in a real database (e.g. Firebase or Supabase) means reimplementing the modules
in `src/lib/` (`posts`, `portfolio`, `jobs`, `pages`, `contacts`, `storage`),
which all expose backend-agnostic APIs.

> Note: local auth credentials are bundled in the client and are for local
> development only — not production.
