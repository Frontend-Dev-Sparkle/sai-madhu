"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/client";
import { error } from "console";

export type Batch = {
  id: string;
  name: string;
  status: string;
  slot_limit: number;
  slots_remaining: number;
};

export default function BatchBanner({
  initialBatch,
}: {
  initialBatch: Batch | null;
}) {
  const [batch, setBatch] = useState<Batch | null>(initialBatch);
  const batchRef = useRef(batch);

  useEffect(() => {
    batchRef.current = batch;
  }, [batch]);

  useEffect(() => {
    const supabase = createClient();
    // WebSocket subscription
    const subscribe = supabase
      .channel("batches-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "batches" },
        (payload) => {
          console.log("Realtime event received:", payload);
          if (payload.eventType === "DELETE") return;

          if (payload.new) {
            const isCurrentBatch =
              (payload.new as Batch).id === batchRef?.current?.id;

            const isNewBatch =
              !batchRef?.current && (payload.new as Batch).status == "open";

            if (isCurrentBatch || isNewBatch) {
              setBatch(payload.new as Batch);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscribe);
    };
  }, []);

  if (!batch) {
    return (
      <div className="w-full px-5 py-3 bg-[#26362A] text-[#F3ECD9] text-sm">
        No batch is open right now — check back soon.
      </div>
    );
  }

  const pct = Math.round((batch.slots_remaining / batch.slot_limit) * 100);

  return (
    <div className="w-full px-5 py-3 flex items-center justify-between gap-4 bg-[#26362A] text-[#F3ECD9]">
      <div className="flex items-center gap-2 text-sm">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            batch.status === "open" ? "bg-[#8FBF7A]" : "bg-[#9C4A2E]"
          }`}
        />
        <span>
          {batch.status === "open"
            ? `${batch.name} is open — ${batch.slots_remaining} of ${batch.slot_limit} jars left`
            : `${batch.name} is closed — next batch opens soon`}
        </span>
      </div>
      <div className="hidden sm:block w-28 h-1.5 rounded-full overflow-hidden bg-white/15">
        <div
          className="h-full bg-[#A8791B] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
