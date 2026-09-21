// src/components/admin/OrderDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";
import { X, Send, Flag, MessageCircle } from "lucide-react";

const STATUSES = ["requested", "confirmed", "processing", "dispatched"];

type Order = {
  id: string;
  tracking_code: string;
  customer_name: string;
  phone: string;
  address: string;
  quantity: number;
  status: string;
};

type Message = {
  id: string;
  order_id: string;
  sender: string;
  body: string;
  flagged: boolean;
};

export default function OrderDrawer({
  orderId,
  onClose,
}: {
  orderId: string | null;
  onClose: () => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setMessages([]);
      return;
    }

    const supabase = createClient();
    let active = true;

    async function load() {
      const { data: o } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();
      const { data: m } = await supabase
        .from("messages")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });
      if (active) {
        setOrder(o);
        setMessages(m ?? []);
      }
    }
    load();

    const channel = supabase
      .channel(`admin-order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => setMessages((prev) => [...prev, payload.new as Message]),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  async function handleStatusChange(newStatus: string) {
    if (!order) return;
    setStatusUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);
    if (!error) setOrder({ ...order, status: newStatus });
    setStatusUpdating(false);
  }

  async function sendMessage() {
    if (!draft.trim() || !order) return;
    setSubmitting(false);
    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      order_id: order.id,
      sender: "admin",
      body: draft.trim(),
    });
    if (!error) setDraft("");
    setSubmitting(false);
  }

  if (!orderId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ink/40"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full flex flex-col bg-paper"
      >
        {!order ? (
          <div className="flex-1 flex items-center justify-center font-body text-sm text-ink-soft">
            Loading…
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div>
                <div className="font-display text-lg font-medium text-forest">
                  {order.tracking_code}
                </div>
                <div className="font-body text-sm text-ink-soft">
                  {order.customer_name} · {order.phone}
                </div>
              </div>
              <button onClick={onClose}>
                <X size={18} className="text-ink-soft" />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-line">
              <label className="block font-body text-xs text-ink-soft mb-1">
                Order status
              </label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusUpdating}
                className="w-full px-3 py-2 rounded-md text-sm border border-line bg-paper-alt font-body capitalize disabled:opacity-50"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <div className="font-body text-xs text-ink-soft mt-2">
                {order.quantity} pack{order.quantity > 1 ? "s" : ""} ·{" "}
                {order.address}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2">
              <div className="font-body text-sm text-ink-soft mb-1 flex items-center gap-1.5">
                <MessageCircle size={14} /> Conversation
              </div>
              {messages.length === 0 && (
                <div className="font-body text-sm text-ink-soft">
                  No messages yet.
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="flex flex-col"
                  style={{
                    alignItems:
                      m.sender === "admin" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    className={`px-3 py-2 max-w-[80%] rounded-full font-body text-sm ${m.sender === "admin" ? "bg-forest text-paper rounded-br-none" : "bg-paper-alt text-ink rounded-bl-none"}`}
                  >
                    {m.body}
                  </div>
                  {m.flagged && (
                    <span className="flex items-center gap-1 mt-1 font-body text-xs text-rust">
                      <Flag size={11} /> Flagged for review
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="px-3 py-4 flex items-center gap-2 border-t border-line">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Reply as Sai Madhu..."
                className="flex-1 px-3 py-2.5 rounded-full text-sm border border-line bg-paper-alt font-body outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={submitting}
                className={`text-white bg-ink-soft p-2.5 rounded-full cursor-pointer ${
                  submitting ? "opacity-50" : ""
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
