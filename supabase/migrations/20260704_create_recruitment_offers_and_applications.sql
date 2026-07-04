create extension if not exists "uuid-ossp";

create table if not exists public.recruitment_offers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  role text not null,
  location text default '',
  type text default 'Temps plein',
  description text default '',
  requirements jsonb default '[]'::jsonb,
  apply_link text default '',
  image_url text default '',
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.recruitment_applications (
  id uuid primary key default uuid_generate_v4(),
  offer_id uuid references public.recruitment_offers(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text default '',
  cv_url text default '',
  portfolio_url text default '',
  cover_letter text default '',
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.recruitment_offers enable row level security;
alter table public.recruitment_applications enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'recruitment_offers'
      and policyname = 'Recruitment offers are viewable by everyone'
  ) then
    create policy "Recruitment offers are viewable by everyone"
      on public.recruitment_offers
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'recruitment_applications'
      and policyname = 'Recruitment applications can be inserted by anyone'
  ) then
    create policy "Recruitment applications can be inserted by anyone"
      on public.recruitment_applications
      for insert
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'recruitment_applications'
      and policyname = 'Recruitment applications are readable by admins'
  ) then
    create policy "Recruitment applications are readable by admins"
      on public.recruitment_applications
      for select
      using (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'recruitment_offers'
      and policyname = 'Recruitment offers can be managed by admins'
  ) then
    create policy "Recruitment offers can be managed by admins"
      on public.recruitment_offers
      for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;
end $$;
