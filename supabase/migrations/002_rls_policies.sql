create policy "Anyone can view batches"
on batches for select
to anon
using (true);

create policy "Anyone can create an order"
on orders for insert
to anon
with check (true);

create policy "Orders viewable by tracking code"
on orders for select
to anon
using (true);

create policy "Messages viewable if you know the order"
on messages for select
to anon
using (
  exists (
    select 1 from orders
    where orders.id = messages.order_id
  )
);

create policy "Anyone can send a message on an existing order"
on messages for insert
to anon
with check (
  exists (
    select 1 from orders
    where orders.id = messages.order_id
  )
);