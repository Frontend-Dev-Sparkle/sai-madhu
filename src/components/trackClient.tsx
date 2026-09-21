"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/client";
import { Package, Check, Send } from "lucide-react";
import React from "react";

const STEPS = ["requested", "confirmed", "processing", "dispatched"];

type Order = {
  id: string;
  tracking_code: string;
  status: string;
  quantity: number;
  batches: { name: string } | null;
};

type Message = {
  id: string;
  order_id: string;
  sender: string;
  body: string;
  created_at: string;
};

export default function TrackClient({
  order: initialOrder,
  initialMessages,
}: {
  order: Order;
  initialMessages: Message[];
}) {
  const [order, setOrder] = useState(initialOrder);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const currentStep = STEPS.indexOf(order.status);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("order-and-message-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${initialOrder.id}`,
        },
        (payload) => {
          if (payload.new) {
            setOrder(payload.new as Order);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `order_id=eq.${initialOrder.id}`,
        },
        (payload) => {
          if (payload.new) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialOrder.id]);

  async function sendMessage() {
    if (!draft.trim()) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      order_id: order.id,
      sender: "customer",
      body: draft.trim(),
    });
    setSubmitting(false);
    if (!error) setDraft("");
  }

  return (
    <main className="h-[100dvh] flex flex-col bg-paper max-w-4xl mx-auto md:px-6 md:py-6 overflow-hidden">
      {/* Header & Progress Bar */}
      <div className="px-5 py-5 shrink-0">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-forest" />

          <span className="font-body text-sm text-ink-soft">
            {order.tracking_code} · {order.batches?.name}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mt-4">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center w-16">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-body text-xs ${
                    i <= currentStep
                      ? "bg-forest text-paper"
                      : "bg-line text-ink-soft"
                  }`}
                >
                  {i < currentStep ? <Check size={12} /> : i + 1}
                </div>

                <span
                  className={`font-body text-[11px] mt-1.5 text-center capitalize ${
                    i <= currentStep ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  {step}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px -mt-6 ${
                    i < currentStep ? "bg-forest" : "bg-line"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="mx-2 md:mx-0 border border-line rounded-lg flex-1 min-h-0 flex flex-col overflow-hidden mb-2">
        {/* Chat Header */}
        <div className="font-body text-sm font-semibold text-ink-soft shrink-0 bg-paper-alt p-3 rounded-t-lg">
          Message Sai Madhu about your order 🌿
        </div>

        {/* Chat Body */}
        <div className="px-2 md:px-5 py-4 flex-1 min-h-0 flex flex-col">
          {/* Scrollable Messages */}
          <div
            className="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto pr-0.5
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-paper-alt
        [&::-webkit-scrollbar-thumb]:bg-ink-soft
        [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`px-3 py-2 rounded-full max-w-[75%] font-body text-sm shrink-0 ${
                  m.sender === "customer"
                    ? "self-end bg-forest text-paper rounded-br-none"
                    : "self-start bg-paper-alt text-ink rounded-bl-none"
                }`}
              >
                {m.body}
              </div>
            ))}
          </div>

          {/* Fixed Bottom Input */}
          <div className="flex items-center gap-2 mt-4 shrink-0">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 min-w-0 p-2.5 rounded-full border border-line bg-paper-alt font-body text-sm outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={submitting}
              className={`text-white bg-ink-soft p-2.5 rounded-full cursor-pointer shrink-0 ${
                submitting ? "opacity-50" : ""
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
