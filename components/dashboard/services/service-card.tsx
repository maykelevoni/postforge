"use client";

import { Icon } from "@/components/ui/icon";
import { Service } from "./types";

interface ServiceCardProps {
  service: Service;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "20px",
  transition: "all 0.2s ease",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "16px",
};

const titleSectionStyle: React.CSSProperties = {
  flex: 1,
};

const titleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase",
};

const activeBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  backgroundColor: "#22c55e20",
  color: "#22c55e",
};

const pausedBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  backgroundColor: "#6b728020",
  color: "#6b7280",
};

const typeBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  backgroundColor: "#6366f120",
  color: "#6366f1",
  marginLeft: "8px",
};

const bodyStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#f5f5f5",
  lineHeight: "1.5",
  marginBottom: "12px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  fontSize: "13px",
  color: "#888",
};

const infoItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "16px",
  borderTop: "1px solid #222",
};

const ticketCountStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  backgroundColor: "#222",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#f5f5f5",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
};

const iconButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  fontSize: "12px",
  fontWeight: "600",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...iconButtonStyle,
  backgroundColor: "transparent",
  border: "1px solid #222",
  color: "#888",
};

const deleteButtonStyle: React.CSSProperties = {
  ...iconButtonStyle,
  backgroundColor: "#ef444420",
  color: "#ef4444",
};

const toggleButtonStyle: React.CSSProperties = {
  ...iconButtonStyle,
  backgroundColor: "#6366f120",
  color: "#6366f1",
};

export default function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggleStatus,
}: ServiceCardProps) {
  const statusBadgeStyle = service.status === "active" ? activeBadgeStyle : pausedBadgeStyle;
  const isActive = service.status === "active";

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={titleSectionStyle}>
          <h3 style={titleStyle}>{service.name}</h3>
          <div>
            <span style={statusBadgeStyle}>{isActive ? "Active" : "Paused"}</span>
            <span style={typeBadgeStyle}>{service.type.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>

      <div style={bodyStyle}>
        <p style={descriptionStyle}>{service.description}</p>
        <div style={infoRowStyle}>
          <div style={infoItemStyle}>
            <span>${service.priceMin}</span>
            <span>–</span>
            <span>${service.priceMax}</span>
          </div>
          <div style={infoItemStyle}>
            <span>•</span>
            <span>{service.turnaroundDays} days</span>
          </div>
        </div>
      </div>

      <div style={footerStyle}>
        <div style={ticketCountStyle}>
          <Icon name="briefcase" size={14} />
          {service._count?.tickets || 0} tickets
        </div>
        <div style={buttonGroupStyle}>
          <button
            onClick={() => onEdit(service.id)}
            style={secondaryButtonStyle}
          >
            <Icon name="edit" size={14} />
            Edit
          </button>
          <button
            onClick={() => onToggleStatus(service.id)}
            style={toggleButtonStyle}
          >
            <Icon name="power" size={14} />
            {isActive ? "Pause" : "Activate"}
          </button>
          <button
            onClick={() => onDelete(service.id)}
            style={deleteButtonStyle}
          >
            <Icon name="trash2" size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
