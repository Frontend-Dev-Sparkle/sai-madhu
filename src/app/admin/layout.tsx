// src/app/admin/layout.tsx
import AdminNav from "@/components/admin/adminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-paper">
      <AdminNav />
      <main className="flex-1 pb-20 md:pb-0 w-full">{children}</main>
    </div>
  );
}
