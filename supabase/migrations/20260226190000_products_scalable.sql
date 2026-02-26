-- Migration to scale products for B2B

-- Add generic category and subcategory slugs
alter table public.products 
add column if not exists category_slug text,
add column if not exists subcategory_slug text,
add column if not exists specifications jsonb default '{}'::jsonb;

-- Update existing items to match new category structure where possible
update public.products set category_slug = 'paneles-solares', subcategory_slug = 'monocristalinos' where type = 'panel';
update public.products set category_slug = 'inversores', subcategory_slug = 'hibridos' where type = 'inverter';
update public.products set category_slug = 'baterias-solares', subcategory_slug = 'litio' where type = 'battery';

-- Also add to kits for unified queries if needed, although kits may remain in their own table
alter table public.kits
add column if not exists category_slug text default 'kits-solares',
add column if not exists subcategory_slug text,
add column if not exists specifications jsonb default '{}'::jsonb;

update public.kits set subcategory_slug = 'vivienda-aislada' where type = 'isolated';
update public.kits set subcategory_slug = 'autoconsumo-red' where type = 'grid';
update public.kits set subcategory_slug = 'autoconsumo-red' where type = 'hybrid';
