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
