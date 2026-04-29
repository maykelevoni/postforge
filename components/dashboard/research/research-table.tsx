"use client";

import { useState } from "react";
import { Eye, ThumbsUp, MessageCircle, ChevronUp, ChevronDown } from "lucide-react";

interface ResearchTopic {
  id: string;
  source: string;
  title: string;
  score: number;
  url: string;
  date: Date;
  status: string;
  views?: number;
  likes?: number;
  comments?: number;
  upvotes?: number;
  upvoteRatio?: number;
}

interface ResearchTableProps {
  topics: ResearchTopic[];
  onStatusChange: (id: string, status: string) => void;
  sourceFilter: string;
  setSourceFilter: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  loading: boolean;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return String(n);
}

const SOURCE_TABS = [
  { id: "all", label: "All" },
  { id: "youtube", label: "YouTube" },
  { id: "reddit", label: "Reddit" },
  { id: "newsapi", label: "News" },
];

const STATUS_TABS = [
  { id: "new", label: "New" },
  { id: "used", label: "Used" },
  { id: "dismissed", label: "Dismissed" },
  { id: "all", label: "All" },
];

const SOURCE_BADGE: Record<string, React.CSSProperties> = {
  youtube: { backgroundColor: "#ef4444", color: "white" },
  reddit: { backgroundColor: "#f97316", color: "white" },
  newsapi: { backgroundColor: "#3b82f6", color: "white" },
};

const SOURCE_LABEL: Record<string, string> = {
  youtube: "YouTube",
  reddit: "Reddit",
  newsapi: "News",
};

type SortKey = "score" | "date";
type SortDir = "asc" | "desc";

export default function ResearchTable({
  topics,
  onStatusChange,
  sourceFilter,
  setSourceFilter,
  statusFilter,
  setStatusFilter,
  loading,
}: ResearchTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const getStatus = (topic: ResearchTopic) => localStatuses[topic.id] ?? topic.status;

  const handleStatusChange = (id: string, status: string) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: status }));
    onStatusChange(id, status);
  };

  const sorted = [...topics].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "score") cmp = a.score - b.score;
    else cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span style={{ opacity: 0.2, marginLeft: 4 }}>↕</span>;
    return sortDir === "asc"
      ? <ChevronUp size={12} style={{ marginLeft: 4 }} />
      : <ChevronDown size={12} style={{ marginLeft: 4 }} />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return "#22c55e";
    if (score >= 4) return "#eab308";
    return "#ef4444";
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const renderEngagement = (topic: ResearchTopic) => {
    const items: React.ReactNode[] = [];
    if (topic.source === "youtube") {
      if (topic.views != null) items.push(<span key="v" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}><Eye size={11} />{formatNum(topic.views)}</span>);
      if (topic.likes != null) items.push(<span key="l" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}><ThumbsUp size={11} />{formatNum(topic.likes)}</span>);
      if (topic.comments != null) items.push(<span key="c" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}><MessageCircle size={11} />{formatNum(topic.comments)}</span>);
    } else if (topic.source === "reddit") {
      if (topic.upvotes != null) items.push(<span key="u" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}><ThumbsUp size={11} />{formatNum(topic.upvotes)}</span>);
      if (topic.comments != null) items.push(<span key="c" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}><MessageCircle size={11} />{formatNum(topic.comments)}</span>);
    }
    if (items.length === 0) return <span style={{ color: "#444" }}>—</span>;
    return <div style={{ display: "flex", gap: "10px", fontSize: "11px", color: "#888" }}>{items}</div>;
  };

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
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "-1px",
  });

  const countBadge = (count: number, isActive: boolean): React.CSSProperties => ({
    fontSize: "11px",
    fontWeight: "700",
    padding: "1px 6px",
    borderRadius: "10px",
    backgroundColor: isActive ? "#6366f120" : "#222",
    color: isActive ? "#6366f1" : "#555",
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Source tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #222", overflow: "hidden" }}>
        {SOURCE_TABS.map((tab) => {
          const count = tab.id === "all"
            ? topics.length
            : topics.filter((t) => t.source === tab.id).length;
          const isActive = sourceFilter === tab.id;
          return (
            <button key={tab.id} onClick={() => setSourceFilter(tab.id)} style={tabBtn(isActive)}>
              {tab.label}
              {count > 0 && <span style={countBadge(count, isActive)}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Status tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1a1a1a", overflow: "hidden" }}>
        {STATUS_TABS.map((tab) => {
          const count = tab.id === "all"
            ? topics.length
            : topics.filter((t) => t.status === tab.id).length;
          const isActive = statusFilter === tab.id;
          return (
            <button key={tab.id} onClick={() => setStatusFilter(tab.id)} style={{ ...tabBtn(isActive), fontSize: "12px", padding: "8px 12px" }}>
              {tab.label}
              {count > 0 && <span style={countBadge(count, isActive)}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 375px)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "9%" }} />
            <col style={{ width: "38%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr style={{ backgroundColor: "#111", position: "sticky", top: 0, zIndex: 1 }}>
              {(["Source", "Title", "Score", "Engagement", "Date", "Actions"] as const).map((label) => {
                const sortable = label === "Score" || label === "Date";
                const col: SortKey = label === "Score" ? "score" : "date";
                return (
                  <th
                    key={label}
                    onClick={sortable ? () => handleSort(col) : undefined}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #222",
                      cursor: sortable ? "pointer" : "default",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      {label}
                      {sortable && <SortIcon col={col} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>
                  Loading...
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>
                  No topics found
                </td>
              </tr>
            ) : sorted.map((topic) => {
              const status = getStatus(topic);
              const badgeStyle = SOURCE_BADGE[topic.source] ?? { backgroundColor: "#444", color: "white" };
              return (
                <tr
                  key={topic.id}
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#161616")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Source badge */}
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{
                      ...badgeStyle,
                      padding: "2px 7px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "700",
                      display: "inline-block",
                    }}>
                      {SOURCE_LABEL[topic.source] ?? topic.source}
                    </span>
                  </td>

                  {/* Title link */}
                  <td style={{ padding: "10px 12px", overflow: "hidden" }}>
                    <a
                      href={topic.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "13px",
                        color: "#f5f5f5",
                        textDecoration: "none",
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                    >
                      {topic.title}
                    </a>
                  </td>

                  {/* Score */}
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: getScoreColor(topic.score) }}>
                      {topic.score}/10
                    </span>
                  </td>

                  {/* Engagement */}
                  <td style={{ padding: "10px 12px" }}>
                    {renderEngagement(topic)}
                  </td>

                  {/* Date */}
                  <td style={{ padding: "10px 12px", fontSize: "12px", color: "#555", whiteSpace: "nowrap" }}>
                    {formatDate(topic.date)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "10px 12px" }}>
                    {status === "new" ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => handleStatusChange(topic.id, "used")}
                          style={{ ...btnBase, color: "white", backgroundColor: "#22c55e", borderColor: "#16a34a" }}
                        >
                          Use
                        </button>
                        <button
                          onClick={() => handleStatusChange(topic.id, "dismissed")}
                          style={{ ...btnBase, color: "white", backgroundColor: "#ef4444", borderColor: "#dc2626" }}
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <span style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: status === "used" ? "#22c55e20" : "#ef444420",
                        color: status === "used" ? "#22c55e" : "#ef4444",
                      }}>
                        {status === "used" ? "✓ Used" : "✕ Dismissed"}
                      </span>
                    )}
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
