"use client";

import { useEffect, useState } from "react";
import ContentPieceCard from "@/components/dashboard/content/content-piece-card";
import NewsletterCard from "@/components/dashboard/content/newsletter-card";

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

const tabsStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
  borderBottom: "1px solid #222",
};

const tabStyle: React.CSSProperties = {
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#888",
  borderBottom: "2px solid transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  color: "#6366f1",
  borderBottomColor: "#6366f1",
};

const filterBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const selectStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: "13px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
  cursor: "pointer",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: "20px",
};

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<"posts" | "newsletters">("posts");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [activeTab, platform, status]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: activeTab,
        platform,
        status,
        page: "1",
      });

      const response = await fetch(`/api/content?${params}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error("Failed to load items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/content/${id}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        setItems(items.map(item =>
          item.id === id ? { ...item, approved: true, status: "scheduled" } : item
        ));
      }
    } catch (error) {
      console.error("Failed to approve item:", error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/content/${id}/publish`, {
        method: "POST",
      });

      if (response.ok) {
        setItems(items.map(item =>
          item.id === id ? { ...item, status: "published", postedAt: new Date() } : item
        ));
      }
    } catch (error) {
      console.error("Failed to publish item:", error);
    }
  };

  const handleEdit = async (id: string, content: string, subject?: string) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subject ? { subject, body: content } : { content }),
      });

      if (response.ok) {
        setItems(items.map(item =>
          item.id === id
            ? subject
              ? { ...item, subject, body: content }
              : { ...item, content }
            : item
        ));
      }
    } catch (error) {
      console.error("Failed to edit item:", error);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Content</h1>
        <p style={subtitleStyle}>Manage your social posts and newsletters</p>
      </div>

      <div style={tabsStyle}>
        <button
          onClick={() => setActiveTab("posts")}
          style={activeTab === "posts" ? activeTabStyle : tabStyle}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("newsletters")}
          style={activeTab === "newsletters" ? activeTabStyle : tabStyle}
        >
          Newsletters
        </button>
      </div>

      <div style={filterBarStyle}>
        {activeTab === "posts" && (
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Platforms</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="reddit">Reddit</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
        )}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          No items found
        </div>
      ) : (
        <div style={gridStyle}>
          {items.map((item) =>
            activeTab === "posts" ? (
              <ContentPieceCard
                key={item.id}
                {...item}
                onApprove={handleApprove}
                onPublish={handlePublish}
                onEdit={handleEdit}
              />
            ) : (
              <NewsletterCard
                key={item.id}
                {...item}
                onApprove={handleApprove}
                onPublish={handlePublish}
                onEdit={handleEdit}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
