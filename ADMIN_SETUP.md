# Admin Panel — Setup Guide

A secure admin panel for managing blog posts and editing page content, built on
the project's existing stack (React 19 + Vite + React Router, Firebase
Auth/Firestore/Storage, Tailwind v4). No new backend — the admin UI talks to
Firebase directly, and **Firestore Security Rules enforce all authorization and
server-side validation**.

## What was added

| Area | Location |
| --- | --- |
| Auth context + route guard | `src/admin/AuthContext.tsx`, `src/admin/ProtectedRoute.tsx` |
| Admin shell + UI components | `src/admin/AdminLayout.tsx`, `src/admin/components/*` |
| Admin pages | `src/admin/pages/*` (Login, Dashboard, PostsList, PostEditor, PagesList, PageEditor) |
| Data layer | `src/lib/posts.ts`, `src/lib/pages.ts`, `src/lib/storage.ts`, `src/lib/content.ts` |
| Shared types | `src/types.ts` |
| Security rules | `firestore.rules` (posts/pages/admins), `storage.rules` |

Routes:

- `/admin/login` — sign-in (admins only)
- `/admin` — dashboard
- `/admin/posts`, `/admin/posts/new`, `/admin/posts/:id` — blog CRUD
- `/admin/pages`, `/admin/pages/:pageId` — page content editing

## Data model (Firestore)

The database is schemaless — no migrations are required. Collections used:

- **`posts/{id}`** — `title, slug, content` (Markdown), `excerpt, coverImage,
  category, tags[], author, authorRole, readTime, status` (`draft`|`published`),
  `seoTitle, seoDescription, createdAt, updatedAt, publishedAt`.
- **`pages/{pageId}`** — `fields` (map of editable values, keyed per the registry
  in `src/lib/content.ts`), `seoTitle, seoDescription, updatedAt`. One doc per
  page: `home, about, services, portfolio, careers, contact`.
- **`admins/{uid}`** — presence of a doc grants admin access (used by the
  existing `isAdmin()` rule and the login flow).

Public pages fall back to in-code defaults until a `pages/{id}` doc overrides
them, so the site renders identically before any edits.

## First-time setup

### 1. Enable Firebase services (Firebase console)

- **Authentication → Sign-in method →** enable **Email/Password**.
- **Storage →** enable Cloud Storage (bucket already configured as
  `storageBucket` in `firebase-applet-config.json`). Storage uploads may require
  the **Blaze** billing plan.

### 2. Create the first admin user

1. **Authentication → Users → Add user.** Enter an email + password. Copy the
   generated **User UID**.
2. **Firestore → (select the `ai-studio-…` database, not "(default)") →** create
   collection **`admins`** with a document whose **ID is that UID**. Add any
   field for reference, e.g. `email: "you@example.com"`.

That account can now sign in at `/admin/login`. Repeat to add more admins.

### 3. Deploy the security rules

The Firestore database is **named** (`firestoreDatabaseId` in
`firebase-applet-config.json`), so target it explicitly:

```bash
# Firestore rules (named database)
firebase deploy --only firestore:rules --database <firestoreDatabaseId>

# Storage rules
firebase deploy --only storage
```

Or paste `firestore.rules` / `storage.rules` into the console rules editors for
the matching database/bucket.

> **Storage note:** Storage rules can only read the *(default)* Firestore
> database, but admins live in a *named* one. The Storage rules therefore allow
> uploads for any **authenticated** user (only the admin panel ever signs anyone
> in) plus image type/size limits. For stricter control, set an `admin: true`
> custom claim on admin accounts and switch `isSignedIn()` → `isAdminClaim()` in
> `storage.rules` (the function is already included).

## Environment variables

No new env vars are required for the admin panel. Firebase config is read from
`firebase-applet-config.json`. The existing `GEMINI_API_KEY` / `APP_URL` in
`.env.local` are unrelated.

## Local development

```bash
npm install      # installs react-markdown + remark-gfm (added for the editor)
npm run dev      # then open http://localhost:3000/admin/login
npm run lint     # tsc --noEmit (type check)
npm run build    # production build
```

## Notes

- **Validation:** forms validate client-side (required fields, slug format, meta
  length) and the same constraints are re-enforced server-side in
  `firestore.rules` (`validPost`, `validPage`).
- **Images:** uploaded to Firebase Storage under `posts/` and `pages/`; you can
  also paste an external URL in any image field.
- **Markdown:** post bodies are Markdown (GFM), rendered with `react-markdown`
  and styled via the `.markdown-body` block in `src/index.css`.
- **Migrating sample posts:** the three demo posts still live in `src/data.ts`
  for reference. Recreate them through the admin UI, or seed them via a one-off
  script that signs in as an admin and writes to the `posts` collection.
```
