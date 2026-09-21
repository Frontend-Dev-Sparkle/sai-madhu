-- supabase/migrations/009_admin_management_policies.sql
-- Admin write access: only `authenticated` (the single admin account) can
-- manage batches and order status. Also widens existing anon-only read/write
-- policies so the admin's authenticated session isn't blocked by RLS on
-- logic shared with customers (same fix pattern as 008).

alter policy "Orders viewable by tracking code" on orders to anon, authenticated;
alter policy "Messages viewable if you know the order" on messages to anon, authenticated;
alter policy "Anyone can send a message on an existing order" on messages to anon, authenticated;

create policy "Admin can create batches"
on batches for insert
to authenticated
with check (true);

create policy "Admin can update batches"
on batches for update
to authenticated
using (true)
with check (true);

create policy "Admin can update orders"
on orders for update
to authenticated
using (true)
with check (true);