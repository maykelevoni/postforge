"use client";

import { useState } from "react";
import {
  Youtube,
  TrendingUp,
  ExternalLink,
  Check,
  X,
} from "lucide-react";

interface TopicCardProps {
  id: string;
  source: string;
  title: string;
  summary: string;
  score: number;
  url: string;
  date: Date;
  status: string;
  onStatusChange: (id: string, status: string) => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "20px",
  transition: "all 0.2s ease",
  cursor: "pointer",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
};

const sourceIconStyle: React.CSSProperties = {
  padding: "8px",
  borderRadius: "6px",
  display: "inline-flex",
};

const titleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "8px",
  lineHeight: "1.4",
};

const summaryStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
  marginBottom: "12px",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "12px",
  borderTop: "1px solid #222",
};

const linkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  color: "#6366f1",
  textDecoration: "none",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: "500",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  transition: "all 0.2s ease",
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "youtube":
      return <Youtube size={16} style={{ color: "#ef4444" }} />;
    case "reddit":
      return <TrendingUp size={16} style={{ color: "#f97316" }} />;
    case "newsapi":
      return <TrendingUp size={16} style={{ color: "#3b82f6" }} />;
    default:
      return <TrendingUp size={16} style={{ color: "#888" }} />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#eab308";
  return "#ef4444";
};

const getScoreBadge = (score: number) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
        backgroundColor: getScoreColor(score) + "20",
        color: getScoreColor(score),
      }}
    >
      {score}/10
    </div>
  );
};

export default function TopicCard({
  id,
  source,
  title,
  summary,
  score,
  url,
  date,
  status,
  onStatusChange,
}: TopicCardProps) {
  const [localStatus, setLocalStatus] = useState(status);

  const handleStatusChange = (newStatus: string) => {
    setLocalStatus(newStatus);
    onStatusChange(id, newStatus);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#1a1a1a";
        e.currentTarget.style.borderColor = "#333";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#111";
        e.currentTarget.style.borderColor = "#222";
      }}
    >
      <div style={headerStyle}>
        <div style={sourceIconStyle}>{getSourceIcon(source)}</div>
        {getScoreBadge(score)}
      </div>

      <h3 style={titleStyle}>{title}</h3>
      <p style={summaryStyle}>{summary}</p>

      <div style={footerStyle}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          <span>{formatDate(date)}</span>
          <ExternalLink size={12} />
        </a>

        {localStatus === "new" && (
          <div style={buttonGroupStyle}>
            <button
              onClick={() => handleStatusChange("used")}
              style={{
                ...buttonStyle,
                backgroundColor: "#22c55e",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#16a34a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#22c55e";
              }}
            >
              <Check size={14} />
              Used
            </button>
            <button
              onClick={() => handleStatusChange("dismissed")}
              style={{
                ...buttonStyle,
                backgroundColor: "#ef4444",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ef4444";
              }}
            >
              <X size={14} />
              Dismiss
            </button>
          </div>
        )}

        {localStatus === "used" && (
          <div
            style={{
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: "#22c55e20",
              color: "#22c55e",
            }}
          >
            ✓ Used
          </div>
        )}

        {localStatus === "dismissed" && (
          <div
            style={{
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor: "#ef444420",
              color: "#ef4444",
            }}
          >
            ✕ Dismissed
          </div>
        )}
      </div>
    </div>
  );
}
