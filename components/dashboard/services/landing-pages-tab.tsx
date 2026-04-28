"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Trash2, Globe } from "lucide-react";
import LandingPageModal from "@/components/dashboard/services/landing-page-modal";
import { LandingPageData } from "@/components/dashboard/services/types";

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
  padding: "12px 16px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "600",
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  borderBottom: "1px solid #222",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: "14px",
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
  fontSize: "14px",
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
            <thead style={theadStyle}>
              <tr>
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
                <tr key={lp.id}>
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
                    <button
                      style={deleteButtonStyle}
                      onClick={() => handleDelete(lp.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
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
