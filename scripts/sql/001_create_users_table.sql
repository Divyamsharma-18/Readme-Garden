-- Run this in your Supabase SQL editor (or via psql) to create the expected table.
-- If you prefer a different table name (e.g., profiles), either:
--  1) rename below, or
--  2) keep "users" and set SUPABASE_USER_TABLE=users in your env (default).

create table if not exists public.users (
  id text primary key, -- or uuid if your auth user IDs are uuid; adjust type if needed
  subscription_status text check (subscription_status in ('pro', 'free')) default 'free',
  subscription_start timestamptz,
  subscription_end timestamptz,
  daily_usage_limit integer default 5,
  uses_today integer default 0,
  last_usage_reset timestamptz,
  updated_at timestamptz default now()
);

-- Helpful index
create index if not exists users_subscription_end_idx on public.users (subscription_end);
