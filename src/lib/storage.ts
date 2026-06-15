import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export function validateImage(file: File): string | null {
  if (!ALLOWED.includes(file.type)) {
    return 'Unsupported file type. Use JPG, PNG, WebP, GIF, or SVG.';
  }
  if (file.size > MAX_BYTES) {
    return 'Image is too large (max 5 MB).';
  }
  return null;
}

/**
 * Upload an image to Firebase Storage and return its public download URL.
 * `folder` groups uploads (e.g. "posts", "pages"). `onProgress` reports 0-100.
 */
export function uploadImage(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const validationError = validateImage(file);
    if (validationError) {
      reject(new Error(validationError));
      return;
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `${folder}/${Date.now()}-${safeName}`;
    const task = uploadBytesResumable(ref(storage, path), file, {
      contentType: file.type,
    });
    task.on(
      'state_changed',
      (snap) => {
        if (onProgress) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      (error) => reject(error),
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch (error) {
          reject(error);
        }
      },
    );
  });
}
