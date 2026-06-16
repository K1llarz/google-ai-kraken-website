/**
 * Local (browser localStorage) persistence backend.
 *
 * This is a drop-in stand-in for the Firebase data layer while the Firestore
 * database is unavailable. It exposes the same module APIs (see posts.ts,
 * pages.ts, storage.ts) so the rest of the app is unchanged. To switch back to
 * Firebase, restore those files from git.
 *
 * NOTE: data lives only in THIS browser. It does not sync across devices or
 * users and is cleared if you clear site data. Intended for local development.
 */
import type { TimestampLike } from '../types';

export const KEYS = {
  posts: 'kroma.local.posts',
  portfolio: 'kroma.local.portfolio',
  jobs: 'kroma.local.jobs',
  pages: 'kroma.local.pages',
  contacts: 'kroma.local.contacts',
  session: 'kroma.local.session',
} as const;

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function hasKey(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

export const nowISO = (): string => new Date().toISOString();

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Wrap an ISO date string in a Firebase-Timestamp-compatible shim. */
export function toTimestamp(iso: string | null): TimestampLike | null {
  if (!iso) return null;
  const date = new Date(iso);
  return { toDate: () => date, toMillis: () => date.getTime() };
}

/**
 * One-time migration: replace "Kroma" → "Kraken" in all cached page content
 * so the rebrand takes effect for users who already have localStorage data.
 */
const MIGRATION_KEY = 'kraken.migration.kroma-to-kraken';

const rebrand = (s: string): string =>
  s.replace(/Kroma/g, 'Kraken').replace(/KROMA/g, 'KRAKEN').replace(/kroma/g, 'kraken');

/** Skip image/URL values so we never rewrite base64 data URIs or links. */
const isUrlish = (s: string): boolean =>
  s.startsWith('data:') || s.startsWith('http://') || s.startsWith('https://');

/**
 * One-time rebrand of already-cached editable page content (Kroma → Kraken).
 * Scoped to the `pages` store and to plain text values only — image and URL
 * fields are left untouched. Seeded posts/portfolio/jobs come from data.ts,
 * which is brand-neutral, so they need no migration.
 */
function migrateKromaToKraken(): void {
  if (localStorage.getItem(MIGRATION_KEY)) return; // already ran

  const raw = localStorage.getItem(KEYS.pages);
  if (raw) {
    try {
      const pages = JSON.parse(raw) as Record<string, {
        fields?: Record<string, unknown>;
        seoTitle?: unknown;
        seoDescription?: unknown;
      }>;
      for (const page of Object.values(pages)) {
        if (!page || typeof page !== 'object') continue;
        if (page.fields) {
          for (const [k, v] of Object.entries(page.fields)) {
            if (typeof v === 'string' && !isUrlish(v)) page.fields[k] = rebrand(v);
          }
        }
        if (typeof page.seoTitle === 'string') page.seoTitle = rebrand(page.seoTitle);
        if (typeof page.seoDescription === 'string') page.seoDescription = rebrand(page.seoDescription);
      }
      localStorage.setItem(KEYS.pages, JSON.stringify(pages));
    } catch {
      // Malformed cache — ignore; defaults already use "Kraken".
    }
  }
  localStorage.setItem(MIGRATION_KEY, new Date().toISOString());
}

migrateKromaToKraken();
