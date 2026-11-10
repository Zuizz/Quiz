-- ==========================================
-- MoonQuiz Supabase Schema & Realtime Setup
-- ==========================================
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New query -> Paste & Run

-- 1. Create table for game state (single row id = 1)
create table if not exists public.game_state (
  id int primary key default 1,
  status text not null default 'idle',
  start_at bigint,
  reset_at bigint default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure the initial row exists
insert into public.game_state (id, status, start_at, reset_at)
values (1, 'idle', null, 0)
on conflict (id) do nothing;

-- 2. Create table for players
create table if not exists public.players (
  id text primary key,
  name text not null,
  score int not null default 0,
  wickets int not null default 0,
  joined_q int not null default 0,
  answers jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS) with open public access policies
alter table public.game_state enable row level security;
alter table public.players enable row level security;

-- Policies for game_state
drop policy if exists "Allow public read game_state" on public.game_state;
create policy "Allow public read game_state"
  on public.game_state for select
  using (true);

drop policy if exists "Allow public update game_state" on public.game_state;
create policy "Allow public update game_state"
  on public.game_state for all
  using (true)
  with check (true);

-- Policies for players
drop policy if exists "Allow public read players" on public.players;
create policy "Allow public read players"
  on public.players for select
  using (true);

drop policy if exists "Allow public all players" on public.players;
create policy "Allow public all players"
  on public.players for all
  using (true)
  with check (true);

-- 4. Enable Supabase Realtime for instant broadcast across devices
alter publication supabase_realtime add table public.game_state;
alter publication supabase_realtime add table public.players;

