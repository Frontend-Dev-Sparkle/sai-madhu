-- supabase/migrations/006_create_order_function.sql
-- Combines slot reservation and order creation into one atomic transaction.
-- If the order insert fails after the slot was reserved, the whole function
-- rolls back automatically — including the slot decrement — so a slot can
-- never be silently lost with no corresponding order.

create or replace function create_order(
  p_batch_id uuid,
  p_qty int,
  p_customer_name text,
  p_phone text,
  p_address text
)
returns orders
security definer
set search_path = public
as $$
declare
  v_batch batches;
  v_order orders;
  v_tracking_code text;
begin
  -- Step 1: reserve the slot, same atomic check as before
  update batches
  set slots_remaining = slots_remaining - p_qty
  where id = p_batch_id and slots_remaining >= p_qty and status = 'open'
  returning * into v_batch;

  -- If nothing was reserved, stop here — return null, nothing else runs
  if v_batch.id is null then
    return null;
  end if;

  -- Step 2: generate a short, readable tracking code
  v_tracking_code := 'SM-' || upper(substr(md5(random()::text), 1, 6));

  -- Step 3: insert the order, referencing the batch we just reserved against
  insert into orders (batch_id, tracking_code, customer_name, phone, address, quantity)
  values (p_batch_id, v_tracking_code, p_customer_name, p_phone, p_address, p_qty)
  returning * into v_order;

  return v_order;
end;
$$ language plpgsql;