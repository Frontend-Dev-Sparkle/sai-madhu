import TrackClient from "@/components/trackClient";
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, batches(name)")
    .eq("tracking_code", code)
    .maybeSingle();

  const { data: initialMessages } = order
    ? await supabase
        .from("messages")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  if (!order) {
    notFound();
  }

  return <TrackClient order={order} initialMessages={initialMessages ?? []} />;
}
