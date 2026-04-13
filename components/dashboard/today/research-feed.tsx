"use client";

import Link from "next/link";
import { Youtube, TrendingUp, ExternalLink } from "lucide-react";

interface ResearchFeedProps {
  topics: Array<{
    id: string;
    source: string;
    title: string;
    score: number;
    url: string;
  }>;
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
  alignItems: "center",
  marginBottom: "16px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#f5f5f5",
};

const linkStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#6366f1",
  textDecoration: "none",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "12px 0",
  borderBottom: "1px solid #222",
};

const lastItemStyle: React.CSSProperties = {
  ...itemStyle,
  borderBottom: "none",
};

const iconStyle: React.CSSProperties = {
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0a0a0a",
  borderRadius: "6px",
  flexShrink: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const titleItemStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "4px",
  lineHeight: "1.3",
};

const metaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "11px",
  color: "#888",
};

const scoreStyle: React.CSSProperties = {
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
};

const getScoreColor = (score: number) => {
  if (score >= 7) return "#22c55e";
  if (score >= 4) return "#eab308";
  return "#ef4444";
};

const getSourceIcon = (source: string) => {
  if (source === "youtube") return <Youtube size={14} style={{ color: "#ef4444" }} />;
  return <TrendingUp size={14} style={{ color: "#888" }} />;
};

export default function ResearchFeed({ topics }: ResearchFeedProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Top Research Today</h2>
        <Link href="/research" style={linkStyle}>
          View all →
        </Link>
      </div>

      {topics.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#888", fontSize: "13px" }}>
          No research topics yet
        </div>
      ) : (
        topics.map((topic, index) => (
          <div key={topic.id} style={index === topics.length - 1 ? lastItemStyle : itemStyle}>
            <div style={iconStyle}>{getSourceIcon(topic.source)}</div>
            <div style={contentStyle}>
              <div style={titleItemStyle}>{topic.title}</div>
              <div style={metaStyle}>
                <span
                  style={{
                    ...scoreStyle,
                    backgroundColor: getScoreColor(topic.score) + "20",
                    color: getScoreColor(topic.score),
                  }}
                >
                  {topic.score}/10
                </span>
                <a
                  href={topic.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#6366f1", textDecoration: "none" }}
                >
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
