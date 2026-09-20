"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";
import { Search, Package, ChevronRight } from "lucide-react";

type Result = { tracking_code: string; created_at: string };

export default function FindOrderPage() {
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [status, setStatus] = useState<"idle" | "searching">("idle");

  async function handleSearch() {
    if (!phone.trim()) return;
    setStatus("searching");
    const supabase = createClient();
    const { data } = await supabase.rpc("find_orders_by_phone", {
      p_phone: phone.trim(),
    });
    setResults(data ?? []);
    setStatus("idle");
  }

  return (
    <main className="min-h-screen bg-paper px-5 py-10 md:py-16">
      <div className="max-w-[480px] mx-auto">
        <h1 className="font-display font-medium text-ink text-[22px] md:text-[26px]">
          Find your order
        </h1>
        <p className="font-body text-ink-soft text-sm mt-2">
          Lost your tracking link? Enter the phone number you used when
          ordering.
        </p>

        <div className="mt-7">
          <label
            htmlFor="find-phone"
            className="block font-body text-[13px] font-semibold text-ink mb-2"
          >
            Phone number
          </label>
          <div className="flex gap-2">
            <input
              id="find-phone"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="WhatsApp number"
              className="flex-1 border border-line rounded-md px-3.5 py-3 bg-paper text-ink font-body text-sm outline-none transition-colors focus:border-forest"
            />
            <button
              onClick={handleSearch}
              disabled={status === "searching" || !phone.trim()}
              className="px-4 rounded-md bg-forest text-paper font-body text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {results && results.length === 0 && (
          <div className="mt-6 bg-paper-alt border border-line-soft rounded-lg px-4 py-3.5 font-body text-[13px] text-ink-soft">
            No orders found for that number. Double-check it matches what you
            entered at checkout.
          </div>
        )}

        {results && results.length > 0 && (
          <div className="mt-7">
            <div className="font-body text-[13px] font-semibold text-ink mb-2">
              {results.length === 1
                ? "Order found"
                : `${results.length} orders found`}
            </div>
            <div className="space-y-2.5">
              {results.map((r) => (
                <a
                  key={r.tracking_code}
                  href={`/track/${r.tracking_code}`}
                  className="flex items-center justify-between border border-line rounded-md px-4 py-3.5 bg-paper-alt hover:border-forest transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Package size={16} className="text-forest flex-shrink-0" />
                    <div>
                      <div className="font-display text-[15px] text-forest font-medium">
                        {r.tracking_code}
                      </div>
                      <div className="font-body text-xs text-ink-soft mt-0.5">
                        Ordered {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className="font-body text-xs text-ink-soft flex items-center">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
