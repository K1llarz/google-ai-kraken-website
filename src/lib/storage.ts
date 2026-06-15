/**
 * Image upload — LOCAL implementation.
 * Instead of uploading to Firebase Storage, images are read into base64 data
 * URLs and stored inline with the post/page. Same API as the Firebase version.
 *
 * NOTE: data URLs are stored in localStorage, which has a small quota (~5 MB
 * total). Keep local images small; large libraries should use real storage.
 */
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB (localStorage is small)
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export function validateImage(file: File): string | null {
  if (!ALLOWED.includes(file.type)) {
    return 'Unsupported file type. Use JPG, PNG, WebP, GIF, or SVG.';
  }
  if (file.size > MAX_BYTES) {
    return 'Image is too large for local storage (max 2 MB). Use an image URL instead.';
  }
  return null;
}

/**
 * Read an image file into a base64 data URL. `folder` is accepted for API
 * compatibility but unused locally. `onProgress` reports 0-100.
 */
export function uploadImage(
  file: File,
  _folder: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const validationError = validateImage(file);
    if (validationError) {
      reject(new Error(validationError));
      return;
    }
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    reader.onload = () => {
      onProgress?.(100);
      resolve(reader.result as string);
    };
    reader.onerror = () => reject(new Error('Failed to read the image file.'));
    reader.readAsDataURL(file);
  });
}
