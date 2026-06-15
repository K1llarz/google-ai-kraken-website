/**
 * Portfolio data layer — LOCAL (localStorage) implementation.
 */
import type { PortfolioItem, PortfolioInput } from '../types';
import { KEYS, readJSON, writeJSON, hasKey, nowISO, newId, toTimestamp } from './localStore';
import { portfolioItems as sampleItems } from '../data';

interface StoredItem extends Omit<PortfolioItem, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function toItem(record: StoredItem): PortfolioItem {
  return {
    ...record,
    createdAt: toTimestamp(record.createdAt),
    updatedAt: toTimestamp(record.updatedAt),
  };
}

function seedIfEmpty(): void {
  if (hasKey(KEYS.portfolio)) return;
  const iso = new Date().toISOString();
  const seeded: StoredItem[] = sampleItems.map((p) => ({
    id: p.id,
    slug: p.id,
    title: p.title,
    category: p.category,
    image: p.image,
    client: p.client,
    duration: p.duration,
    challenge: p.challenge,
    solution: p.solution,
    results: p.results,
    content: p.content,
    status: 'published',
    createdAt: iso,
    updatedAt: iso,
  }));
  writeJSON(KEYS.portfolio, seeded);
}

function readItems(): StoredItem[] {
  seedIfEmpty();
  return readJSON<StoredItem[]>(KEYS.portfolio, []);
}

function byNewest(a: string, b: string): number {
  return new Date(b).getTime() - new Date(a).getTime();
}

/** All items, newest first — admin. */
export async function listPortfolio(): Promise<PortfolioItem[]> {
  return readItems().sort((a, b) => byNewest(a.createdAt, b.createdAt)).map(toItem);
}

/** Published items, newest first — public site. */
export async function listPublishedPortfolio(): Promise<PortfolioItem[]> {
  return readItems()
    .filter((p) => p.status === 'published')
    .sort((a, b) => byNewest(a.createdAt, b.createdAt))
    .map(toItem);
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | null> {
  const found = readItems().find((p) => p.id === id);
  return found ? toItem(found) : null;
}

export async function getPublishedPortfolioBySlug(slug: string): Promise<PortfolioItem | null> {
  const found = readItems().find((p) => p.slug === slug && p.status === 'published');
  return found ? toItem(found) : null;
}

export async function createPortfolioItem(input: PortfolioInput): Promise<string> {
  const items = readItems();
  const iso = nowISO();
  const id = newId();
  items.push({ ...input, id, createdAt: iso, updatedAt: iso });
  writeJSON(KEYS.portfolio, items);
  return id;
}

export async function updatePortfolioItem(id: string, input: PortfolioInput): Promise<void> {
  const items = readItems();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Portfolio item not found.');
  items[idx] = { ...items[idx], ...input, updatedAt: nowISO() };
  writeJSON(KEYS.portfolio, items);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  writeJSON(KEYS.portfolio, readItems().filter((p) => p.id !== id));
}
