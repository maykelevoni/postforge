"use client";

import { useState } from "react";

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "#1DA1F2",
  instagram: "#E1306C",
  tiktok: "#222",
  reddit: "#FF4500",
  linkedin: "#0077b5",
  youtube: "#FF0000",
};

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
  { id: "failed", label: "Failed" },
];

interface PostsTableProps {
  items: any[];
  onApprove: (id: string) => void;
  onPublish: (id: string) => void;
  onMarkPosted: (id: string) => void;
}

export default function PostsTable({ items, onApprove, onPublish, onMarkPosted }: PostsTableProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [copyLabels, setCopyLabels] = useState<Record<string, string>>({});

  const filtered = items
    .filter((item) => activeTab === "all" || item.status === activeTab)
    .filter((item) => platformFilter === "all" || item.platform === platformFilter);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopyLabels((prev) => ({ ...prev, [id]: "Copied ✓" }));
    setTimeout(() => setCopyLabels((prev) => ({ ...prev, [id]: "Copy" })), 2000);
  };

  const getPostLink = (item: any): { href: string; label: string } | null => {
    const enc = encodeURIComponent(item.content || "");
    const redditTitle = encodeURIComponent((item.content || "").split("\n")[0].slice(0, 300));
    switch (item.platform) {
      case "twitter":
        return { href: `https://twitter.com/intent/tweet?text=${enc}`, label: "Post on X" };
      case "threads":
        return { href: `https://www.threads.net/intent/post?text=${enc}`, label: "Post on Threads" };
      case "reddit":
        return { href: `https://www.reddit.com/submit?selftext=true&title=${redditTitle}&text=${enc}`, label: "Post on Reddit" };
      case "youtube":
        return { href: "https://studio.youtube.com", label: "Open YouTube" };
      default:
        return null;
    }
  };

  const formatDate = (item: any) => {
    const d = item.scheduledAt || item.createdAt;
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const btnBase: React.CSSProperties = {
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: "600",
    borderRadius: "4px",
    cursor: "pointer",
    border: "1px solid",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    lineHeight: "1",
    textDecoration: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Platform filter */}
      <div style={{ padding: "8px 12px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "11px", color: "#555", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Platform:</span>
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          style={{
            fontSize: "12px",
            backgroundColor: "#111",
            border: "1px solid #222",
            borderRadius: "4px",
            color: "#f5f5f5",
            padding: "3px 8px",
            cursor: "pointer",
          }}
        >
          <option value="all">All</option>
          <option value="twitter">Twitter</option>
          <option value="threads">Threads</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="reddit">Reddit</option>
          <option value="tiktok">TikTok</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #222", overflow: "hidden" }}>
        {STATUS_TABS.map((tab) => {
          const count = tab.id === "all" ? items.length : items.filter((i) => i.status === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "#f5f5f5" : "#666",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #6366f1" : "2px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
              {count > 0 && (
                <span style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  backgroundColor: isActive ? "#6366f120" : "#222",
                  color: isActive ? "#6366f1" : "#555",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 390px)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "11%" }} />
            <col style={{ width: "43%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "36%" }} />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: "#111", position: "sticky", top: 0, zIndex: 1 }}>
              {["Platform", "Content", "Date", "Actions"].map((label) => (
                <th
                  key={label}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #222",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>
                  No posts
                </td>
              </tr>
            ) : filtered.map((item) => {
              const postLink = getPostLink(item);
              return (
                <tr
                  key={item.id}
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "white",
                      backgroundColor: PLATFORM_COLORS[item.platform] || "#444",
                      textTransform: "capitalize",
                      display: "inline-block",
                    }}>
                      {item.platform}
                    </span>
                  </td>

                  <td style={{ padding: "10px 12px" }}>
                    <div style={{
                      fontSize: "13px",
                      color: "#ccc",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                      lineHeight: "1.4",
                    }}>
                      {item.content}
                    </div>
                  </td>

                  <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", whiteSpace: "nowrap" }}>
                    {formatDate(item)}
                  </td>

                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleCopy(item.id, item.content)}
                        style={{ ...btnBase, color: "#aaa", backgroundColor: "transparent", borderColor: "#333" }}
                      >
                        {copyLabels[item.id] || "Copy"}
                      </button>

                      {postLink && (
                        <a
                          href={postLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ ...btnBase, color: "#f5f5f5", backgroundColor: "#1c1c1e", borderColor: "#3a3a3a" }}
                        >
                          {postLink.label}
                        </a>
                      )}

                      {!item.approved && item.status === "draft" && (
                        <button
                          onClick={() => onApprove(item.id)}
                          style={{ ...btnBase, color: "#4ade80", backgroundColor: "#0f2a1a", borderColor: "#166534" }}
                        >
                          Approve
                        </button>
                      )}

                      <button
                        onClick={() => onPublish(item.id)}
                        style={{ ...btnBase, color: "#c7d2fe", backgroundColor: "#312e81", borderColor: "#4338ca" }}
                      >
                        Publish
                      </button>

                      <button
                        onClick={() => onMarkPosted(item.id)}
                        style={{ ...btnBase, color: "#4ade80", backgroundColor: "#0f2a1a", borderColor: "#166534" }}
                      >
                        Mark Posted
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
