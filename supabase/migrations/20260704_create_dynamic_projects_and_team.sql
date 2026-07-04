create extension if not exists "uuid-ossp";

create table if not exists public.dynamic_projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  category text not null default 'autre',
  tagline text default '',
  description text default '',
  long_description text default '',
  image_url text default '',
  logo_url text default '',
  website text default '',
  status text default 'En cours',
  launch_date text default '',
  target_audience jsonb default '[]'::jsonb,
  features jsonb default '[]'::jsonb,
  benefits jsonb default '[]'::jsonb,
  technologies jsonb default '[]'::jsonb,
  cta_text text default 'Découvrir',
  cta_url text default '#',
  contact_email text default 'contact@mideessi.com',
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.dynamic_team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  short_description text default '',
  full_bio text default '',
  join_date text default '',
  education text default '',
  skills jsonb default '[]'::jsonb,
  specialties jsonb default '[]'::jsonb,
  passions jsonb default '[]'::jsonb,
  image_url text default '',
  location text default '',
  email text default '',
  social_links jsonb default '{}'::jsonb,
  projects jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.dynamic_projects enable row level security;
alter table public.dynamic_team_members enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'dynamic_projects'
      and policyname = 'Dynamic projects are viewable by everyone'
  ) then
    create policy "Dynamic projects are viewable by everyone"
      on public.dynamic_projects
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'dynamic_team_members'
      and policyname = 'Dynamic team members are viewable by everyone'
  ) then
    create policy "Dynamic team members are viewable by everyone"
      on public.dynamic_team_members
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'dynamic_projects'
      and policyname = 'Dynamic projects can be managed by admins'
  ) then
    create policy "Dynamic projects can be managed by admins"
      on public.dynamic_projects
      for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'dynamic_team_members'
      and policyname = 'Dynamic team members can be managed by admins'
  ) then
    create policy "Dynamic team members can be managed by admins"
      on public.dynamic_team_members
      for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;
end $$;
