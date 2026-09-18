import BatchBanner, { Batch } from "@/components/batchBanner";
import { createClient } from "@/lib/server";
import Hero from "@/components/hero";
import Story from "@/components/story";
import Ingredients from "@/components/ingredients";
import Header from "@/components/header";

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
      <Header />
      <BatchBanner initialBatch={batch as Batch} />
      <Hero />
      <Story />
      <Ingredients />
    </main>
  );
}
