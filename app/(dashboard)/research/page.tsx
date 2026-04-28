"use client";

import { useEffect, useState } from "react";
import TopicCard from "@/components/dashboard/research/topic-card";

const pageStyle: React.CSSProperties = {
  padding: "24px",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "32px",
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

const filterBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",
  alignItems: "center",
};

const filterGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
};

const searchInputStyle: React.CSSProperties = {
  padding: "8px 14px",
  fontSize: "13px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "6px",
  color: "#f5f5f5",
  outline: "none",
  width: "220px",
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: "13px",
  fontWeight: "500",
  borderRadius: "6px",
  border: "1px solid #222",
  backgroundColor: "#111",
  color: "#888",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#6366f1",
  color: "white",
  borderColor: "#6366f1",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: "20px",
};

const emptyStateStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
};

const emptyTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const emptyTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
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
}

export default function ResearchPage() {
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("new");
  const [nicheSearch, setNicheSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopics();
  }, [sourceFilter, statusFilter, nicheSearch]);

  const loadTopics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        source: sourceFilter,
        status: statusFilter,
        page: "1",
        ...(nicheSearch && { search: nicheSearch }),
      });

      const response = await fetch(`/api/research?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTopics(data.topics);
      }
    } catch (error) {
      console.error("Failed to load topics:", error);
    } finally {
      setLoading(false);
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
        // Update local state
        setTopics(topics.map(topic =>
          topic.id === id ? { ...topic, status } : topic
        ));
      }
    } catch (error) {
      console.error("Failed to update topic:", error);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Research</h1>
        <p style={subtitleStyle}>Today's trending signals</p>
      </div>

      <div style={filterBarStyle}>
        <input
          type="text"
          placeholder="Filter by niche..."
          value={nicheSearch}
          onChange={(e) => setNicheSearch(e.target.value)}
          style={searchInputStyle}
        />
        <div style={filterGroupStyle}>
          <button
            onClick={() => setSourceFilter("all")}
            style={sourceFilter === "all" ? activeButtonStyle : buttonStyle}
          >
            All
          </button>
          <button
            onClick={() => setSourceFilter("youtube")}
            style={sourceFilter === "youtube" ? activeButtonStyle : buttonStyle}
          >
            YouTube
          </button>
          <button
            onClick={() => setSourceFilter("reddit")}
            style={sourceFilter === "reddit" ? activeButtonStyle : buttonStyle}
          >
            Reddit
          </button>
          <button
            onClick={() => setSourceFilter("newsapi")}
            style={sourceFilter === "newsapi" ? activeButtonStyle : buttonStyle}
          >
            News
          </button>
        </div>

        <div style={filterGroupStyle}>
          <button
            onClick={() => setStatusFilter("new")}
            style={statusFilter === "new" ? activeButtonStyle : buttonStyle}
          >
            New
          </button>
          <button
            onClick={() => setStatusFilter("used")}
            style={statusFilter === "used" ? activeButtonStyle : buttonStyle}
          >
            Used
          </button>
          <button
            onClick={() => setStatusFilter("dismissed")}
            style={statusFilter === "dismissed" ? activeButtonStyle : buttonStyle}
          >
            Dismissed
          </button>
        </div>
      </div>

      {loading ? (
        <div style={emptyStateStyle}>
          <p style={emptyTextStyle}>Loading...</p>
        </div>
      ) : topics.length === 0 ? (
        <div style={emptyStateStyle}>
          <h3 style={emptyTitleStyle}>No topics found</h3>
          <p style={emptyTextStyle}>
            {sourceFilter === "all" && statusFilter === "new"
              ? "Check back later for new research topics"
              : "Try adjusting your filters"}
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              {...topic}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
