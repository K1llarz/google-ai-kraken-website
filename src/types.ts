import type { Timestamp } from 'firebase/firestore';

export type PostStatus = 'draft' | 'published';

/** A blog post as stored in Firestore (the `posts` collection). */
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
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  publishedAt: Timestamp | null;
}

/** Shape used by the editor form (timestamps are managed server-side). */
export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'>;

/** Editable page content stored in the `pages` collection (one doc per page). */
export interface PageContent {
  /** Field key -> value. Keys are defined by the page registry in lib/content.ts. */
  fields: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  updatedAt: Timestamp | null;
}
