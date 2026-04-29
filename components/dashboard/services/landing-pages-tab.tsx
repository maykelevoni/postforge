"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Trash2, Globe } from "lucide-react";
import LandingPageModal from "@/components/dashboard/services/landing-page-modal";
import { LandingPageData } from "@/components/dashboard/services/types";
import { LeadMagnetContent } from "@/components/dashboard/documents/document-preview";

interface LandingPage extends LandingPageData {
  service: { id: string; name: string } | null;
  _count: { subscribers: number };
  createdAt: string;
}

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
  borderRadius: "8px",
  border: "1px solid #222",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const theadStyle: React.CSSProperties = {
  backgroundColor: "#111",
};

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: "600",
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid #222",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "13px",
  color: "#f5f5f5",
  borderBottom: "1px solid #1a1a1a",
};

const mutedTdStyle: React.CSSProperties = {
  ...tdStyle,
  color: "#888",
};

const actionsTdStyle: React.CSSProperties = {
  ...tdStyle,
  whiteSpace: "nowrap",
};

const emptyStyle: React.CSSProperties = {
  padding: "60px",
  textAlign: "center",
  color: "#888",
  fontSize: "14px",
};

const loadingStyle: React.CSSProperties = {
  padding: "60px",
  textAlign: "center",
  color: "#888",
};

const urlLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  color: "#6366f1",
  fontSize: "12px",
  textDecoration: "none",
};

const iconButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  color: "#888",
  cursor: "pointer",
  padding: "4px 6px",
  borderRadius: "4px",
};

const editButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  fontSize: "13px",
  fontWeight: "500",
  borderRadius: "4px",
  border: "1px solid #333",
  backgroundColor: "transparent",
  color: "#ccc",
  cursor: "pointer",
  marginLeft: "4px",
  marginRight: "4px",
};

const deleteButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px 8px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#ef444415",
  color: "#ef4444",
  cursor: "pointer",
};

const genPdfButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  fontSize: "12px",
  fontWeight: "500",
  borderRadius: "4px",
  border: "1px solid #6366f1",
  backgroundColor: "transparent",
  color: "#6366f1",
  cursor: "pointer",
  marginLeft: "4px",
};

const pdfPanelStyle: React.CSSProperties = {
  backgroundColor: "#0d0d1a",
  border: "1px solid #2a2a4a",
  borderRadius: "6px",
  padding: "16px",
  margin: "0 8px 8px",
};

const pdfTextareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "80px",
  padding: "10px 12px",
  backgroundColor: "#111",
  border: "1px solid #333",
  borderRadius: "6px",
  color: "#f5f5f5",
  fontSize: "13px",
  resize: "vertical",
  boxSizing: "border-box",
  marginBottom: "10px",
};

const pdfActionsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const generateBtnStyle: React.CSSProperties = {
  padding: "7px 16px",
  fontSize: "13px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#6366f1",
  color: "white",
  cursor: "pointer",
};

const generateBtnDisabledStyle: React.CSSProperties = {
  ...generateBtnStyle,
  backgroundColor: "#444",
  cursor: "not-allowed",
};

const downloadBtnStyle: React.CSSProperties = {
  padding: "7px 16px",
  fontSize: "13px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#16a34a",
  color: "white",
  cursor: "pointer",
};

const dismissLinkStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#666",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: "0",
  marginLeft: "auto",
};

function templateLabel(template: string): string {
  switch (template) {
    case "saas":
      return "SaaS";
    case "service":
      return "Service";
    case "lead_magnet":
      return "Lead Magnet";
    default:
      return template;
  }
}

