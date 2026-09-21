// src/app/admin/messages/page.tsx
import { createClient } from "@/lib/server";
import MessagesClient from "@/components/admin/messagesClient";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("messages")
    .select("*, orders(id, tracking_code, customer_name)")
    .order("created_at", { ascending: false });

  const byOrder = new Map<
    string,
    { order: any; lastMessage: any; flagged: boolean }
  >();
  for (const m of messages ?? []) {
    if (!m.orders) continue;
    const key = m.orders.id;
    if (!byOrder.has(key)) {
      byOrder.set(key, { order: m.orders, lastMessage: m, flagged: m.flagged });
    } else if (m.flagged) {
      byOrder.get(key)!.flagged = true;
    }
  }
  const conversations = Array.from(byOrder.values()).sort(
    (a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0),
  );

  return (
    <div className="px-4 md:px-8 py-6 md:py-7">
      <h1 className="font-display font-medium text-ink text-xl md:text-2xl mb-4">
        Messages
      </h1>
      <MessagesClient conversations={conversations} />
    </div>
  );
}
