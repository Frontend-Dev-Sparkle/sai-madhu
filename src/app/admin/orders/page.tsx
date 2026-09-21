// src/app/admin/orders/page.tsx
import { createClient } from "@/lib/server";
import OrdersClient from "@/components/admin/ordersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: flaggedRows } = await supabase
    .from("messages")
    .select("order_id")
    .eq("flagged", true);
  const flaggedIds = Array.from(
    new Set(flaggedRows?.map((r) => r.order_id) ?? []),
  );

  return (
    <div className="px-4 md:px-8 py-6 md:py-7">
      <h1 className="font-display font-medium text-ink text-xl md:text-2xl mb-4">
        Orders
      </h1>
      <OrdersClient initialOrders={orders ?? []} flaggedIds={flaggedIds} />
    </div>
  );
}
