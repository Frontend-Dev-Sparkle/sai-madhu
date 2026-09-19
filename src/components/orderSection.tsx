"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { useBatch } from "./batchProvider";

type Status = "idle" | "submitting" | "error";

export default function OrderSection() {
  const batch = useBatch();
  const isOpen = batch?.status === "open";
  const batchId = batch?.id;
  const slotsLeft = batch?.slots_remaining;

  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setStatus("error");
      setErrorMessage(`Please fill in all required fields`);
      return;
    } else {
      setStatus("submitting");
      setErrorMessage("");

      const supabase = createClient();
      const { data, error } = await supabase.rpc("create_order", {
        p_batch_id: batchId,
        p_qty: qty,
        p_customer_name: name,
        p_phone: phone,
        p_address: address,
      });
      if (error) {
        setStatus("error");
        setErrorMessage(
          "We couldn’t complete your request. Please try again later.",
        );
      } else if (data?.id) {
        router.push(`/confirmation?code=${data.tracking_code}`);
      } else {
        setStatus("error");
        setErrorMessage(
          "This batch just filled up — you've been added to the waitlist.",
        );
      }
    }
  }

  return (
    <section id="order" className="bg-paper-alt px-5 py-10 md:py-16">
      <div className="max-w-md mx-auto">
        <h2 className="font-display font-medium text-ink text-[22px] md:text-[26px]">
          Reserve your jar
        </h2>
        <p className="font-body text-ink-soft text-sm mt-2">
          {isOpen
            ? `${slotsLeft} jars left in this batch. No payment now — I'll confirm and let you know when it ships.`
            : `This batch is closed. Leave your details and I'll notify you when the next one opens.`}
        </p>

        <div className="mt-6 flex items-center justify-between p-3 rounded-sm border border-line bg-paper">
          <span className="font-body text-sm text-ink">Quantity</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="text-forest disabled:opacity-50"
              disabled={qty <= 1}
            >
              −
            </button>
            <span className="font-body font-medium w-4 text-center">{qty}</span>
            <button
              onClick={() => setQty(Math.min(2, qty + 1))}
              className="text-forest disabled:opacity-50"
              disabled={qty >= 2}
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-3 rounded-sm border border-line bg-paper font-body text-sm outline-none"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="WhatsApp number"
            className="w-full p-3 rounded-sm border border-line bg-paper font-body text-sm outline-none"
          />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Delivery address"
            className="w-full p-3 rounded-sm border border-line bg-paper font-body text-sm outline-none"
          />
        </div>

        {status === "error" && (
          <p className="mt-3 text-sm text-rust font-body">{errorMessage}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isOpen || status === "submitting"}
          className="mt-5 w-full py-3 rounded-sm font-body font-medium text-sm bg-forest text-paper disabled:opacity-50 transition-opacity"
        >
          {status === "submitting"
            ? "Reserving..."
            : isOpen
              ? "Reserve now"
              : "Notify me for next batch"}
        </button>
      </div>
    </section>
  );
}
