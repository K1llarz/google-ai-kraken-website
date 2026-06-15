import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from './firebaseUtils';
import type { PageContent } from '../types';

const COLLECTION = 'pages';

/** Read stored content for a page, or null if it has never been edited. */
export async function getPageContent(pageId: string): Promise<PageContent | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION, pageId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      fields: (data.fields ?? {}) as Record<string, string>,
      seoTitle: data.seoTitle ?? '',
      seoDescription: data.seoDescription ?? '',
      updatedAt: data.updatedAt ?? null,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION}/${pageId}`);
    return null;
  }
}

export async function savePageContent(
  pageId: string,
  data: { fields: Record<string, string>; seoTitle: string; seoDescription: string },
): Promise<void> {
  try {
    await setDoc(
      doc(db, COLLECTION, pageId),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true },
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION}/${pageId}`);
    throw error;
  }
}
