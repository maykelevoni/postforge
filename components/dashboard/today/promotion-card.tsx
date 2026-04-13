"use client";

import { ExternalLink, TrendingUp } from "lucide-react";

interface PromotionCardProps {
  id: string;
  name: string;
  type: string;
  url: string;
  funnelUrl?: string;
  priority: number;
  description?: string;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "20px"
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "600",
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "8px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#f5f5f5",
  lineHeight: "1.4",
  marginBottom: "16px",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
};

const labelSmallStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#888",
};

const valueStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#f5f5f5",
};

const linkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "13px",
  color: "#6366f1",
  textDecoration: "none",
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
  name,
  type,
  url,
  funnelUrl,
  priority,
  description,
}: PromotionCardProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        {getTypeBadge(type)}
      </div>

      <div style={labelStyle}>Promoting Today</div>
      <h3 style={titleStyle}>{name}</h3>

      {description && <p style={descriptionStyle}>{description}</p>}

      <div style={rowStyle}>
        <span style={labelSmallStyle}>Priority</span>
        <span style={valueStyle}>{priority}</span>
      </div>

      {funnelUrl ? (
        <div style={rowStyle}>
          <span style={labelSmallStyle}>Funnel</span>
          <a
            href={funnelUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <ExternalLink size={12} />
            {funnelUrl.replace(/^https?:\/\//, "").split("/")[0]}
          </a>
        </div>
      ) : (
        <div style={rowStyle}>
          <span style={labelSmallStyle}>Link</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <ExternalLink size={12} />
            {url.replace(/^https?:\/\//, "").split("/")[0]}
          </a>
        </div>
      )}
    </div>
  );
}
