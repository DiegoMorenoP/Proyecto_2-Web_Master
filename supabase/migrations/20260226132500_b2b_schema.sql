-- Empresas / Instaladoras B2B
create table public.companies (
  id uuid default gen_random_uuid() primary key,
  cif text unique not null,
  name text not null,
  legal_name text,
  address text,
  city text,
  postal_code text,
  country text default 'España',
  phone_number text,
  tier varchar(20) default 'bronze', -- bronze, silver, gold
  status varchar(20) default 'pending_validation', -- pending_validation, active, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tiers y Descuentos
create table public.price_tiers (
  id varchar(20) primary key,
  discount_percentage numeric(5,2) not null,
  description text
);
insert into public.price_tiers (id, discount_percentage, description) values
('bronze', 5.00, 'Descuento base instaladores'),
('silver', 10.00, 'Descuento instaladores frecuentes'),
('gold', 15.00, 'Descuento de volumen / VIP');

-- Perfiles de usuario (con link a la empresa)
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles alter column role drop default;
alter table public.profiles alter column role set default 'installer';
alter table public.profiles add column if not exists company_id uuid references public.companies(id) on delete set null;

-- Actualizar productos existentes con datos B2B
alter table public.products
add column if not exists sku text unique,
add column if not exists pack_quantity integer default 1, -- Para venta por pallets o cajas
add column if not exists base_price numeric; -- Para guardar precio original B2B si price es PVP

-- Pedidos (Orders B2B)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) not null,
  user_id uuid references public.profiles(id) not null, -- Quien hizo el pedido
  status varchar(20) default 'draft', -- draft, processing, shipped, delivered, cancelled
  total_amount numeric not null default 0,
  shipping_address text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null,
  unit_price numeric not null, -- Precio despues del descuento B2B
  total_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documentos B2B (Facturas, Albaranes, Certificados)
create type document_type as enum ('invoice', 'delivery_note', 'certificate', 'tech_sheet', 'rma');
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id),
  order_id uuid references public.orders(id) on delete cascade, -- Nullable, si es genérico
  type document_type not null,
  file_url text not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Presupuestos de Instalador a Cliente Final (Marca Blanca)
create table public.installer_quotes (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references public.companies(id) not null,
  client_name text not null,
  client_address text,
  total_amount numeric not null,
  margin_applied numeric(5,2), -- % de margen añadido por el instalador
  pdf_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) para B2B
alter table public.companies enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.documents enable row level security;
alter table public.installer_quotes enable row level security;

-- Policies
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view their own company" on public.companies for select using (id in (select company_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can view their company orders" on public.orders for select using (company_id in (select company_id from public.profiles where profiles.id = auth.uid()));
create policy "Users can insert orders for their company" on public.orders for insert with check (company_id in (select company_id from public.profiles where profiles.id = auth.uid()));

create policy "Users can view their company order items" on public.order_items for select using (order_id in (select id from public.orders where company_id in (select company_id from public.profiles where profiles.id = auth.uid())));
create policy "Users can insert order items for their company" on public.order_items for insert with check (order_id in (select id from public.orders where company_id in (select company_id from public.profiles where profiles.id = auth.uid())));

create policy "Users can view their company documents" on public.documents for select using (company_id in (select company_id from public.profiles where profiles.id = auth.uid()) or company_id is null);
