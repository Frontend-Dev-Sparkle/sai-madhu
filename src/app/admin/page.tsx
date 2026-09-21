// src/app/admin/page.tsx
import { createClient } from "@/lib/server";
import BatchControls from "@/components/admin/batchControls";

export const dynamic = "force-dynamic";

const STATUSES = ["requested", "confirmed", "processing", "dispatched"];

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const { data: batch } = await supabase
    .from("batches")
    .select("*")
    .eq("status", "open")
    .maybeSingle();

  const { data: orders } = await supabase.from("orders").select("status");
  const counts = STATUSES.reduce(
    (acc, s) => {
      acc[s] = orders?.filter((o) => o.status === s).length ?? 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  const { data: flaggedRows } = await supabase
    .from("messages")
    .select("order_id")
    .eq("flagged", true);
  const flaggedCount = new Set(flaggedRows?.map((r) => r.order_id)).size;

  return (
    <div className="px-4 md:px-8 py-6 md:py-7">
      <h1 className="font-display font-medium text-ink text-xl md:text-2xl">
        Overview
      </h1>

      <BatchControls initialBatch={batch} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
        {STATUSES.map((s) => (
          <div key={s} className="p-4 rounded-md border border-line">
            <div className="font-display text-2xl text-ink">{counts[s]}</div>
            <div className="font-body text-xs text-ink-soft capitalize">
              {s}
            </div>
          </div>
        ))}
        <div className="p-4 rounded-md border border-rust">
          <div className="font-display text-2xl text-rust">{flaggedCount}</div>
          <div className="font-body text-xs text-rust">Flagged</div>
        </div>
      </div>
    </div>
  );
}
