"use client";

import { useEffect, useState } from "react";

interface Template {
  id: string;
  name: string;
  category: string;
  type: "prebuilt" | "custom";
  example?: string;
  variables: Record<string, any>;
  isFavorite: boolean;
  usageCount: number;
}

const CATEGORIES = [
  { id: "twitter",       label: "Twitter" },
  { id: "linkedin",      label: "LinkedIn" },
  { id: "reddit",        label: "Reddit" },
  { id: "youtube",       label: "YouTube" },
  { id: "email_subject", label: "Email Subject" },
  { id: "email_body",    label: "Email Body" },
  { id: "image_prompt",  label: "Image Prompts" },
  { id: "video_prompt",  label: "Video Prompts" },
];

const TYPE_TABS = [
  { id: "all",       label: "All" },
  { id: "prebuilt",  label: "Pre-built" },
  { id: "custom",    label: "Custom" },
  { id: "favorites", label: "⭐ Favorites" },
];

export default function TemplatesTab() {
  const [selectedCategory, setSelectedCategory] = useState("linkedin");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ category: selectedCategory });
        if (filterType === "favorites") params.set("favorites", "true");
        else if (filterType !== "all") params.set("type", filterType);
        if (searchQuery) params.set("search", searchQuery);

        const res = await fetch(`/api/templates?${params}`);
        const data = await res.json();
        if (res.ok) setTemplates(data.templates || []);
      } catch {}
      finally { setLoading(false); }
    };
    fetchTemplates();
  }, [selectedCategory, filterType, searchQuery]);

  const filtered = templates.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || (t.example?.toLowerCase().includes(q) ?? false);
  });

  const tabBtn = (isActive: boolean): React.CSSProperties => ({
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: isActive ? "600" : "400",
    color: isActive ? "#f5f5f5" : "#666",
    background: "none",
    border: "none",
    borderBottom: isActive ? "2px solid #6366f1" : "2px solid transparent",
    cursor: "pointer",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    marginBottom: "-1px",
  });

  const btnBase: React.CSSProperties = {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "600",
    borderRadius: "4px",
    cursor: "pointer",
    border: "1px solid",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: "1",
  };

  return (
    <div style={{ border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
      {/* Category tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #222", overflow: "hidden" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={tabBtn(selectedCategory === cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Type filter + search row */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderBottom: "1px solid #1a1a1a", flexWrap: "wrap" }}>
        {TYPE_TABS.map((tab) => {
          const isActive = filterType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: isActive ? "600" : "400",
                borderRadius: "4px",
                cursor: "pointer",
                border: "1px solid",
                borderColor: isActive ? "#6366f1" : "#333",
                backgroundColor: isActive ? "#6366f120" : "transparent",
                color: isActive ? "#6366f1" : "#666",
              }}
            >
              {tab.label}
            </button>
          );
        })}
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            marginLeft: "auto",
            padding: "4px 10px",
            fontSize: "12px",
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: "4px",
            color: "#f5f5f5",
            outline: "none",
            width: "200px",
          }}
        />
      </div>

      {/* Table */}
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 385px)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "46%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: "#111", position: "sticky", top: 0, zIndex: 1 }}>
              {["Name", "Type", "Example", "Usage", "Actions"].map((label) => (
                <th key={label} style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  borderBottom: "1px solid #222",
                  whiteSpace: "nowrap",
                }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>No templates found</td></tr>
            ) : filtered.map((t) => (
              <tr
                key={t.id}
                style={{ borderBottom: "1px solid #1a1a1a" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#f5f5f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.isFavorite ? "⭐ " : ""}{t.name}
                  </div>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    padding: "2px 7px",
                    borderRadius: "4px",
                    backgroundColor: t.type === "prebuilt" ? "#6366f120" : "#22c55e20",
                    color: t.type === "prebuilt" ? "#6366f1" : "#22c55e",
                  }}>
                    {t.type}
                  </span>
                </td>
                <td style={{ padding: "10px 12px", overflow: "hidden" }}>
                  <div style={{
                    fontSize: "12px",
                    color: "#888",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {t.example ?? "—"}
                  </div>
                </td>
                <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", textAlign: "center" }}>
                  {t.usageCount}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <button
                    style={{ ...btnBase, color: "#c7d2fe", backgroundColor: "#312e81", borderColor: "#4338ca" }}
                  >
                    Use
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
