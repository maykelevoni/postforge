"use client";

import TicketCard from "./ticket-card";
import { Ticket } from "./types";

interface TicketPipelineProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  quoted: "#f59e0b",
  in_progress: "#6366f1",
  delivered: "#22c55e",
  closed: "#6b7280",
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  overflowX: "auto",
  paddingBottom: "16px",
  backgroundColor: "#0a0a0a",
  padding: "16px",
  borderRadius: "8px",
};

const columnStyle: React.CSSProperties = {
  flex: "1",
  minWidth: "260px",
  backgroundColor: "#111",
  borderRadius: "6px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  paddingBottom: "12px",
  borderBottom: "1px solid #222",
};

const headerLeftStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#f5f5f5",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const countBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "20px",
  height: "20px",
  padding: "0 6px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "700",
  backgroundColor: "#222",
  color: "#888",
};

const ticketsContainerStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const emptyPlaceholderStyle: React.CSSProperties = {
  padding: "32px 16px",
  textAlign: "center",
  color: "#333",
  fontSize: "12px",
  border: "1px dashed #2a2a2a",
  borderRadius: "4px",
  fontStyle: "italic",
};

const STATUS_COLUMNS = [
  { id: "new", label: "New" },
  { id: "quoted", label: "Quoted" },
  { id: "in_progress", label: "In Progress" },
  { id: "delivered", label: "Delivered" },
  { id: "closed", label: "Closed" },
];

export default function TicketPipeline({ tickets, onTicketClick }: TicketPipelineProps) {
  return (
    <div style={containerStyle}>
      {STATUS_COLUMNS.map((column) => {
        const columnTickets = tickets.filter((ticket) => ticket.status === column.id);
        const count = columnTickets.length;
        const color = STATUS_COLORS[column.id];

        return (
          <div key={column.id} style={columnStyle}>
            <div style={headerStyle}>
              <div style={headerLeftStyle}>
                {/* Colored dot */}
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                <h3 style={titleStyle}>{column.label}</h3>
              </div>
              <span
                style={{
                  ...countBadgeStyle,
                  ...(count > 0
                    ? { backgroundColor: `${color}20`, color }
                    : {}),
                }}
              >
                {count}
              </span>
            </div>

            <div style={ticketsContainerStyle}>
              {columnTickets.length === 0 ? (
                <div style={emptyPlaceholderStyle}>No tickets</div>
              ) : (
                columnTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => onTicketClick(ticket)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
