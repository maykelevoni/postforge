"use client";

import { useState } from "react";
import DocumentPreview, {
  LeadMagnetContent,
  QuoteContent,
} from "@/components/dashboard/documents/document-preview";

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "400px 1fr",
  gap: "32px",
  alignItems: "start",
};

const typeSelectorRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
};

const activeButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  backgroundColor: "#6366f1",
  color: "white",
  border: "1px solid #6366f1",
};

const inactiveButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  backgroundColor: "transparent",
  color: "#888",
  border: "1px solid #333",
};

const textareaStyle: React.CSSProperties = {
  marginTop: "24px",
  width: "100%",
  minHeight: "120px",
  padding: "12px",
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "6px",
  color: "#f5f5f5",
  fontSize: "14px",
  resize: "vertical",
  boxSizing: "border-box",
};

const generateButtonStyle: React.CSSProperties = {
  marginTop: "16px",
  width: "100%",
  padding: "12px",
  backgroundColor: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

const generateButtonDisabledStyle: React.CSSProperties = {
  ...generateButtonStyle,
  backgroundColor: "#555",
  cursor: "not-allowed",
};

const errorStyle: React.CSSProperties = {
  marginTop: "12px",
  color: "#f87171",
  fontSize: "13px",
};

const rightPanelStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "24px",
  minHeight: "500px",
};

const placeholderStyle: React.CSSProperties = {
  color: "#444",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "500px",
};

const previewHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const previewLabelStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
};

const downloadButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#6366f1",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
};

export default function DocsTab() {
  const [type, setType] = useState<"lead_magnet" | "quote">("lead_magnet");
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState<LeadMagnetContent | QuoteContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeholder =
    type === "lead_magnet"
      ? "e.g. 5 ways AI can save a small business 10 hours a week"
      : "e.g. AI chatbot for a dental clinic, $1,200, delivered in 2 weeks";

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setContent(null);
    try {
      const response = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt }),
      });

      if (!response.ok) {
        const json = await response.json();
        setError(json.error ?? "Failed to generate document");
        return;
      }

      const data = await response.json();
      setContent(data);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!content) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPage = (needed: number) => {
      if (y + needed > 270) {
        doc.addPage();
        y = 20;
      }
    };

    const writeText = (text: string, x: number, fontSize: number) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      checkPage(lines.length * (fontSize * 0.35 + 1));
      doc.text(lines, x, y);
      y += lines.length * (fontSize * 0.35 + 1) + 4;
    };

    if (content.type === "lead_magnet") {
      const c = content as LeadMagnetContent;
      doc.setFont("helvetica", "bold");
      writeText(c.title, margin, 20);
      doc.setFont("helvetica", "normal");
      writeText(c.subtitle, margin, 13);
      y += 4;
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      writeText(c.introduction, margin, 11);
      for (const s of c.sections) {
        doc.setFont("helvetica", "bold");
        writeText(s.heading, margin, 13);
        doc.setFont("helvetica", "normal");
        writeText(s.body, margin, 11);
        y += 4;
      }
      y += 4;
      doc.setFillColor(99, 102, 241);
      doc.rect(margin, y, maxWidth, 20, "F");
      doc.setTextColor(255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(c.cta, pageWidth / 2, y + 12, { align: "center" });
      doc.setTextColor(0);
    } else {
      const c = content as QuoteContent;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("PROPOSAL", margin, y);
      y += 8;
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      writeText(c.title, margin, 18);
      y += 2;
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      writeText(c.serviceDescription, margin, 11);
      doc.setFont("helvetica", "bold");
      writeText("SCOPE OF WORK", margin, 9);
      doc.setFont("helvetica", "normal");
      for (const item of c.scopeOfWork) {
        writeText(`• ${item}`, margin + 2, 11);
      }
      y += 4;
      doc.setFont("helvetica", "bold");
      writeText("DELIVERABLES", margin, 9);
      doc.setFont("helvetica", "normal");
      for (const item of c.deliverables) {
        writeText(`• ${item}`, margin + 2, 11);
      }
      y += 4;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("TIMELINE", margin, y);
      doc.text("INVESTMENT", margin + 80, y);
      y += 6;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(c.timeline, margin, y);
      doc.text(c.investment, margin + 80, y);
      y += 10;
      doc.setFont("helvetica", "normal");
      y += 4;
      doc.setDrawColor(220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
      doc.setTextColor(150);
      writeText(c.terms, margin, 9);
      doc.setTextColor(0);
    }

    const filename =
      content.type === "lead_magnet"
        ? `lead-magnet-${Date.now()}.pdf`
        : `quote-${Date.now()}.pdf`;
    doc.save(filename);
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={gridStyle}>
        <div>
          <div style={typeSelectorRowStyle}>
            <button
              style={type === "lead_magnet" ? activeButtonStyle : inactiveButtonStyle}
              onClick={() => setType("lead_magnet")}
            >
              Lead Magnet
            </button>
            <button
              style={type === "quote" ? activeButtonStyle : inactiveButtonStyle}
              onClick={() => setType("quote")}
            >
              Quote
            </button>
          </div>

          <textarea
            style={textareaStyle}
            placeholder={placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            style={loading ? generateButtonDisabledStyle : generateButtonStyle}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Document"}
          </button>

          {error && <p style={errorStyle}>{error}</p>}
        </div>

        <div style={rightPanelStyle}>
          {!content ? (
            <div style={placeholderStyle}>Your document will appear here</div>
          ) : (
            <>
              <div style={previewHeaderStyle}>
                <span style={previewLabelStyle}>Preview</span>
                <button style={downloadButtonStyle} onClick={downloadPdf}>
                  Download PDF
                </button>
              </div>
              <DocumentPreview content={content} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
