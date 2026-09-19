-- supabase/migrations/004_reserve_slot_function.sql
-- Re-declaring here since this function may have been missed when
-- 001_initial_schema.sql was first run — create or replace makes this safe
-- to run regardless of whether it already existed.
create or replace function reserve_slot(p_batch_id uuid, p_qty int)
returns batches as $$
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