"use client";

import React from "react";

export interface LeadMagnetContent {
  type: "lead_magnet";
  title: string;
  subtitle: string;
  introduction: string;
  sections: { heading: string; body: string }[];
  cta: string;
}

export interface QuoteContent {
  type: "quote";
  title: string;
  serviceDescription: string;
  scopeOfWork: string[];
  deliverables: string[];
  timeline: string;
  investment: string;
  terms: string;
}

interface DocumentPreviewProps {
  content: LeadMagnetContent | QuoteContent;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const rootStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#1a1a1a",
  padding: "40px",
  fontFamily: "sans-serif",
  minHeight: "500px",
  borderRadius: "4px",
};

const hrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #ddd",
  margin: "24px 0",
};

// ─── Lead Magnet styles ────────────────────────────────────────────────────────

const lmTitleStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "8px",
  marginTop: 0,
};

const lmSubtitleStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#555",
  marginBottom: "24px",
  marginTop: 0,
};

const lmIntroStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: 1.7,
  color: "#333",
  marginBottom: "32px",
  marginTop: 0,
};

const lmSectionHeadingStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "8px",
  marginTop: 0,
};

const lmSectionBodyStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#444",
  lineHeight: 1.7,
  marginBottom: "24px",
  marginTop: 0,
};

const lmCtaStyle: React.CSSProperties = {
  backgroundColor: "#6366f1",
  color: "#ffffff",
  padding: "24px",
  borderRadius: "6px",
  fontSize: "15px",
  fontWeight: "bold",
  textAlign: "center",
  marginTop: "32px",
};

// ─── Quote styles ──────────────────────────────────────────────────────────────

const qProposalLabelStyle: React.CSSProperties = {
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "2px",
  color: "#888",
  marginBottom: "8px",
  marginTop: 0,
};

const qTitleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "24px",
  marginTop: 0,
};

const qHrStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #ddd",
  margin: "16px 0",
};

const qServiceDescStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#444",
  lineHeight: 1.7,
  marginBottom: "24px",
  marginTop: 0,
};

const qSectionHeadingStyle: React.CSSProperties = {
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "#888",
  marginBottom: "12px",
  fontWeight: 600,
  marginTop: 0,
};

const qListItemStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#333",
  lineHeight: 1.8,
  marginBottom: 0,
};

const qTwoColRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "32px",
  marginBottom: "24px",
};

const qColLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#888",
  textTransform: "uppercase",
  marginBottom: "4px",
  marginTop: 0,
};

const qColValueStyle: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginTop: 0,
  marginBottom: 0,
};

const qTermsStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#999",
  lineHeight: 1.6,
  marginTop: "32px",
  paddingTop: "16px",
  borderTop: "1px solid #eee",
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function LeadMagnetPreview({ content }: { content: LeadMagnetContent }) {
  return (
    <>
      <h1 style={lmTitleStyle}>{content.title}</h1>
      <p style={lmSubtitleStyle}>{content.subtitle}</p>
      <hr style={hrStyle} />
      <p style={lmIntroStyle}>{content.introduction}</p>
      {content.sections.map((section, index) => (
        <div key={index}>
          <h2 style={lmSectionHeadingStyle}>{section.heading}</h2>
          <p style={lmSectionBodyStyle}>{section.body}</p>
        </div>
      ))}
      <div style={lmCtaStyle}>{content.cta}</div>
    </>
  );
}

function QuotePreview({ content }: { content: QuoteContent }) {
  return (
    <>
      <p style={qProposalLabelStyle}>PROPOSAL</p>
      <h1 style={qTitleStyle}>{content.title}</h1>
      <hr style={qHrStyle} />
      <p style={qServiceDescStyle}>{content.serviceDescription}</p>

      <h2 style={qSectionHeadingStyle}>Scope of Work</h2>
      <hr style={qHrStyle} />
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
        {content.scopeOfWork.map((item, index) => (
          <li key={index} style={qListItemStyle}>
            {"• "}
            {item}
          </li>
        ))}
      </ul>

      <h2 style={qSectionHeadingStyle}>Deliverables</h2>
      <hr style={qHrStyle} />
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
        {content.deliverables.map((item, index) => (
          <li key={index} style={qListItemStyle}>
            {"• "}
            {item}
          </li>
        ))}
      </ul>

      <div style={qTwoColRowStyle}>
        <div>
          <p style={qColLabelStyle}>Timeline</p>
          <p style={qColValueStyle}>{content.timeline}</p>
        </div>
        <div>
          <p style={qColLabelStyle}>Investment</p>
          <p style={qColValueStyle}>{content.investment}</p>
        </div>
      </div>

      <p style={qTermsStyle}>{content.terms}</p>
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function DocumentPreview({ content }: DocumentPreviewProps) {
  return (
    <div id="document-preview-root" style={rootStyle}>
      {content.type === "lead_magnet" ? (
        <LeadMagnetPreview content={content} />
      ) : (
        <QuotePreview content={content} />
      )}
    </div>
  );
}
