/**
 * Local-only schema migration runner.
 *
 * Connects directly to your Supabase Postgres using DATABASE_URL from .env and
 * applies scripts/schema.sql. This runs on YOUR machine in Node — it is never
 * bundled into the app. DATABASE_URL is the superuser connection (bypasses
 * RLS), so keep .env out of git (it already is) and never import it from src/.
 *
 * Usage:
 *   1. Put your real DB password in .env (Supabase → Project Settings →
 *      Database → Connection string / password).
 *   2. node scripts/migrate.mjs
 */
import 'dotenv/config';
import postgres from 'postgres';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const url = process.env.DATABASE_URL;

if (!url || url.includes('[YOUR-PASSWORD]')) {
  console.error('✗ Set DATABASE_URL in .env with your real Supabase DB password first.');
  process.exit(1);
}

const sql = postgres(url, { ssl: 'require', onnotice: () => {} });

try {
  const schema = readFileSync(join(here, 'schema.sql'), 'utf8');
  await sql.unsafe(schema);
  console.log('✓ Schema applied successfully (tables + RLS).');
} catch (err) {
  console.error('✗ Migration failed:', err.message ?? err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
