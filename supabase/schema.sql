create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  phone text not null,
  email text not null,
  zip_code text not null,
  service_type text not null,
  date_needed text,
  details text,
  property_type text not null,
  bedrooms int,
  bathrooms int,
  status text not null default 'new',
  assigned_provider_id uuid,
  matched_at timestamptz,
  booked_at timestamptz
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  owner_name text not null,
  email text not null unique,
  phone text not null,
  website text,
  service_area text not null,
  team_size text not null,
  plan text not null,
  status text not null default 'pending',
  stripe_customer_id text,
  is_approved boolean not null default false
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  stripe_subscription_id text not null unique,
  plan_name text not null,
  status text not null default 'inactive',
  current_period_end timestamptz
);

create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  provider_id uuid references public.providers(id) on delete set null,
  event_type text not null,
  notes text
);
