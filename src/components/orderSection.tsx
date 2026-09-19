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
    <section id="order" className="bg-paper px-5 py-10 md:py-16">
      <div className="max-w-[640px] mx-auto">
        <h2 className="font-display font-medium text-ink text-[22px] md:text-[26px]">
          Reserve your pack
        </h2>

        <p className="font-body text-ink-soft text-sm mb-8">
          {isOpen
            ? `${slotsLeft} jars left in this batch · no payment needed now`
            : `This batch is closed. Leave your details and I'll notify you when the next one opens.`}
        </p>

        {/* Quantity */}
        <div className="mb-5">
          <label className="block font-body text-[13px] font-semibold text-ink mb-2">
            How many packs?
          </label>

          <div className="flex items-center w-fit border border-line rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              className="w-11 h-11 border-0 bg-paper-alt text-ink text-lg font-body transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              −
            </button>

            <span className="w-[52px] text-center font-body font-semibold text-[15px] text-ink">
              {qty}
            </span>

            <button
              type="button"
              onClick={() => setQty(Math.min(2, qty + 1))}
              disabled={qty >= 2}
              className="w-11 h-11 border-0 bg-paper-alt text-ink text-lg font-body transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-5">
          <div>
            <label
              htmlFor="order-name"
              className="block font-body text-[13px] font-semibold text-ink mb-2"
            >
              Your name
            </label>

            <input
              id="order-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-line rounded-md px-3.5 py-3 bg-paper text-ink font-body text-sm outline-none transition-colors focus:border-forest"
            />
          </div>

          <div>
            <label
              htmlFor="order-phone"
              className="block font-body text-[13px] font-semibold text-ink mb-2"
            >
              Phone number
            </label>

            <input
              id="order-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp number"
              className="w-full border border-line rounded-md px-3.5 py-3 bg-paper text-ink font-body text-sm outline-none transition-colors focus:border-forest"
            />
          </div>

          <div>
            <label
              htmlFor="order-address"
              className="block font-body text-[13px] font-semibold text-ink mb-2"
            >
              Delivery address
            </label>

            <textarea
              id="order-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no, street, area, city, pincode"
              className="w-full min-h-[80px] resize-y border border-line rounded-md px-3.5 py-3 bg-paper text-ink font-body text-sm outline-none transition-colors focus:border-forest"
            />
          </div>
        </div>

        {/* WhatsApp / tracking note */}
        <div className="bg-paper-alt border border-line-soft rounded-lg px-4 py-3.5 mt-2 mb-7 font-body text-[13px] text-ink leading-relaxed">
          We'll send your batch updates and dispatch details to this number on
          WhatsApp. No account, no password needed — you'll get a private link
          to track everything.
        </div>

        {status === "error" && (
          <p className="mb-4 text-sm text-red-600 font-body">{errorMessage}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isOpen || status === "submitting"}
          className=" w-full
           px-6 py-3 rounded-sm bg-forest text-paper font-body font-medium text-sm active:scale-95
           disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {status === "submitting"
            ? "Reserving..."
            : isOpen
              ? "Reserve my pack"
              : "Notify me for next batch"}
        </button>
      </div>
    </section>
  );
}
