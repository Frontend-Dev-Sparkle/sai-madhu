// src/app/confirmation/page.tsx
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import { Check, MessageCircle } from "lucide-react";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (!code) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6 text-center">
        <p className="font-body text-ink-soft">
          No order found. If you just placed one, check your tracking link
          instead.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, batches(name)")
    .eq("tracking_code", code)
    .maybeSingle();

  if (!order) notFound();

  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/track/${order.tracking_code}`;
  const whatsappMessage = encodeURIComponent(
    `Hi Sai Madhu! I just reserved ${order.quantity} jar${order.quantity > 1 ? "s" : ""}. My tracking code is ${order.tracking_code}.`,
  );
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-paper flex flex-col items-center text-center px-6 py-14">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-forest">
        <Check className="text-paper" size={26} />
      </div>

      <h1 className="font-display font-medium text-ink text-2xl md:text-[26px] mt-5">
        You&apos;re in {order.batches?.name ?? "the batch"}
      </h1>

      <p className="font-body text-ink-soft text-sm max-w-xs mt-2">
        {order.quantity} jar{order.quantity > 1 ? "s" : ""} reserved. Save the
        link below — it&apos;s the only way to check your status or message me.
      </p>

      <div className="mt-6 px-5 py-4 rounded-sm w-full max-w-xs bg-paper-alt border border-dashed border-line">
        <div className="font-body text-xs text-ink-soft">
          Your tracking link
        </div>
        <div className="font-display text-lg text-forest font-medium mt-1 break-all">
          {trackingUrl}
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 px-6 py-3 rounded-sm flex items-center gap-2 bg-[#25D366] text-white font-body font-medium text-sm"
      >
        <MessageCircle size={17} />
        Send confirmation on WhatsApp
      </a>

      <a
        href={`/track/${order.tracking_code}`}
        className="mt-4 font-body text-sm text-forest underline"
      >
        Go to your order status
      </a>
    </main>
  );
}
