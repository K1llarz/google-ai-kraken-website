import { createClient } from '@supabase/supabase-js';

/**
 * Supabase browser client. Reads Vite env vars (import.meta.env) — NOT
 * process.env / NEXT_PUBLIC_*, which only exist in Next.js. Set values in
 * .env.local: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.
 *
 * The publishable key is safe to expose in the client bundle; protect data
 * with Row Level Security policies in your Supabase project.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env.local',
  );
}

export const supabase = createClient(url ?? '', key ?? '');
