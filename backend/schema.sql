-- Enable pgcrypto for encryption
create extension if not exists pgcrypto;

-- USERS TABLE
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  stripe_customer_id text,
  gateway_token text,
  agent_url text,
  llm_provider text,
  llm_model text,
  subscription_status text default 'inactive', -- active, past_due, canceled
  instance_status text default 'none', -- provisioning, active, error, stopped
  instance_ip text,
  instance_id text, -- DigitalOcean Droplet ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- API KEYS (Encrypted Storage)
-- The supervisor will request these to inject into the container
create table public.user_secrets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  service text not null, -- e.g., 'OPENAI', 'TELEGRAM', 'TWILIO'
  encrypted_value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, service)
);

-- ACTIVITY LOG (Feed for Dashboard)
create table public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  level text default 'info', -- info, warning, error, success
  message text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INSTANCE HEARTBEATS
create table public.instance_heartbeats (
  user_id uuid references public.users primary key,
  last_seen timestamp with time zone,
  cpu_usage int,
  memory_usage int,
  version text,
  status text
);

-- USER USAGE TRACKING (Free tier)
create table public.user_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null unique,
  action_count int default 0,
  plan text default 'free',
  last_action_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FUNCTIONS
-- Helper to encrypt keys before inserting (usually done client-side or in edge function, but DB func is backup)
create or replace function encrypt_secret(secret text, key text) returns text as $$
begin
  return pgp_sym_encrypt(secret, key);
end;
$$ language plpgsql;
