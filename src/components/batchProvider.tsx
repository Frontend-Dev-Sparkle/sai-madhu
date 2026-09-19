"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/client";

export type Batch = {
  id: string;
  name: string;
  status: string;
  slot_limit: number;
  slots_remaining: number;
};

const BatchContext = createContext<Batch | null>(null);

export function useBatch() {
  return useContext(BatchContext);
}

export function BatchProvider({
  initialBatch,
  children,
}: {
  initialBatch: Batch | null;
  children: React.ReactNode;
}) {
  const [batch, setBatch] = useState<Batch | null>(initialBatch);
  const batchRef = useRef(batch);

  useEffect(() => {
    batchRef.current = batch;
  }, [batch]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("batches-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "batches" },
        (payload) => {
          if (payload.eventType === "DELETE") return;
          const isCurrentBatch = payload.new.id === batchRef.current?.id;
          const isNewlyOpenedBatch =
            !batchRef.current && payload.new.status === "open";
          if (isCurrentBatch || isNewlyOpenedBatch) {
            setBatch(payload.new as Batch);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <BatchContext.Provider value={batch}>{children}</BatchContext.Provider>
  );
}
