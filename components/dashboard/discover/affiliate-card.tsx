"use client";

import { useState } from "react";
import { ShoppingBag, Check, X, Eye, Copy, Check as CheckIcon } from "lucide-react";

interface AffiliateCardProps {
  id: string;
  name: string;
  vendor: string;
  affiliateLink: string;
  description: string;
  commissionRate: number;
  avgPayout: number | null;
  gravityScore: number | null;
  imageUrl: string | null;
  promoRules: string;
  contentAngles: string;
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
  backgroundColor: "#f9731620",
  color: "#f97316",
  marginBottom: "12px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "4px",
};

const vendorStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#888",
  marginBottom: "16px",
};

const metricsStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  marginBottom: "16px",
};

const metricStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  backgroundColor: "#0a0a0a",
  borderRadius: "4px",
  textAlign: "center",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#22c55e",
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#888",
  marginTop: "4px",
};

const descriptionStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#f5f5f5",
  lineHeight: "1.5",
  marginBottom: "20px",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
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
  maxWidth: "700px",
  maxHeight: "90vh",
  overflow: "auto",
  padding: "32px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#f5f5f5",
  lineHeight: "1.6",
};

export default function AffiliateCard({
  id,
  name,
  vendor,
  affiliateLink,
  description,
  commissionRate,
  avgPayout,
  gravityScore,
  imageUrl,
  promoRules,
  contentAngles,
  onApprove,
  onDismiss,
}: AffiliateCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contentAnglesList = JSON.parse(contentAngles || "[]");

  return (
    <>
      <div style={cardStyle}>
        <div style={badgeStyle}>
          <ShoppingBag size={14} />
          Affiliate
        </div>

        <h3 style={titleStyle}>{name}</h3>
        <p style={vendorStyle}>by {vendor}</p>

        <div style={metricsStyle}>
          <div style={metricStyle}>
            <div style={metricValueStyle}>{commissionRate}%</div>
            <div style={metricLabelStyle}>Commission</div>
          </div>
          {gravityScore && (
            <div style={metricStyle}>
              <div style={metricValueStyle}>{gravityScore}</div>
              <div style={metricLabelStyle}>Gravity</div>
            </div>
          )}
        </div>

        <p style={descriptionStyle}>
          {description.length > 150 ? description.substring(0, 150) + "..." : description}
        </p>

        <div style={buttonGroupStyle}>
          <button
            onClick={() => setShowDetails(true)}
            style={secondaryButtonStyle}
          >
            <Eye size={16} />
            View Details
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

      {showDetails && (
        <div style={dialogOverlayStyle} onClick={() => setShowDetails(false)}>
          <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f5f5f5" }}>{name}</h2>
              <button
                onClick={() => setShowDetails(false)}
                style={{ background: "none", border: "none", color: "#888", fontSize: "24px", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Description</div>
              <div style={valueStyle}>{description}</div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Promotional Rules</div>
              <div style={valueStyle}>{promoRules}</div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={labelStyle}>Content Angles</div>
              <ul style={{ ...valueStyle, paddingLeft: "20px" }}>
                {contentAnglesList.map((angle: string, i: number) => (
                  <li key={i}>{angle}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={labelStyle}>Affiliate Link</div>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <input
                  type="text"
                  value={affiliateLink}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    fontSize: "13px",
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #222",
                    borderRadius: "4px",
                    color: "#f5f5f5",
                  }}
                />
                <button
                  onClick={handleCopyLink}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: copied ? "#22c55e" : "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {copied ? <CheckIcon size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
