-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PRODUCTS TABLE
create type product_type as enum ('panel', 'inverter', 'battery');
create type stock_status as enum ('in_stock', 'low_stock', 'out_of_stock');

create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type product_type not null,
  price numeric not null,
  voltage numeric,
  tech_spec_pdf text,
  image_url text,
  stock_status stock_status default 'in_stock',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- KITS TABLE
create type kit_type as enum ('isolated', 'grid', 'hybrid');

create table public.kits (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type kit_type not null,
  total_power numeric not null, -- kW
  price numeric not null,
  monthly_finance_cost numeric not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEADS TABLE
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  address text,
  monthly_bill numeric,
  roof_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SIMULATIONS TABLE
create table public.simulations (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.leads(id),
  recommended_kit_id uuid references public.kits(id),
  estimated_savings_year_1 numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Example: Public Read for Products/Kits)
alter table public.products enable row level security;
create policy "Public products are viewable by everyone" on public.products for select using (true);

alter table public.kits enable row level security;
create policy "Public kits are viewable by everyone" on public.kits for select using (true);

alter table public.leads enable row level security;
create policy "Leads can be created by anyone" on public.leads for insert with check (true);
