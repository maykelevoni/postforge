"use client";

import { useEffect, useState } from "react";
import ResearchTable from "@/components/dashboard/research/research-table";

const pageStyle: React.CSSProperties = {
  padding: "24px",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

const headerTextStyle: React.CSSProperties = {
  // no additional style needed — just groups title + subtitle
};

const titleStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
};

const searchInputStyle: React.CSSProperties = {
  padding: "8px 14px",
  fontSize: "13px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "6px",
  color: "#f5f5f5",
  outline: "none",
  width: "260px",
};

const fetchButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: "500",
  borderRadius: "6px",
  border: "1px solid #6366f1",
  backgroundColor: "#6366f1",
  color: "white",
  cursor: "pointer",
  transition: "all 0.2s ease",
};


interface ResearchTopic {
  id: string;
  source: string;
  title: string;
  summary: string;
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

export default function ResearchPage() {
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("new");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    loadTopics();
  }, [sourceFilter, statusFilter]);

  const loadTopics = async () => {
    setLoading(true);
    setPage(1);
    try {
      const params = new URLSearchParams({ source: sourceFilter, page: "1" });
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/research?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to load topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const params = new URLSearchParams({ source: sourceFilter, page: String(nextPage) });
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/research?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTopics(prev => [...prev, ...data.topics]);
        setPage(nextPage);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to load more topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    setFetching(true);
    try {
      await fetch("/api/research/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: keyword.trim() || undefined }),
      });
      await loadTopics();
    } catch (error) {
      console.error("Failed to fetch research:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/research/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        if (statusFilter === "all") {
          // In "all" view: update status badge in place
          setTopics(prev =>
            prev.map(t => t.id === id ? { ...t, status } : t)
          );
        } else {
          // In filtered view: remove card immediately
          setTopics(prev => prev.filter(t => t.id !== id));
        }
      }
    } catch (error) {
      console.error("Failed to update topic:", error);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={headerTextStyle}>
          <h1 style={titleStyle}>Research</h1>
          <p style={subtitleStyle}>Today&apos;s trending signals</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search a keyword or niche..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !fetching && handleFetch()}
          style={searchInputStyle}
        />
        <button
          onClick={handleFetch}
          disabled={fetching}
          style={{
            ...fetchButtonStyle,
            opacity: fetching ? 0.6 : 1,
            cursor: fetching ? "not-allowed" : "pointer",
          }}
        >
          {fetching ? "Fetching..." : "Fetch"}
        </button>
      </div>

      <div style={{ border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
        <ResearchTable
          topics={topics}
          onStatusChange={handleStatusChange}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          loading={loading && topics.length === 0}
        />
      </div>
    </div>
  );
}
