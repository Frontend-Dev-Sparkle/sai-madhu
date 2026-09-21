// src/components/admin/BatchControls.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { Plus } from "lucide-react";

type Batch = {
  id: string;
  name: string;
  status: string;
  slot_limit: number;
  slots_remaining: number;
};

export default function BatchControls({
  initialBatch,
}: {
  initialBatch: Batch | null;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slotLimit, setSlotLimit] = useState(20);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");

  async function handleOpenBatch() {
    if (!name.trim()) {
      setError("Give this batch a name.");
      return;
    }
    setStatus("submitting");
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase.from("batches").insert({
      name: name.trim(),
      status: "open",
      slot_limit: slotLimit,
      slots_remaining: slotLimit,
    });

    if (insertError) {
      // 23505 = unique constraint violation — the single-open-batch guard from earlier
      setError(
        insertError.code === "23505"
          ? "A batch is already open — close it first."
          : "Could not open batch. Please try again.",
      );
      setStatus("idle");
      return;
    }

    setShowForm(false);
    setName("");
    setStatus("idle");
    router.refresh();
  }

  async function handleCloseBatch() {
    if (!initialBatch) return;
    setStatus("submitting");
    const supabase = createClient();
    await supabase
      .from("batches")
      .update({ status: "closed" })
      .eq("id", initialBatch.id);
    setStatus("idle");
    router.refresh();
  }

  const pct = initialBatch
    ? Math.round((initialBatch.slots_remaining / initialBatch.slot_limit) * 100)
    : 0;

  return (
    <div className="mt-5 p-5 rounded-md border border-line bg-paper-alt">
      {initialBatch ? (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-body text-xs text-ink-soft">
                Current batch
              </div>
              <div className="font-display text-lg font-medium text-ink mt-0.5">
                {initialBatch.name}
              </div>
            </div>
            <button
              onClick={handleCloseBatch}
              disabled={status === "submitting"}
              className="px-3.5 py-2 rounded-md font-body text-sm border border-rust text-rust disabled:opacity-50"
            >
              {status === "submitting" ? "Closing…" : "Close batch"}
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <span className="font-body text-sm text-ink-soft">
              {initialBatch.slots_remaining} of {initialBatch.slot_limit} left
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-line">
              <div
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="font-display text-lg text-ink-soft">
            No batch is open right now
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3.5 py-2 rounded-md font-body text-sm bg-forest text-paper flex items-center gap-1.5"
          >
            <Plus size={15} /> Open new batch
          </button>
        </div>
      )}

      {showForm && !initialBatch && (
        <div className="mt-4 flex items-end gap-3 flex-wrap p-3 rounded-md border border-line bg-paper">
          <div>
            <label className="block font-body text-xs text-ink-soft mb-1">
              Batch name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Batch #2"
              className="px-3 py-2 rounded-md text-sm border border-line font-body outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="block font-body text-xs text-ink-soft mb-1">
              Slot limit
            </label>
            <input
              type="number"
              value={slotLimit}
              onChange={(e) => setSlotLimit(Number(e.target.value))}
              className="px-3 py-2 rounded-md text-sm border border-line font-body outline-none focus:border-forest w-24"
            />
          </div>
          <button
            onClick={handleOpenBatch}
            disabled={status === "submitting"}
            className="px-3.5 py-2 rounded-md font-body text-sm bg-forest text-paper disabled:opacity-50"
          >
            {status === "submitting" ? "Opening…" : "Open batch"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 font-body text-sm text-rust">{error}</p>}
    </div>
  );
}
