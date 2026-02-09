-- Create Enum for item status
create type item_status as enum ('pending', 'approved', 'rejected');

-- Categories Table
create table public.categories (
  id uuid not null default gen_random_uuid() primary key,
  slug text not null unique,
  name text not null,
  description text,
  seo_meta jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Items Table
create table public.items (
  id uuid not null default gen_random_uuid() primary key,
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  affiliate_link text,
  logo_url text,
  website_url text,
  status item_status not null default 'pending',
  featured boolean not null default false,
  vote_count int not null default 0,
  score float not null default 0,
  created_at timestamptz not null default now()
);

-- Votes Table (Dynamic Edge)
create table public.votes (
  id uuid not null default gen_random_uuid() primary key,
  item_id uuid not null references public.items(id) on delete cascade,
  session_id text not null, -- Stores fingerprint or anonymous ID
  value int not null default 1 check (value in (1, -1)),
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index idx_items_category on public.items(category_id);
create index idx_items_slug on public.items(slug);
create index idx_votes_item_session on public.votes(item_id, session_id);
create index idx_votes_session on public.votes(session_id);

-- RLS Policies (Security)
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.votes enable row level security;

-- Policies
create policy "Public categories are viewable by everyone" on public.categories for select using (true);
create policy "Public and approved items are viewable by everyone" on public.items for select using (status = 'approved'); 
create policy "Public can submit items" on public.items for insert with check (true);
create policy "Anyone can vote" on public.votes for insert with check (true);
