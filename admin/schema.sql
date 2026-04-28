-- ================================================================
--  Ahmed Portfolio CMS — Database Schema (Supabase / PostgreSQL)
--  Run this in the Supabase SQL Editor
-- ================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── ABOUT ───────────────────────────────────────────────────────
create table about (
  id          serial primary key,
  name        text not null default '',
  title       text not null default '',
  bio1        text default '',  -- supports <accent>…</accent> tags
  bio2        text default '',
  bio3        text default '',
  bio4        text default '',
  stat_projects    text default '9+',
  stat_gpa         text default '3.63',
  stat_internships text default '2+',
  updated_at  timestamptz default now()
);
-- Single row pattern — insert one row on first setup
insert into about (name, title) values ('Ahmed Ayman Soliman', 'Data Analyst & ML Engineer');

-- ── SKILLS ──────────────────────────────────────────────────────
create table skills (
  id         serial primary key,
  name       text not null,
  level      int  not null check (level between 1 and 100),
  category   text default 'Other',  -- ML | Data Eng | Analytics | Dev | CV | NLP | Other
  icon       text default '⭐',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── PROJECTS ────────────────────────────────────────────────────
create table projects (
  id          serial primary key,
  title       text not null,
  title_ar    text default '',
  description text default '',
  desc_ar     text default '',
  short_desc  text default '',
  short_desc_ar text default '',
  tech        text[] default '{}',   -- ['Python', 'Pandas', ...]
  github      text default '',
  live        text default '',
  category    text default 'Other',  -- Machine Learning | Data Analytics | ...
  category_ar text default '',
  color       text default '#6366f1',
  images      text[] default '{}',   -- array of image URLs
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── EXPERIENCE ──────────────────────────────────────────────────
create table experience (
  id         serial primary key,
  role       text not null,
  role_ar    text default '',
  company    text not null,
  period     text not null,
  period_ar  text default '',
  type       text default 'work' check (type in ('work', 'edu')),
  bullets    text[] default '{}',  -- each bullet as a separate string
  bullets_ar text[] default '{}',
  color      text default '#6366f1',
  sort_order int  default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── REVIEWS / TESTIMONIALS ──────────────────────────────────────
create table reviews (
  id         serial primary key,
  name       text not null,
  platform   text default 'Khamsat',  -- Khamsat | Mostaql | LinkedIn | ...
  service    text default '',
  service_ar text default '',
  rating     int  default 5 check (rating between 1 and 5),
  comment    text default '',
  comment_ar text default '',
  link       text default '',
  color      text default '#6366f1',
  initials   text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── RECOMMENDATIONS ─────────────────────────────────────────────
create table recommendations (
  id          serial primary key,
  name        text not null,
  name_ar     text default '',
  title_en    text default '',
  title_ar    text default '',
  institution_en text default '',
  institution_ar text default '',
  quote_en    text default '',
  quote_ar    text default '',
  linkedin    text default '',
  followers   text default '',   -- e.g. '14K'
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── CERTIFICATES ────────────────────────────────────────────────
create table certificates (
  id          serial primary key,
  title_en    text not null,
  title_ar    text default '',
  type_en     text default 'Certificate of Achievement',
  type_ar     text default '',
  platform    text not null,
  year        text not null,  -- e.g. 'May 2025'
  description_en text default '',
  description_ar text default '',
  image_url   text default '',   -- hosted image URL or base64
  color       text default '#6366f1',
  icon        text default '🏆',
  badge       text default 'Certificate',  -- Internship | DEPI | Workshop | ...
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── LINKS ───────────────────────────────────────────────────────
create table links (
  id         serial primary key,
  label      text not null,
  url        text not null,
  sort_order int  default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── SOCIAL MEDIA ────────────────────────────────────────────────
create table social (
  id         serial primary key,
  platform   text not null,
  icon       text default '🔗',   -- emoji or icon name
  url        text not null,
  sort_order int  default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── CONTACT INFO ────────────────────────────────────────────────
create table contact (
  id         serial primary key,
  type       text not null,   -- Email | Phone | WhatsApp | Telegram | Address | Other
  value      text not null,
  sort_order int  default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ════════════════════════════════════════════════════════════════
--  AUTO-UPDATE TRIGGER (keeps updated_at fresh on every row edit)
-- ════════════════════════════════════════════════════════════════
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply trigger to all tables
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'about','skills','projects','experience','reviews',
    'recommendations','certificates','links','social','contact'
  ] loop
    execute format(
      'create trigger trg_%s_updated before update on %s
       for each row execute function set_updated_at()',
      tbl, tbl
    );
  end loop;
end;
$$;

-- ════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
--  Public: SELECT only
--  Admin (service-role key from dashboard): full access
-- ════════════════════════════════════════════════════════════════
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'about','skills','projects','experience','reviews',
    'recommendations','certificates','links','social','contact'
  ] loop
    execute format('alter table %s enable row level security', tbl);
    execute format(
      'create policy "Public read" on %s for select using (true)', tbl
    );
    execute format(
      'create policy "Admin write" on %s for all
       using (auth.role() = ''service_role'')', tbl
    );
  end loop;
end;
$$;
