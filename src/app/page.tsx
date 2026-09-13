import { supabase } from "@/lib/supabase";
// export const dynamic = "force-dynamic";
export default async function Home() {
  const { data, error } = await supabase.from("batches").select("*");
  const { data: updateAttempt, error: updateError } = await supabase
    .from("batches")
    .update({ slots_remaining: 999 })
    .eq("id", data?.[0]?.id)
    .select();

  console.log("Update attempt:", { updateAttempt, updateError });
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Sai Madhu</h1>
      <pre className="mt-4 text-sm">
        {error
          ? `Error: ${error.message}`
          : `Connected! Batches: ${JSON.stringify(data)}`}
      </pre>
    </main>
  );
}
