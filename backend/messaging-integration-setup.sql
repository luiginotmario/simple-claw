-- Add this to Supabase SQL Editor (run after main setup)
-- This enables phone number routing for WhatsApp and Telegram

-- MESSAGING INTEGRATIONS (Phone/Chat ID mapping)
create table public.messaging_integrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users not null,
  platform text not null, -- 'whatsapp', 'telegram'
  platform_user_id text not null, -- Phone: '+15551234567' or Telegram chat_id: '123456789'
  is_active boolean default true not null,
  linked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(platform, platform_user_id)
);

-- Index for fast lookups (router will query this on every message)
create index idx_messaging_platform_user on public.messaging_integrations(platform, platform_user_id) where is_active = true;

-- RLS Policies
alter table public.messaging_integrations enable row level security;

create policy "Users can read own messaging integrations"
  on public.messaging_integrations for select
  using (auth.uid() = user_id);

create policy "Users can insert own messaging integrations"
  on public.messaging_integrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own messaging integrations"
  on public.messaging_integrations for update
  using (auth.uid() = user_id);
