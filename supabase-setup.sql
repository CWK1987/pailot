-- ============================================================
-- pailot — Supabase setup script
-- ============================================================
-- HOW TO USE THIS FILE:
-- 1. Go to your Supabase project -> SQL Editor (left sidebar)
-- 2. Click "New query"
-- 3. Paste this ENTIRE file in
-- 4. Click "Run"
-- That's it — this creates everything: tables, security rules, storage buckets.
-- You only ever run this once.
-- ============================================================

-- 1. PROFILES TABLE
-- One row per user. Created automatically when someone signs up (see trigger below).
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  surname text,
  email text,
  bio text,
  avatar_url text,
  lang text default 'en',
  plan text default 'free',
  xp integer default 0,
  streak integer default 0,
  daily_minutes integer default 0,
  goal_minutes integer default 30,
  uploads_today integer default 0,
  tutor_questions_today integer default 0,
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

-- Anyone signed in can read everyone's profile (needed for the public leaderboard)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- People can only edit their OWN profile, never anyone else's
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Automatically create a profile row the moment someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, surname, email)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'surname',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. RESOURCES TABLE
-- This is your library of past papers, study guides, videos etc.
-- You'll add rows to this through the in-app Admin Upload screen — you never need
-- to touch this table directly, but it lives here so the website can read it.
create table public.resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null,          -- 'papers' | 'guides' | 'notes' | 'video'
  subject text,
  grade text,                  -- e.g. 'Grade 10', 'Grade 11-12', 'All grades'
  tier integer default 0,      -- 0 = Free, 1 = Advanced+, 2 = Premium only
  file_url text,               -- where the actual PDF/video file lives in Storage
  is_new boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.resources enable row level security;

create policy "Resources are viewable by everyone"
  on public.resources for select
  using ( true );

-- Only admins (your account) can add/edit/delete resources
create policy "Only admins can insert resources"
  on public.resources for insert
  with check ( (select is_admin from public.profiles where id = auth.uid()) = true );

create policy "Only admins can update resources"
  on public.resources for update
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );

create policy "Only admins can delete resources"
  on public.resources for delete
  using ( (select is_admin from public.profiles where id = auth.uid()) = true );


-- 3. STORAGE BUCKETS
-- Where actual files (PDFs, videos, profile pictures) physically live.
insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone can view files in both buckets (they're public study material / profile pics)
create policy "Public read access for resources"
  on storage.objects for select
  using ( bucket_id = 'resources' );

create policy "Public read access for avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Only admins can upload to the resources bucket
create policy "Only admins can upload resources"
  on storage.objects for insert
  with check (
    bucket_id = 'resources'
    and (select is_admin from public.profiles where id = auth.uid()) = true
  );

-- Any signed-in user can upload their OWN avatar
create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
  );


-- ============================================================
-- 4. MAKE YOURSELF AN ADMIN
-- ============================================================
-- After you sign up on the live website ONE time, come back here and run this
-- single line (replacing the email with the one you signed up with) to give
-- yourself access to the Admin Upload screen for Resources:
--
-- update public.profiles set is_admin = true where email = 'your-email@example.com';
-- ============================================================
