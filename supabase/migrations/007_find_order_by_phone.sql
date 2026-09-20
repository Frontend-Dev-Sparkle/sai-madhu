-- supabase/migrations/007_find_order_by_phone.sql
-- Returns only tracking codes for a given phone number — deliberately not
-- full order details, since phone numbers are a much smaller/guessable
-- search space than tracking codes and shouldn't expose addresses etc.
create or replace function find_orders_by_phone(p_phone text)
returns table (tracking_code text, created_at timestamptz)
security definer
set search_path = public
as $$
begin
  return query
  select o.tracking_code, o.created_at
  from orders o
  where o.phone = p_phone
  order by o.created_at desc;
end;
$$ language plpgsql;