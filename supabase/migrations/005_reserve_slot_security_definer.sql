-- supabase/migrations/005_reserve_slot_security_definer.sql
-- reserve_slot must run as SECURITY DEFINER because it updates batches.slots_remaining,
-- and anon intentionally has no direct update policy on that table (see 002_rls_policies.sql) —
-- granting one would let any customer set any batch's slot count directly. This function is the
-- single, narrow, audited exception: it can only ever do exactly what's written here.
create or replace function reserve_slot(p_batch_id uuid, p_qty int)
returns batches
security definer
set search_path = public
as $$
declare
  result batches;
begin
  update batches
  set slots_remaining = slots_remaining - p_qty
  where id = p_batch_id and slots_remaining >= p_qty and status = 'open'
  returning * into result;

  return result;
end;
$$ language plpgsql;