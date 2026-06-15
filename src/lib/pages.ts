/**
 * Page content data layer — LOCAL (localStorage) implementation.
 * Mirrors the Firebase version's API so callers are unchanged.
 */
import type { PageContent } from '../types';
import { KEYS, readJSON, writeJSON, nowISO, toTimestamp } from './localStore';

interface StoredPage {
  fields: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
}

type PagesMap = Record<string, StoredPage>;

/** Read stored content for a page, or null if it has never been edited. */
export async function getPageContent(pageId: string): Promise<PageContent | null> {
  const all = readJSON<PagesMap>(KEYS.pages, {});
  const stored = all[pageId];
  if (!stored) return null;
  return {
    fields: stored.fields ?? {},
    seoTitle: stored.seoTitle ?? '',
    seoDescription: stored.seoDescription ?? '',
    updatedAt: toTimestamp(stored.updatedAt),
  };
}

export async function savePageContent(
  pageId: string,
  data: { fields: Record<string, string>; seoTitle: string; seoDescription: string },
): Promise<void> {
  const all = readJSON<PagesMap>(KEYS.pages, {});
  all[pageId] = { ...data, updatedAt: nowISO() };
  writeJSON(KEYS.pages, all);
}
