"use client";
import { useBatch } from "./batchProvider";

export default function BatchBanner() {
  const batch = useBatch();

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
            ? `${batch.name} is open — ${batch.slots_remaining} of ${batch.slot_limit} packs left`
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
