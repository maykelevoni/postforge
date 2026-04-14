"use client";

import TicketCard from "./ticket-card";

interface Ticket {
  id: string;
  clientName: string;
  niche: string;
  status: string;
  updatedAt: Date;
  service: {
    name: string;
  };
}

interface TicketPipelineProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
}

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
  minWidth: "280px",
  backgroundColor: "#111",
  borderRadius: "6px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  maxHeight: "600px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  paddingBottom: "12px",
  borderBottom: "1px solid #222",
};

const titleStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#f5f5f5",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const countBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "24px",
  height: "24px",
  padding: "0 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "700",
  backgroundColor: "#222",
  color: "#888",
};

const activeCountBadgeStyle: React.CSSProperties = {
  ...countBadgeStyle,
  backgroundColor: "#6366f120",
  color: "#6366f1",
};

const ticketsContainerStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const emptyTextStyle: React.CSSProperties = {
  padding: "40px 20px",
  textAlign: "center",
  color: "#444",
  fontSize: "13px",
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
        const hasActiveTickets = count > 0;

        return (
          <div key={column.id} style={columnStyle}>
            <div style={headerStyle}>
              <h3 style={titleStyle}>{column.label}</h3>
              <span
                style={hasActiveTickets ? activeCountBadgeStyle : countBadgeStyle}
              >
                {count}
              </span>
            </div>

            <div style={ticketsContainerStyle}>
              {columnTickets.length === 0 ? (
                <div style={emptyTextStyle}>No tickets</div>
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
