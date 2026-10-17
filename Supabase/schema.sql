-- Cotuí Express: esquema inicial para Supabase/PostgreSQL.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key,
  kind text not null check (kind in ('Viaje','Envío')),
  name text not null,
  phone text not null,
  origin text not null,
  destination text not null,
  date date,
  detail text,
  status text not null default 'Solicitud recibida',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

-- El cliente puede crear una solicitud, pero no listar todas las solicitudes.
-- La lectura y edición de las solicitudes queda limitada al personal admin.
drop policy if exists "booking public create" on public.bookings;
create policy "booking public create" on public.bookings for insert to anon, authenticated
  with check (kind in ('Viaje','Envío') and status = 'Solicitud recibida');

drop policy if exists "admin reads bookings" on public.bookings;
create policy "admin reads bookings" on public.bookings for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "admin updates bookings" on public.bookings;
create policy "admin updates bookings" on public.bookings for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "user reads own profile" on public.profiles;
create policy "user reads own profile" on public.profiles for select to authenticated using (id = auth.uid());

-- Para habilitar un administrador:
-- 1) Crea el usuario en Supabase Dashboard > Authentication > Users.
-- 2) Copia su UUID y ejecuta:
-- insert into public.profiles (id, full_name, role)
-- values ('UUID-DEL-USUARIO', 'Administrador Cotuí Express', 'admin')
-- on conflict (id) do update set role = 'admin';


-- Función de seguimiento público: devuelve solo campos no sensibles y evita exponer
-- nombres/teléfonos al consultar una tabla completa desde el navegador.
create or replace function public.track_booking(tracking_code text)
returns table (id text, kind text, origin text, destination text, status text, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select b.id, b.kind, b.origin, b.destination, b.status, b.created_at
  from public.bookings b
  where b.id = upper(trim(tracking_code))
  limit 1;
$$;
revoke all on function public.track_booking(text) from public;
grant execute on function public.track_booking(text) to anon, authenticated;
