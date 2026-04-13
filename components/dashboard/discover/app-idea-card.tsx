"use client";

import { useState } from "react";
import { Lightbulb, Check, X, Eye } from "lucide-react";

interface AppIdeaCardProps {
  id: string;
  title: string;
  problem: string;
  targetAudience: string;
  coreFeatures: string;
  monetization: string;
  competition: string;
  whyNow: string;
  landingPageHtml: string;
  onApprove: (id: string) => void;
  onDismiss: (id: string) => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "24px",
  transition: "all 0.2s ease",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
  backgroundColor: "#6366f120",
  color: "#6366f1",
  marginBottom: "12px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "12px",
};

const sectionStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#888",
  marginBottom: "4px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#f5f5f5",
  lineHeight: "1.5",
};

const chipStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "4px",
  fontSize: "12px",
  backgroundColor: "#222",
  color: "#f5f5f5",
};

const italicStyle: React.CSSProperties = {
  fontStyle: "italic",
  color: "#888",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "20px",
  paddingTop: "16px",
  borderTop: "1px solid #222",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: "13px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  transition: "all 0.2s ease",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "transparent",
  border: "1px solid #222",
  color: "#888",
};

const dialogOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const dialogStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  maxWidth: "800px",
  maxHeight: "90vh",
  overflow: "auto",
  padding: "32px",
};

export default function AppIdeaCard({
  id,
  title,
  problem,
  targetAudience,
  coreFeatures,
  monetization,
  competition,
  whyNow,
  landingPageHtml,
  onApprove,
  onDismiss,
}: AppIdeaCardProps) {
  const [showFullBrief, setShowFullBrief] = useState(false);

  const coreFeaturesList = JSON.parse(coreFeatures || "[]");

  return (
    <>
      <div style={cardStyle}>
        <div style={badgeStyle}>
          <Lightbulb size={14} />
          App Idea
        </div>

        <h3 style={titleStyle}>{title}</h3>

        <div style={sectionStyle}>
          <div style={labelStyle}>Problem</div>
          <div style={valueStyle}>
            {problem.length > 120 ? problem.substring(0, 120) + "..." : problem}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Target Audience</div>
          <div style={chipStyle}>{targetAudience}</div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Why Now</div>
          <div style={{ ...valueStyle, ...italicStyle }}>{whyNow}</div>
        </div>

        <div style={buttonGroupStyle}>
          <button
            onClick={() => setShowFullBrief(true)}
            style={secondaryButtonStyle}
          >
            <Eye size={16} />
            View Full Brief
          </button>
          <button
            onClick={() => onApprove(id)}
            style={{ ...buttonStyle, backgroundColor: "#22c55e", color: "white" }}
          >
            <Check size={16} />
            Approve
          </button>
          <button
            onClick={() => onDismiss(id)}
            style={{ ...buttonStyle, backgroundColor: "#ef4444", color: "white" }}
          >
            <X size={16} />
            Dismiss
          </button>
        </div>
      </div>

      {showFullBrief && (
        <div style={dialogOverlayStyle} onClick={() => setShowFullBrief(false)}>
          <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f5f5f5" }}>{title}</h2>
              <button
                onClick={() => setShowFullBrief(false)}
                style={{ background: "none", border: "none", color: "#888", fontSize: "24px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Problem Statement</div>
              <div style={valueStyle}>{problem}</div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Target Audience</div>
              <div style={chipStyle}>{targetAudience}</div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Core Features</div>
              <ul style={{ ...valueStyle, paddingLeft: "20px" }}>
                {coreFeaturesList.map((feature: string, i: number) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Monetization Strategy</div>
              <div style={valueStyle}>{monetization}</div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Competitive Landscape</div>
              <div style={valueStyle}>{competition}</div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Why This Is The Right Time</div>
              <div style={{ ...valueStyle, ...italicStyle }}>{whyNow}</div>
            </div>

            <div>
              <div style={labelStyle}>Landing Page Preview</div>
              <div style={{ marginTop: "12px", padding: "16px", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "4px" }}>
                <iframe
                  srcDoc={landingPageHtml}
                  style={{ width: "100%", height: "400px", border: "none" }}
                  sandbox=""
                  title="Landing Page Preview"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
