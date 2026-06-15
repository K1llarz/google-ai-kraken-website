/**
 * Posts data layer — LOCAL (localStorage) implementation.
 * Mirrors the Firebase version's API so callers are unchanged.
 */
import type { Post, PostInput } from '../types';
import { KEYS, readJSON, writeJSON, hasKey, nowISO, newId, toTimestamp } from './localStore';
import { blogPosts as samplePosts } from '../data';

/** Stored record: like Post but with ISO date strings instead of timestamps. */
interface StoredPost extends Omit<Post, 'createdAt' | 'updatedAt' | 'publishedAt'> {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

/** Convert a title into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function toPost(record: StoredPost): Post {
  return {
    ...record,
    createdAt: toTimestamp(record.createdAt),
    updatedAt: toTimestamp(record.updatedAt),
    publishedAt: toTimestamp(record.publishedAt),
  };
}

/** Seed the store with the sample posts from data.ts the first time it's used. */
function seedIfEmpty(): void {
  if (hasKey(KEYS.posts)) return;
  const seeded: StoredPost[] = samplePosts.map((p) => {
    const iso = new Date(p.date).toISOString();
    return {
      id: newId(),
      title: p.title,
      slug: slugify(p.id),
      content: p.content,
      excerpt: p.content.split('\n\n')[0].slice(0, 160),
      coverImage: p.image,
      category: p.category,
      tags: [],
      author: p.author,
      authorRole: p.authorRole,
      readTime: p.readTime,
      status: 'published',
      seoTitle: p.title,
      seoDescription: '',
      createdAt: iso,
      updatedAt: iso,
      publishedAt: iso,
    };
  });
  writeJSON(KEYS.posts, seeded);
}

function readPosts(): StoredPost[] {
  seedIfEmpty();
  return readJSON<StoredPost[]>(KEYS.posts, []);
}

function byNewest(a: string | null, b: string | null): number {
  return new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime();
}

/** All posts, newest first — admin. */
export async function listPosts(): Promise<Post[]> {
  return readPosts()
    .sort((a, b) => byNewest(a.createdAt, b.createdAt))
    .map(toPost);
}

/** Published posts only, newest first — public site. */
export async function listPublishedPosts(): Promise<Post[]> {
  return readPosts()
    .filter((p) => p.status === 'published')
    .sort((a, b) => byNewest(a.publishedAt, b.publishedAt))
    .map(toPost);
}

export async function getPost(id: string): Promise<Post | null> {
  const found = readPosts().find((p) => p.id === id);
  return found ? toPost(found) : null;
}

/** Public lookup by slug. Returns the first published match. */
export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const found = readPosts().find((p) => p.slug === slug && p.status === 'published');
  return found ? toPost(found) : null;
}

export async function createPost(input: PostInput): Promise<string> {
  const posts = readPosts();
  const iso = nowISO();
  const id = newId();
  posts.push({
    ...input,
    id,
    createdAt: iso,
    updatedAt: iso,
    publishedAt: input.status === 'published' ? iso : null,
  });
  writeJSON(KEYS.posts, posts);
  return id;
}

export async function updatePost(id: string, input: PostInput, wasPublished: boolean): Promise<void> {
  const posts = readPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Post not found.');
  const existing = posts[idx];
  // Stamp publishedAt the first time a post transitions to published.
  const publishedAt =
    input.status === 'published' && !wasPublished ? nowISO() : existing.publishedAt;
  posts[idx] = { ...existing, ...input, updatedAt: nowISO(), publishedAt };
  writeJSON(KEYS.posts, posts);
}

export async function deletePost(id: string): Promise<void> {
  const posts = readPosts().filter((p) => p.id !== id);
  writeJSON(KEYS.posts, posts);
}
