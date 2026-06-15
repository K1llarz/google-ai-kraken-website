import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from './firebaseUtils';
import type { Post, PostInput } from '../types';

const COLLECTION = 'posts';
const postsRef = collection(db, COLLECTION);

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

function toPost(snap: QueryDocumentSnapshot<DocumentData> | DocumentData, id?: string): Post {
  const data = ('data' in snap ? snap.data() : snap) as DocumentData;
  const docId = id ?? ('id' in snap ? (snap as QueryDocumentSnapshot).id : '');
  return {
    id: docId,
    title: data.title ?? '',
    slug: data.slug ?? '',
    content: data.content ?? '',
    excerpt: data.excerpt ?? '',
    coverImage: data.coverImage ?? '',
    category: data.category ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author ?? '',
    authorRole: data.authorRole ?? '',
    readTime: data.readTime ?? '',
    status: data.status === 'published' ? 'published' : 'draft',
    seoTitle: data.seoTitle ?? '',
    seoDescription: data.seoDescription ?? '',
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
    publishedAt: data.publishedAt ?? null,
  };
}

/** All posts, newest first — admin only (rules require admin to read drafts). */
export async function listPosts(): Promise<Post[]> {
  try {
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toPost(d));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
    return [];
  }
}

/** Published posts only, newest first — public site. */
export async function listPublishedPosts(): Promise<Post[]> {
  try {
    const q = query(
      postsRef,
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toPost(d));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
    return [];
  }
}

export async function getPost(id: string): Promise<Post | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? toPost(snap.data(), snap.id) : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION}/${id}`);
    return null;
  }
}

/** Public lookup by slug. Returns the first published match. */
export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  try {
    const q = query(
      postsRef,
      where('slug', '==', slug),
      where('status', '==', 'published'),
      fbLimit(1),
    );
    const snap = await getDocs(q);
    return snap.empty ? null : toPost(snap.docs[0]);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION);
    return null;
  }
}

export async function createPost(input: PostInput): Promise<string> {
  try {
    const now = serverTimestamp();
    const ref = await addDoc(postsRef, {
      ...input,
      createdAt: now,
      updatedAt: now,
      publishedAt: input.status === 'published' ? now : null,
    });
    return ref.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION);
    throw error;
  }
}

export async function updatePost(
  id: string,
  input: PostInput,
  wasPublished: boolean,
): Promise<void> {
  try {
    const patch: Record<string, unknown> = { ...input, updatedAt: serverTimestamp() };
    // Set publishedAt the first time a post transitions to published.
    if (input.status === 'published' && !wasPublished) {
      patch.publishedAt = serverTimestamp();
    }
    await updateDoc(doc(db, COLLECTION, id), patch);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION}/${id}`);
    throw error;
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION}/${id}`);
    throw error;
  }
}
