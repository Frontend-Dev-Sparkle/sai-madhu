create table batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'closed',
  slot_limit int not null,
  slots_remaining int not null,
  opens_at timestamptz,
  created_at timestamptz default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references batches(id),
  tracking_code text unique not null,
  customer_name text not null,
  phone text not null,
  address text not null,
  quantity int not null,
  status text not null default 'requested',
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  sender text not null,
  body text not null,
  flagged boolean default false,
  created_at timestamptz default now()
);
