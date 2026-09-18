import BatchBanner, { Batch } from "@/components/batchBanner";
import { createClient } from "@/lib/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: batch, error } = await supabase
    .from("batches")
    .select("*")
    .eq("status", "open")
    .maybeSingle();

  return (
    <main className="p-0">
      <BatchBanner initialBatch={batch as Batch} />
    </main>
  );
}
