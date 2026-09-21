// src/components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Package, Inbox, LogOut } from "lucide-react";
import { createClient } from "@/lib/client";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-52 md:flex-shrink-0 bg-forest-deep justify-between py-5">
        <div>
          <div className="px-5 pb-6">
            <div className="font-display font-semibold text-lg text-paper">
              Sai Madhu
            </div>
            <div className="font-body text-xs text-paper/60">Admin</div>
          </div>
          <nav className="flex flex-col gap-1 px-2.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md font-body text-sm transition-colors ${
                    active
                      ? "bg-gold/20 text-gold"
                      : "text-paper hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} /> {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 mx-2.5 px-3 py-2 rounded-md font-body text-sm text-paper/70 hover:bg-white/5 transition-colors"
        >
          <LogOut size={15} /> Sign out
        </button>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 flex bg-forest-deep border-t border-line z-40">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 font-body text-[11px] ${
                active ? "text-gold" : "text-paper/75"
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
