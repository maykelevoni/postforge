"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Ticket } from "./types";

interface TicketTableProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  onStatusChange: (ticketId: string, newStatus: string) => void;
}

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "quoted", label: "Quoted" },
  { id: "awaiting_payment", label: "Awaiting Payment" },
  { id: "paid", label: "Paid" },
  { id: "in_progress", label: "In Progress" },
  { id: "delivered", label: "Delivered" },
  { id: "closed", label: "Closed" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  quoted: "#f59e0b",
  awaiting_payment: "#f97316",
  paid: "#22c55e",
  in_progress: "#6366f1",
  delivered: "#22c55e",
  closed: "#6b7280",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  quoted: "Quoted",
  awaiting_payment: "Awaiting Payment",
  paid: "Paid",
  in_progress: "In Progress",
  delivered: "Delivered",
  closed: "Closed",
};

type SortKey = "clientName" | "service" | "daysOpen" | "status";
type SortDir = "asc" | "desc";

export default function TicketTable({ tickets, onTicketClick, onStatusChange }: TicketTableProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("daysOpen");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = activeTab === "all" ? tickets : tickets.filter((t) => t.status === activeTab);

  const getDaysOpen = (t: Ticket) =>
    Math.floor((Date.now() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "clientName") cmp = a.clientName.localeCompare(b.clientName);
    else if (sortKey === "service") cmp = a.service.name.localeCompare(b.service.name);
    else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
    else if (sortKey === "daysOpen") cmp = getDaysOpen(a) - getDaysOpen(b);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, ticketId: string) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    setUpdatingId(ticketId);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) onStatusChange(ticketId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span style={{ opacity: 0.2, marginLeft: 4 }}>↕</span>;
    return sortDir === "asc"
      ? <ChevronUp size={12} style={{ marginLeft: 4, flexShrink: 0 }} />
      : <ChevronDown size={12} style={{ marginLeft: 4, flexShrink: 0 }} />;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #222", overflowX: "auto", flexShrink: 0 }}>
        {STATUS_TABS.map((tab) => {
          const count = tab.id === "all" ? tickets.length : tickets.filter((t) => t.status === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "#f5f5f5" : "#666",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #6366f1" : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
              {count > 0 && (
                <span style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  backgroundColor: isActive ? "#6366f120" : "#222",
                  color: isActive ? "#6366f1" : "#555",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: "#111", position: "sticky", top: 0, zIndex: 1 }}>
              {([
                { key: "clientName", label: "Client" },
                { key: "service",    label: "Service" },
                { key: null,         label: "Niche" },
                { key: "status",     label: "Status" },
                { key: "daysOpen",   label: "Days" },
                { key: null,         label: "Source" },
              ] as { key: SortKey | null; label: string }[]).map(({ key, label }) => (
                <th
                  key={label}
                  onClick={key ? () => handleSort(key) : undefined}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #222",
                    cursor: key ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    {label}
                    {key && <SortIcon col={key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>
                  No tickets
                </td>
              </tr>
            ) : sorted.map((ticket) => {
              const days = getDaysOpen(ticket);
              const isOld = days > 7;
              const color = STATUS_COLORS[ticket.status] ?? "#888";
              return (
                <tr
                  key={ticket.id}
                  onClick={() => onTicketClick(ticket)}
                  style={{
                    borderBottom: "1px solid #1a1a1a",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Client */}
                  <td style={{ padding: "12px 12px", fontSize: "13px", fontWeight: "600", color: "#f5f5f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ticket.clientName}
                    <div style={{ fontSize: "11px", fontWeight: "400", color: "#555", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ticket.clientEmail}
                    </div>
                  </td>

                  {/* Service */}
                  <td style={{ padding: "12px 12px", fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ticket.service.name}
                  </td>

                  {/* Niche */}
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", backgroundColor: "#1a1a1a", color: "#888", whiteSpace: "nowrap" }}>
                      {ticket.niche}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "12px 12px" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        backgroundColor: color, flexShrink: 0, display: "inline-block",
                      }} />
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(e, ticket.id)}
                        disabled={updatingId === ticket.id}
                        style={{
                          fontSize: "12px",
                          backgroundColor: "transparent",
                          border: "none",
                          color: color,
                          fontWeight: "600",
                          cursor: "pointer",
                          padding: "0",
                          appearance: "none",
                          WebkitAppearance: "none",
                          outline: "none",
                          width: "100%",
                        }}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                          <option key={val} value={val} style={{ backgroundColor: "#111", color: "#f5f5f5" }}>{lbl}</option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Days */}
                  <td style={{ padding: "12px 12px", fontSize: "12px", color: isOld ? "#ef4444" : "#555", fontWeight: isOld ? "600" : "400", textAlign: "center" }}>
                    {days === 0 ? "Today" : `${days}d`}
                  </td>

                  {/* Source */}
                  <td style={{ padding: "12px 12px", fontSize: "11px", color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ticket.source ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
