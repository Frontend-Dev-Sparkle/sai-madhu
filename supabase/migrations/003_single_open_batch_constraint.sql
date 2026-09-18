-- Enforces that only one batch can have status = 'open' at any time.
-- Sai Madhu processes batches sequentially, never in parallel, so this
-- constraint prevents accidentally opening a second batch before the
-- current one is closed/dispatched — enforced at the database level so
-- it can't be bypassed by an app bug or a direct SQL edit.
create unique index one_open_batch_only
on batches (status)
where status = 'open';