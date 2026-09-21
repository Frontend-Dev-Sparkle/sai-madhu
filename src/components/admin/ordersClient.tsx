// src/components/admin/OrdersClient.tsx
"use client";

import { useState, useMemo } from "react";
import { Search, Package, Flag, Calendar, ChevronDown } from "lucide-react";
import OrderDrawer from "./orderDrawer";

const STATUSES = ["requested", "confirmed", "processing", "dispatched"];

type Order = {
  id: string;
  tracking_code: string;
  customer_name: string;
  phone: string;
  quantity: number;
  status: string;
  created_at: string;
};

function StatusPill({ status }: { status: string }) {
  const isDispatched = status === "dispatched";
  return (
    <span
      className={`px-2.5 py-1 rounded-full font-body text-xs capitalize whitespace-nowrap ${isDispatched ? "bg-forest text-paper" : "bg-paper-alt text-ink-soft border border-line"}`}
    >
      {status}
    </span>
  );
}

export default function OrdersClient({
  initialOrders,
  flaggedIds,
}: {
  initialOrders: Order[];
  flaggedIds: string[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const flagged = new Set(flaggedIds);

  const filtered = useMemo(() => {
    let r = initialOrders.filter((o) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        o.tracking_code.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.includes(q);
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const day = o.created_at.slice(0, 10);
      const matchesFrom = !dateFrom || day >= dateFrom;
      const matchesTo = !dateTo || day <= dateTo;
      return matchesQuery && matchesStatus && matchesFrom && matchesTo;
    });
    if (sortBy === "date-desc")
      r = [...r].sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (sortBy === "date-asc")
      r = [...r].sort((a, b) => a.created_at.localeCompare(b.created_at));
    if (sortBy === "status")
      r = [...r].sort(
        (a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status),
      );
    return r;
  }, [initialOrders, query, statusFilter, sortBy, dateFrom, dateTo]);

  return (
    <div className="w-full min-w-0">
      {/* Filters */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Search */}
        <div className="relative w-full min-w-0">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, code"
            className="w-full pl-9 pr-3 py-2.5 rounded-md text-sm border border-line bg-paper-alt font-body outline-none focus:border-forest"
          />
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-3">
          {/* Status + Sort */}
          <div className="grid grid-cols-2 gap-2.5 md:flex md:items-center mb-3 md:mb-0">
            <div className="w-full">
              <label className="block mb-1 font-body text-xs text-ink-soft">
                Filter by
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full min-w-0 px-2.5 py-2 rounded-md text-xs md:text-sm border border-line bg-paper-alt font-body"
              >
                <option value="all">All statuses</option>

                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block mb-1 font-body text-xs text-ink-soft">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full min-w-0 px-2.5 py-2 rounded-md text-xs md:text-sm border border-line bg-paper-alt font-body"
              >
                <option value="date-desc">Newest</option>
                <option value="date-asc">Oldest</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2.5 md:flex md:items-center">
            {/* From */}
            <div className="min-w-0">
              <label className="block mb-1 font-body text-xs text-ink-soft">
                From
              </label>

              <div className="flex items-center gap-1.5 min-w-0">
                {/* <Calendar size={13} className="shrink-0 text-ink-soft" /> */}

                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full min-w-0 px-2 py-2 rounded-md text-xs md:text-sm border border-line bg-paper-alt font-body"
                />
              </div>
            </div>

            {/* To */}
            <div className="min-w-0">
              <label className="block mb-1 font-body text-xs text-ink-soft">
                To
              </label>

              <div className="flex items-center gap-1.5 min-w-0">
                {/* <Calendar size={13} className="shrink-0 text-ink-soft" /> */}

                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full min-w-0 px-2 py-2 rounded-md text-xs md:text-sm border border-line bg-paper-alt font-body"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden flex flex-col gap-2">
        {filtered.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelectedId(o.id)}
            className="text-left p-3.5 rounded-md border border-line bg-paper-alt"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-display text-forest font-medium min-w-0">
                <Package size={13} className="shrink-0" />

                <span className="truncate">{o.tracking_code}</span>

                {flagged.has(o.id) && (
                  <Flag size={12} className="shrink-0 text-rust" />
                )}
              </span>

              <StatusPill status={o.status} />
            </div>

            <div className="font-body text-sm text-ink mt-1.5">
              {o.customer_name} · {o.quantity} pack
              {o.quantity > 1 ? "s" : ""}
            </div>

            <div className="font-body text-xs text-ink-soft">
              {new Date(o.created_at).toLocaleDateString()}
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="font-body text-sm text-ink-soft py-8 text-center">
            No orders match these filters.
          </div>
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full font-body">
          <thead>
            <tr className="border-b border-line">
              {["Tracking code", "Customer", "Qty", "Status", "Date", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs text-ink-soft font-medium"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.id}
                onClick={() => setSelectedId(o.id)}
                className="cursor-pointer border-b border-line hover:bg-paper-alt/50"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-forest" />

                    <span className="font-display text-forest font-medium">
                      {o.tracking_code}
                    </span>

                    {flagged.has(o.id) && (
                      <Flag size={13} className="text-rust" />
                    )}
                  </div>
                </td>

                <td className="px-4 py-3.5 text-sm text-ink">
                  {o.customer_name}

                  <div className="text-xs text-ink-soft">{o.phone}</div>
                </td>

                <td className="px-4 py-3.5 text-sm text-ink">{o.quantity}</td>

                <td className="px-4 py-3.5">
                  <StatusPill status={o.status} />
                </td>

                <td className="px-4 py-3.5 text-xs text-ink-soft">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>

                <td className="px-4 py-3.5 text-right">
                  <ChevronDown
                    size={15}
                    className="text-ink-soft -rotate-90 inline"
                  />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center font-body text-sm text-ink-soft"
                >
                  No orders match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrderDrawer orderId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
