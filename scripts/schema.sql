-- Kroma/Kraken — Supabase schema + Row Level Security.
-- Idempotent: safe to run multiple times. Applied by scripts/migrate.mjs.
--
-- RLS model: the public site uses the anon (publishable) key; the admin panel
-- uses an authenticated Supabase Auth session. So: anon can read published
-- content and submit contacts; authenticated users (= your admins) can do
-- everything. IMPORTANT: disable public sign-ups in Supabase Auth so that
-- "authenticated" only ever means an admin you created in the dashboard.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tables ----

create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null default '',
  slug            text not null unique,
  content         text not null default '',
  excerpt         text not null default '',
  cover_image     text not null default '',
  category        text not null default '',
  tags            text[] not null default '{}',
  author          text not null default '',
  author_role     text not null default '',
  read_time       text not null default '',
  status          text not null default 'draft' check (status in ('draft','published')),
  seo_title       text not null default '',
  seo_description text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz
);

create table if not exists public.portfolio (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null default '',
  category    text not null default '',
  image       text not null default '',
  client      text not null default '',
  duration    text not null default '',
  challenge   text not null default '',
  solution    text not null default '',
  results     text[] not null default '{}',
  content     text not null default '',
  status      text not null default 'draft' check (status in ('draft','published')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.jobs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default '',
  department  text not null default '',
  location    text not null default '',
  type        text not null default 'Full-time',
  description text not null default '',
  status      text not null default 'published' check (status in ('draft','published')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.pages (
  id              text primary key,
  fields          jsonb not null default '{}'::jsonb,
  seo_title       text not null default '',
  seo_description text not null default '',
  updated_at      timestamptz not null default now()
);

create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null default '',
  last_name   text not null default '',
  email       text not null default '',
  service     text not null default '',
  details     text not null default '',
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------------- rls ----

alter table public.posts     enable row level security;
alter table public.portfolio enable row level security;
alter table public.jobs      enable row level security;
alter table public.pages     enable row level security;
alter table public.contacts  enable row level security;

-- posts / portfolio / jobs: public reads published; authenticated does all.
drop policy if exists "posts read"  on public.posts;
drop policy if exists "posts admin" on public.posts;
create policy "posts read"  on public.posts  for select using (status = 'published' or auth.role() = 'authenticated');
create policy "posts admin" on public.posts  for all to authenticated using (true) with check (true);

drop policy if exists "portfolio read"  on public.portfolio;
drop policy if exists "portfolio admin" on public.portfolio;
create policy "portfolio read"  on public.portfolio for select using (status = 'published' or auth.role() = 'authenticated');
create policy "portfolio admin" on public.portfolio for all to authenticated using (true) with check (true);

drop policy if exists "jobs read"  on public.jobs;
drop policy if exists "jobs admin" on public.jobs;
create policy "jobs read"  on public.jobs for select using (status = 'published' or auth.role() = 'authenticated');
create policy "jobs admin" on public.jobs for all to authenticated using (true) with check (true);

-- pages: public reads all; authenticated writes.
drop policy if exists "pages read"  on public.pages;
drop policy if exists "pages admin" on public.pages;
create policy "pages read"  on public.pages for select using (true);
create policy "pages admin" on public.pages for all to authenticated using (true) with check (true);

-- contacts: anyone may submit; only authenticated may read/delete.
drop policy if exists "contacts insert" on public.contacts;
drop policy if exists "contacts read"   on public.contacts;
drop policy if exists "contacts delete" on public.contacts;
create policy "contacts insert" on public.contacts for insert to anon, authenticated with check (true);
create policy "contacts read"   on public.contacts for select to authenticated using (true);
create policy "contacts delete" on public.contacts for delete to authenticated using (true);
