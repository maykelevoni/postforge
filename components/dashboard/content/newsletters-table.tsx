"use client";

import { useState } from "react";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
  { id: "failed", label: "Failed" },
];

interface NewslettersTableProps {
  items: any[];
  onApprove: (id: string) => void;
  onPublish: (id: string) => void;
}

export default function NewslettersTable({ items, onApprove, onPublish }: NewslettersTableProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? items : items.filter((i) => i.status === activeTab);

  const formatDate = (item: any) => {
    const d = item.scheduledAt || item.sentAt || item.createdAt;
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const btnBase: React.CSSProperties = {
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: "600",
    borderRadius: "4px",
    cursor: "pointer",
    border: "1px solid",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: "1",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Status tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #222", overflowX: "auto", flexShrink: 0 }}>
        {STATUS_TABS.map((tab) => {
          const count = tab.id === "all" ? items.length : items.filter((i) => i.status === tab.id).length;
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
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 300px)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "42%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: "#111", position: "sticky", top: 0, zIndex: 1 }}>
              {["Subject", "Preview", "Date", "Actions"].map((label) => (
                <th
                  key={label}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #222",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>
                  No newsletters
                </td>
              </tr>
            ) : filtered.map((item) => (
              <tr
                key={item.id}
                style={{ borderBottom: "1px solid #1a1a1a" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px 12px", fontSize: "13px", fontWeight: "600", color: "#f5f5f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.subject}
                </td>

                <td style={{ padding: "10px 12px", overflow: "hidden" }}>
                  <div style={{ fontSize: "12px", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.body}
                  </div>
                </td>

                <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", whiteSpace: "nowrap" }}>
                  {formatDate(item)}
                </td>

                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {!item.approved && item.status === "draft" && (
                      <button
                        onClick={() => onApprove(item.id)}
                        style={{ ...btnBase, color: "#4ade80", backgroundColor: "#0f2a1a", borderColor: "#166534" }}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => onPublish(item.id)}
                      style={{ ...btnBase, color: "#c7d2fe", backgroundColor: "#312e81", borderColor: "#4338ca" }}
                    >
                      Send Now
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
