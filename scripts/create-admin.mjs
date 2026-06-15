/**
 * One-time bootstrap for an admin account.
 *
 * Usage:
 *   node scripts/create-admin.mjs [email] [password]
 *
 * Defaults to the demo credentials below. This script:
 *   1. Creates (or signs in to) a Firebase Auth email/password user.
 *   2. Attempts to write the admins/{uid} doc that grants admin access.
 *
 * Step 1 requires Email/Password sign-in to be ENABLED in the Firebase console.
 * Step 2 will be DENIED by security rules (admins is `write: if false`) — that
 * is expected. Create the admins/{uid} doc from the console instead; this
 * script prints the exact UID to use.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(here, '..', 'firebase-applet-config.json'), 'utf8'));

const email = process.argv[2] || 'demo@kroma.agency';
const password = process.argv[3] || 'KromaDemo!2026';

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId);

async function main() {
  let uid;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    uid = cred.user.uid;
    console.log(`✓ Created auth user ${email}`);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log(`• User ${email} already exists. Verifying password…`);
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
        console.log('• Signed in — password matches.');
      } catch (signInErr) {
        console.error('✗ The account exists but that password does not match it');
        console.error('  (or it was created via Google sign-in, which has no password).');
        console.error('  Reset it: Firebase console → Authentication → Users → ⋮ → Reset password,');
        console.error('  or use a different email for the admin account.');
        process.exit(1);
      }
    } else if (err.code === 'auth/operation-not-allowed') {
      console.error('✗ Email/Password sign-in is not enabled.');
      console.error('  Enable it: Firebase console → Authentication → Sign-in method → Email/Password.');
      process.exit(1);
    } else {
      throw err;
    }
  }

  console.log(`\n  UID: ${uid}\n`);

  try {
    await setDoc(doc(db, 'admins', uid), { email, createdAt: serverTimestamp() });
    console.log('✓ Wrote admins/' + uid + ' — this account is now an admin.');
  } catch (err) {
    console.log('• Could not write the admins doc (expected — rules block it).');
    console.log('  Finish in the console: Firestore → database "' + config.firestoreDatabaseId + '"');
    console.log('  → collection "admins" → add document with ID:');
    console.log('     ' + uid);
    console.log('  (any field, e.g. email: "' + email + '")');
  }
  process.exit(0);
}

main().catch((e) => {
  console.error('Unexpected error code:', e.code || '(none)');
  console.error('Message:', e.message || e);
  process.exit(1);
});
