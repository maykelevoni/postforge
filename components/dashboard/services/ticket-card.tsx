"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Ticket } from "./types";

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  border: "1px solid #222",
  borderRadius: "6px",
  padding: "12px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  marginBottom: "8px",
};

const cardHoverStyle: React.CSSProperties = {
  ...cardStyle,
  backgroundColor: "#222",
  borderColor: "#333",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "8px",
};

const clientNameStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#f5f5f5",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
};

const nicheBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
  backgroundColor: "#6366f120",
  color: "#6366f1",
  marginBottom: "8px",
};

const serviceStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#888",
  marginBottom: "8px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  color: "#888",
};

const daysStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "11px",
  color: "#6b7280",
};

export default function TicketCard({ ticket, onClick }: TicketCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Calculate days in current stage
  const daysInStage = Math.floor(
    (Date.now() - new Date(ticket.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      style={isHovered ? cardHoverStyle : cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <div style={clientNameStyle}>{ticket.clientName}</div>
      </div>

      <div style={nicheBadgeStyle}>{ticket.niche}</div>

      <div style={serviceStyle}>{ticket.service.name}</div>

      <div style={footerStyle}>
        <div style={daysStyle}>
          <Clock size={12} />
          <span>
            {daysInStage === 0 ? "Today" : `${daysInStage} day${daysInStage !== 1 ? "s" : ""}`}
          </span>
        </div>
      </div>
    </div>
  );
}
