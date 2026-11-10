# 🏏 MoonQuiz — Live Classroom Cricket Quiz (Supabase Edition)

A mobile-first live classroom quiz app with authentic cricket-style scoring, built with **React (Vite, plain JavaScript)** and real-time state synchronization via **Supabase Realtime**.

---

## ⚡ Setup Supabase in 2 Minutes

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com/) and create a free account & project.
2. Go to **Project Settings > API**.
3. Copy your **Project URL** and **`anon` `public` key**.

### 2. Run the Database Script
1. In the Supabase Dashboard, click on **SQL Editor** on the left menu.
2. Click **New Query**.
3. Paste the contents of [`supabase_schema.sql`](file:///c:/Users/Zuizz/Documents/Projects/Moonquiz/supabase_schema.sql) and click **Run**:

```sql
-- 1. Create table for game state
create table if not exists public.game_state (
  id int primary key default 1,
  status text not null default 'idle',
  start_at bigint,
  reset_at bigint default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- 3. Enable RLS and public policies
alter table public.game_state enable row level security;
alter table public.players enable row level security;

create policy "Allow public read game_state" on public.game_state for select using (true);
create policy "Allow public update game_state" on public.game_state for all using (true) with check (true);

create policy "Allow public read players" on public.players for select using (true);
create policy "Allow public all players" on public.players for all using (true) with check (true);

-- 4. Enable Supabase Realtime
alter publication supabase_realtime add table public.game_state;
alter publication supabase_realtime add table public.players;
```

---

## 🔑 Configure Your `.env` File

Open [`.env`](file:///c:/Users/Zuizz/Documents/Projects/Moonquiz/.env) in the project root and fill in your keys:

```env
# MoonQuiz Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Secret key required in query param (?host=SECRET) to access host controls
VITE_HOST_SECRET=umpire2026
```

---

## 🏃 Run Locally

```bash
npm run dev
```

- **Host (Teacher / Projector):** `http://localhost:5173/?host=umpire2026`
- **Students (Phones):** `http://localhost:5173/`

*(Note: Even before you paste your Supabase keys, the app automatically runs in local `BroadcastChannel` mode so you can test between multiple tabs on your computer immediately!)*

---

## 🌐 Deploy to Vercel or Netlify (Free)

1. Connect your repository to **Vercel** or **Netlify**.
2. Add the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_HOST_SECRET`
3. Deploy!
