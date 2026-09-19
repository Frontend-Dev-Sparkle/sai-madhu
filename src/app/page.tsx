import BatchBanner from "@/components/batchBanner";
import { createClient } from "@/lib/server";
import Hero from "@/components/hero";
import Story from "@/components/story";
import Ingredients from "@/components/ingredients";
import Header from "@/components/header";
import { BatchProvider } from "@/components/batchProvider";
import OrderSection from "@/components/orderSection";
import Testimonials from "@/components/testimonials";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: batch, error } = await supabase
    .from("batches")
    .select("*")
    .eq("status", "open")
    .maybeSingle();

  return (
    <BatchProvider initialBatch={batch}>
      <main className="p-0">
        <Header />
        <BatchBanner />
        <Hero />
        <Story />
        <Ingredients />
        <Testimonials />
        <OrderSection />
      </main>
    </BatchProvider>
  );
}