export default function LandingPagesTab() {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const [activePdfRow, setActivePdfRow] = useState<string | null>(null);
  const [pdfPrompt, setPdfPrompt] = useState("");
  const [pdfContent, setPdfContent] = useState<LeadMagnetContent | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const openPdfPanel = (id: string) => {
    setActivePdfRow(id);
    setPdfPrompt("");
    setPdfContent(null);
    setPdfError(null);
  };

  const handleGeneratePdf = async () => {
    setPdfLoading(true);
    setPdfError(null);
    setPdfContent(null);
    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "lead_magnet", prompt: pdfPrompt }),
      });
      if (!res.ok) {
        const json = await res.json();
        setPdfError(json.error ?? "Failed to generate");
        return;
      }
      const data = await res.json();
      setPdfContent(data as LeadMagnetContent);
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadLeadMagnetPdf = async () => {
    if (!pdfContent) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = 210;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    const checkPage = (needed: number) => {
      if (y + needed > 270) { doc.addPage(); y = 20; }
    };
    const writeText = (text: string, x: number, fontSize: number) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      checkPage(lines.length * (fontSize * 0.35 + 1));
      doc.text(lines, x, y);
      y += lines.length * (fontSize * 0.35 + 1) + 4;
    };

    doc.setFont("helvetica", "bold");
    writeText(pdfContent.title, margin, 20);
    doc.setFont("helvetica", "normal");
    writeText(pdfContent.subtitle, margin, 13);
    y += 4;
    doc.setDrawColor(200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    writeText(pdfContent.introduction, margin, 11);
    for (const s of pdfContent.sections) {
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
    doc.text(pdfContent.cta, pageWidth / 2, y + 12, { align: "center" });
    doc.setTextColor(0);
    doc.save(`lead-magnet-${Date.now()}.pdf`);
  };

  useEffect(() => {
    loadLandingPages();
  }, []);

  const loadLandingPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/landing-pages");
      if (res.ok) {
        const data = await res.json();
        setLandingPages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load landing pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this landing page? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/landing-pages/${id}`, { method: "DELETE" });
      if (res.ok) {
        await loadLandingPages();
      }
    } catch (err) {
      console.error("Failed to delete landing page:", err);
    }
  };

  if (loading) {
    return <div style={loadingStyle}>Loading...</div>;
  }

  return (
    <div>
      {landingPages.length === 0 ? (
        <div style={emptyStyle}>
          No landing pages yet. Create one from a service card.
        </div>
      ) : (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: "#111", position: "sticky", top: 0, zIndex: 1 }}>
                <th style={thStyle}>URL</th>
                <th style={thStyle}>Template</th>
                <th style={thStyle}>Service</th>
                <th style={thStyle}>Subscribers</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {landingPages.map((lp) => (
                <>
                  <tr
                    key={lp.id}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={tdStyle}>
                      <a
                        href={`/l/${lp.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={urlLinkStyle}
                      >
                        <Globe size={13} style={{ flexShrink: 0 }} />
                        /l/{lp.slug}
                        <ExternalLink size={12} style={{ opacity: 0.6, flexShrink: 0 }} />
                      </a>
                    </td>
                    <td style={mutedTdStyle}>{templateLabel(lp.template)}</td>
                    <td style={mutedTdStyle}>{lp.service?.name ?? "—"}</td>
                    <td style={mutedTdStyle}>{lp._count?.subscribers ?? 0}</td>
                    <td style={mutedTdStyle}>
                      {new Date(lp.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td style={actionsTdStyle}>
                      <a
                        href={`/l/${lp.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...iconButtonStyle, textDecoration: "none" }}
                        title="Preview"
                      >
                        <ExternalLink size={15} />
                      </a>
                      <button
                        style={editButtonStyle}
                        onClick={() => setEditingPage(lp)}
                      >
                        Edit
                      </button>
                      {lp.template === "lead_magnet" && (
                        <button
                          style={genPdfButtonStyle}
                          onClick={() => openPdfPanel(lp.id)}
                        >
                          Generate PDF
                        </button>
                      )}
                      <button
                        style={deleteButtonStyle}
                        onClick={() => handleDelete(lp.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                  {activePdfRow === lp.id && (
                    <tr key={`${lp.id}-pdf`}>
                      <td colSpan={6} style={{ padding: "0 0 4px" }}>
                        <div style={pdfPanelStyle}>
                          <textarea
                            style={pdfTextareaStyle}
                            placeholder="e.g. 5 ways AI can save a small business 10 hours a week"
                            value={pdfPrompt}
                            onChange={(e) => setPdfPrompt(e.target.value)}
                          />
                          <div style={pdfActionsRowStyle}>
                            <button
                              style={pdfLoading ? generateBtnDisabledStyle : generateBtnStyle}
                              onClick={handleGeneratePdf}
                              disabled={pdfLoading || !pdfPrompt.trim()}
                            >
                              {pdfLoading ? "Generating..." : "Generate"}
                            </button>
                            {pdfContent && (
                              <button style={downloadBtnStyle} onClick={downloadLeadMagnetPdf}>
                                Download PDF
                              </button>
                            )}
                            {pdfError && (
                              <span style={{ fontSize: "12px", color: "#f87171" }}>{pdfError}</span>
                            )}
                            <button style={dismissLinkStyle} onClick={() => setActivePdfRow(null)}>
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingPage && (
        <LandingPageModal
          serviceId={editingPage.service?.id ?? ""}
          serviceName={editingPage.service?.name ?? ""}
          existingPage={editingPage}
          onClose={() => setEditingPage(null)}
          onCreated={async () => {
            setEditingPage(null);
            await loadLandingPages();
          }}
          onDeleted={async () => {
            setEditingPage(null);
            await loadLandingPages();
          }}
        />
      )}
    </div>
  );
}
