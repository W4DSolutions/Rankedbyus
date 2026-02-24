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
  session_id text,
  user_id uuid references auth.users(id),
  ip_address text,
  user_agent text,
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

-- Tags Table
create table public.tags (
  id uuid not null default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  color text, -- Optional: CSS color or class
  created_at timestamptz not null default now()
);

-- Item-Tag Junction Table
create table public.item_tags (
  id uuid not null default gen_random_uuid() primary key,
  item_id uuid not null references public.items(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(item_id, tag_id)
);

-- RLS for Tags
alter table public.tags enable row level security;
alter table public.item_tags enable row level security;

create policy \
Public
tags
are
viewable
by
everyone\ on public.tags for select using (true);
create policy \Public
item_tags
are
viewable
by
everyone\ on public.item_tags for select using (true);


-- Reviews Table
create table public.reviews (
  id uuid not null default gen_random_uuid() primary key,
  item_id uuid not null references public.items(id) on delete cascade,
  session_id text,
  user_id uuid references auth.users(id),
  rating int not null check (rating >= 1 and rating <= 5),
  comment text, 
  status item_status not null default 'pending',
  helpful_count int not null default 0,
  created_at timestamptz not null default now(),
  unique(item_id, session_id),
  unique(item_id, user_id)
);

-- RLS for Reviews
alter table public.reviews enable row level security;
create policy \
Public
reviews
are
viewable
by
everyone\ on public.reviews for select using (status = 'approved');
create policy \Anyone
can
submit
a
review\ on public.reviews for insert with check (true);


-- Adding rating stats to items
alter table public.items 
add column average_rating float not null default 0,
add column review_count int not null default 0;

-- Function to increment click count
create or replace function increment_click_count(item_row_id uuid)
returns void as $$
begin
  update public.items
  set click_count = click_count + 1
  where id = item_row_id;
end;
$$ language plpgsql security modeller;

-- Function to increment review helpful count
create or replace function increment_review_helpful(review_row_id uuid)
returns void as $$
begin
  update public.reviews
  set helpful_count = helpful_count + 1
  where id = review_row_id;
end;

-- Vote Audit Logs (for security)
create table public.vote_audit_logs (
  id uuid not null default gen_random_uuid() primary key,
  ip_address text,
  user_agent text,
  session_id text,
  item_id uuid,
  action text not null, -- 'vote_cast', 'rate_limited', etc.
  message text,
  created_at timestamptz not null default now()
);

-- RLS for Audit Logs
alter table public.vote_audit_logs enable row level security;

