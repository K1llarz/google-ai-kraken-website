/**
 * Contact submissions — LOCAL (localStorage) implementation.
 * Stores form submissions in the browser. Same role as the Firestore
 * `contacts` collection used previously.
 */
import { KEYS, readJSON, writeJSON, nowISO, newId } from './localStore';

export interface ContactSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  details: string;
  createdAt: string;
}

export async function addContact(
  data: Omit<ContactSubmission, 'id' | 'createdAt'>,
): Promise<void> {
  const all = readJSON<ContactSubmission[]>(KEYS.contacts, []);
  all.push({ ...data, id: newId(), createdAt: nowISO() });
  writeJSON(KEYS.contacts, all);
}
