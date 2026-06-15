/**
 * Minimal timestamp shape used across the app. Both the local timestamp shim
 * (see localStore.ts) and Firebase's `Timestamp` satisfy this structurally, so
 * consumers can call `.toDate()` / `.toMillis()` regardless of backend.
 */
export interface TimestampLike {
  toDate(): Date;
  toMillis(): number;
}

export type PostStatus = 'draft' | 'published';

/** A blog post as stored in the data layer (the `posts` collection/store). */
export interface Post {
  id: string;
  title: string;
  slug: string;
  /** Markdown body. */
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  readTime: string;
  status: PostStatus;
  seoTitle: string;
  seoDescription: string;
  createdAt: TimestampLike | null;
  updatedAt: TimestampLike | null;
  publishedAt: TimestampLike | null;
}

/** Shape used by the editor form (timestamps are managed by the data layer). */
export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>;

/** A portfolio case study (the `portfolio` collection/store). */
export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  client: string;
  duration: string;
  challenge: string;
  solution: string;
  results: string[];
  /** Markdown body. */
  content: string;
  status: PostStatus;
  createdAt: TimestampLike | null;
  updatedAt: TimestampLike | null;
}

export type PortfolioInput = Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>;

/** A job opening (the `jobs` collection/store). */
export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: PostStatus;
  createdAt: TimestampLike | null;
  updatedAt: TimestampLike | null;
}

export type JobInput = Omit<JobOpening, 'id' | 'createdAt' | 'updatedAt'>;

/** Editable page content stored in the `pages` collection/store (one per page). */
export interface PageContent {
  /** Field key -> value. Keys are defined by the page registry in lib/content.ts. */
  fields: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  updatedAt: TimestampLike | null;
}
