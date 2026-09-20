-- supabase/migrations/008_batches_authenticated_read.sql
-- The batches select policy was scoped to `anon` only. Since the admin's own
-- browser session makes them `authenticated` even when just viewing the
-- public site, they were being silently blocked from seeing batch data by
-- RLS on any page outside /admin. Widening the existing policy's roles
-- fixes this without duplicating the read rule.
alter policy "Anyone can view batches"
on batches
to anon, authenticated
using (true);