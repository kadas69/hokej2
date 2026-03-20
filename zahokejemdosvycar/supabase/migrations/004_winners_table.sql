-- Winners table for the public winners board (16 slots)
create table if not exists winners (
  id uuid primary key default gen_random_uuid(),
  slot_number integer not null unique check (slot_number >= 1 and slot_number <= 16),
  first_name text not null,
  last_name text not null,
  revealed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Allow public read access
alter table winners enable row level security;

create policy "Winners are publicly readable"
  on winners for select
  using (true);
