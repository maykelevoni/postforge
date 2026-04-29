"use client";

import { useState } from "react";
import {
  Youtube,
  TrendingUp,
  ExternalLink,
  Check,
  X,
  Eye,
  ThumbsUp,
  MessageCircle,
  ChevronDown,
  ChevronUp,
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
  views?: number;
  likes?: number;
  comments?: number;
  upvotes?: number;
  upvoteRatio?: number;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return String(n);
}

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

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "12px",
  borderTop: "1px solid #222",
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

const getSourceInfo = (source: string): { icon: React.ReactNode; label: string } => {
  switch (source) {
    case "youtube":
      return { icon: <Youtube size={16} style={{ color: "#ef4444" }} />, label: "YouTube" };
    case "reddit":
      return { icon: <TrendingUp size={16} style={{ color: "#f97316" }} />, label: "Reddit" };
    case "newsapi":
      return { icon: <TrendingUp size={16} style={{ color: "#3b82f6" }} />, label: "News" };
    default:
      return { icon: <TrendingUp size={16} style={{ color: "#888" }} />, label: "" };
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
  views,
  likes,
  comments,
  upvotes,
  upvoteRatio,
}: TopicCardProps) {
  const [localStatus, setLocalStatus] = useState(status);
  const [expanded, setExpanded] = useState(false);

  const handleStatusChange = (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    setLocalStatus(newStatus);
    onStatusChange(id, newStatus);
  };

  const handleCardClick = () => {
    setExpanded((prev) => !prev);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const sourceInfo = getSourceInfo(source);

  const metricsRow = () => {
    const items: React.ReactNode[] = [];

    if (source === "youtube") {
      if (views != null) {
        items.push(
          <span key="views" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <Eye size={12} />
            {formatNum(views)}
          </span>
        );
      }
      if (likes != null) {
        items.push(
          <span key="likes" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <ThumbsUp size={12} />
            {formatNum(likes)}
          </span>
        );
      }
      if (comments != null) {
        items.push(
          <span key="comments" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <MessageCircle size={12} />
            {formatNum(comments)}
          </span>
        );
      }
    } else if (source === "reddit") {
      if (upvotes != null) {
        items.push(
          <span key="upvotes" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <ThumbsUp size={12} />
            {formatNum(upvotes)}
          </span>
        );
      }
      if (comments != null) {
        items.push(
          <span key="comments" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <MessageCircle size={12} />
            {formatNum(comments)}
          </span>
        );
      }
      if (upvoteRatio != null) {
        items.push(
          <span key="upvoteRatio" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <ThumbsUp size={12} />
            {Math.round(upvoteRatio * 100)}% upvoted
          </span>
        );
      }
    }

    if (items.length === 0) return null;

    return (
      <div
        style={{
          display: "flex",
          gap: "12px",
          fontSize: "12px",
          color: "#888",
          marginBottom: "12px",
        }}
      >
        {items}
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        border: "1px solid #222",
        borderRadius: "8px",
        padding: "20px",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onClick={handleCardClick}
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
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={sourceIconStyle}>{sourceInfo.icon}</div>
          {sourceInfo.label && (
            <span style={{ fontSize: "12px", color: "#888", fontWeight: "500" }}>
              {sourceInfo.label}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {getScoreBadge(score)}
          {expanded ? <ChevronUp size={14} color="#888" /> : <ChevronDown size={14} color="#888" />}
        </div>
      </div>

      <h3 style={titleStyle}>{title}</h3>

      <p
        style={{
          fontSize: "14px",
          color: "#888",
          marginBottom: "12px",
          lineHeight: "1.6",
          ...(expanded
            ? {}
            : {
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }),
        }}
      >
        {summary}
      </p>

      {metricsRow()}

      {expanded && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            marginBottom: "12px",
            fontSize: "13px",
            fontWeight: "500",
            color: "white",
            backgroundColor: "#6366f1",
            borderRadius: "6px",
            textDecoration: "none",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#4f46e5";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#6366f1";
          }}
        >
          <ExternalLink size={14} />
          Open original
        </a>
      )}

      <div style={footerStyle}>
        <span style={{ fontSize: "12px", color: "#555" }}>{formatDate(date)}</span>

        {localStatus === "new" && (
          <div style={buttonGroupStyle}>
            <button
              onClick={(e) => handleStatusChange(e, "used")}
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
              onClick={(e) => handleStatusChange(e, "dismissed")}
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
