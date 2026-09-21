// src/components/admin/MessagesClient.tsx
"use client";

import { useState } from "react";
import { MessageCircle, Flag, Mail } from "lucide-react";
import OrderDrawer from "./orderDrawer";

export default function MessagesClient({
  conversations,
}: {
  conversations: any[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex flex-col gap-2">
        {conversations.map(({ order, lastMessage, flagged }) => (
          <button
            key={order.id}
            onClick={() => setSelectedId(order.id)}
            className={`text-left p-4 rounded-md flex items-start gap-3 border ${flagged ? "border-rust bg-rust/5" : "border-line bg-paper-alt"}`}
          >
            <Mail
              size={16}
              className={flagged ? "text-rust mt-1" : "text-forest mt-1"}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-display font-medium text-ink">
                  {order.customer_name}
                </span>
                {flagged && (
                  <span className="flex items-center gap-1 font-body text-xs text-rust">
                    <Flag size={11} /> Flagged
                  </span>
                )}
              </div>
              <div className="font-body text-sm text-ink-soft truncate mt-0.5">
                {lastMessage.sender === "admin" ? "You: " : ""}
                {lastMessage.body}
              </div>
              <div className="font-body text-xs text-ink-soft mt-0.5">
                {order.tracking_code}
              </div>
            </div>
          </button>
        ))}
        {conversations.length === 0 && (
          <div className="font-body text-sm text-ink-soft">
            No conversations yet.
          </div>
        )}
      </div>

      <OrderDrawer orderId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
