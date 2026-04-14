"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

interface PromotionCardProps {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  funnelUrl?: string;
  priority: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  discoverItem?: any;
  onUpdate: (id: string, data: any) => void;
  onArchive: (id: string) => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "20px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "16px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "4px",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
  lineHeight: "1.4",
  marginBottom: "16px",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "12px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#888",
  minWidth: "80px",
};

const valueStyle: React.CSSProperties = {
  flex: 1,
  fontSize: "14px",
  color: "#f5f5f5",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "16px",
  paddingTop: "16px",
  borderTop: "1px solid #222",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 14px",
  fontSize: "12px",
  fontWeight: "600",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  transition: "all 0.2s ease",
};

const iconButtonStyle: React.CSSProperties = {
  padding: "6px",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#222",
  border: "1px solid #333",
  borderRadius: "4px",
  color: "#f5f5f5",
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "6px 10px",
  fontSize: "13px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "#22c55e";
    case "paused": return "#eab308";
    case "archived": return "#888";
    default: return "#888";
  }
};

const getTypeBadge = (type: string) => {
  const styles = {
    app_idea: { backgroundColor: "#6366f120", color: "#6366f1" },
    affiliate: { backgroundColor: "#f9731620", color: "#f97316" },
  };

  return (
    <span
      style={{
        ...badgeStyle,
        ...styles[type as keyof typeof styles],
      }}
    >
      {type === "app_idea" ? "App Idea" : "Affiliate"}
    </span>
  );
};

export default function PromotionCard({
  id,
  name,
  type,
  description,
  url,
  funnelUrl,
  priority,
  status,
  createdAt,
  onUpdate,
  onArchive,
}: PromotionCardProps) {
  const [editFunnelUrl, setEditFunnelUrl] = useState(funnelUrl || "");
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const handleStatusToggle = () => {
    const newStatus = status === "active" ? "paused" : "active";
    onUpdate(id, { status: newStatus });
  };

  const handlePriorityChange = (delta: number) => {
    const newPriority = Math.max(1, Math.min(10, priority + delta));
    onUpdate(id, { priority: newPriority });
  };

  const handleFunnelUrlSave = () => {
    onUpdate(id, { funnelUrl: editFunnelUrl });
    setIsEditingUrl(false);
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <h3 style={titleStyle}>{name}</h3>
          {getTypeBadge(type)}
        </div>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: getStatusColor(status),
          }}
        />
      </div>

      <p style={descriptionStyle}>{description}</p>

      <div style={rowStyle}>
        <span style={labelStyle}>Priority</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => handlePriorityChange(-1)}
            style={iconButtonStyle}
            disabled={priority <= 1}
          >
            <Icon name="minus" size={14} />
          </button>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#f5f5f5", minWidth: "24px", textAlign: "center" }}>
            {priority}
          </span>
          <button
            onClick={() => handlePriorityChange(1)}
            style={iconButtonStyle}
            disabled={priority >= 10}
          >
            <Icon name="add" size={14} />
          </button>
        </div>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>URL</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6366f1" }}
        >
          <Icon name="external" size={12} />
          <span style={{ textDecoration: "underline" }}>Link</span>
        </a>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>Funnel</span>
        {isEditingUrl ? (
          <div style={{ display: "flex", gap: "8px", flex: 1 }}>
            <input
              type="text"
              value={editFunnelUrl}
              onChange={(e) => setEditFunnelUrl(e.target.value)}
              style={inputStyle}
              placeholder="https://..."
            />
            <button
              onClick={handleFunnelUrlSave}
              style={{ ...buttonStyle, backgroundColor: "#22c55e", color: "white" }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditFunnelUrl(funnelUrl || "");
                setIsEditingUrl(false);
              }}
              style={{ ...buttonStyle, backgroundColor: "#222", color: "#888" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <span style={{ fontSize: "13px", color: "#888" }}>
              {funnelUrl || "Not set"}
            </span>
            <button
              onClick={() => setIsEditingUrl(true)}
              style={{ ...buttonStyle, backgroundColor: "#222", color: "#888", padding: "4px 8px" }}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div style={{ ...rowStyle, marginBottom: 0 }}>
        <span style={labelStyle}>Created</span>
        <span style={{ fontSize: "12px", color: "#888" }}>
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      <div style={buttonGroupStyle}>
        <button
          onClick={handleStatusToggle}
          style={{
            ...buttonStyle,
            backgroundColor: status === "active" ? "#eab308" : "#22c55e",
            color: "white",
          }}
        >
          {status === "active" ? (
            <>
              <Icon name="pause" size={14} />
              Pause
            </>
          ) : (
            <>
              <Icon name="play" size={14} />
              Resume
            </>
          )}
        </button>
        <button
          onClick={() => onArchive(id)}
          style={{ ...buttonStyle, backgroundColor: "transparent", border: "1px solid #333", color: "#888" }}
        >
          <Icon name="archive" size={14} />
          Archive
        </button>
      </div>
    </div>
  );
}
