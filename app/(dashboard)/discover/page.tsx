"use client";

import { useEffect, useState } from "react";
import AppIdeaCard from "@/components/dashboard/discover/app-idea-card";

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

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "10px",
  fontSize: "11px",
  fontWeight: "600",
  backgroundColor: "#6366f1",
  color: "white",
  marginLeft: "8px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: "24px",
};

interface DiscoverItem {
  id: string;
  type: string;
  status: string;
  appIdea: any;
  affiliate: any;
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<"app_idea">("app_idea");
  const [items, setItems] = useState<DiscoverItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/discover?type=${activeTab}&status=pending`);
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
      const response = await fetch(`/api/discover/${id}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to approve item:", error);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      const response = await fetch(`/api/discover/${id}/dismiss`, {
        method: "POST",
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to dismiss item:", error);
    }
  };

  const pendingAppIdeas = items.filter(item => item.type === "app_idea").length;

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Discover</h1>
        <p style={subtitleStyle}>AI-surfaced opportunities</p>
      </div>

      <div style={tabsStyle}>
        <button
          onClick={() => setActiveTab("app_idea")}
          style={activeTabStyle}
        >
          App Ideas
          {pendingAppIdeas > 0 && <span style={badgeStyle}>{pendingAppIdeas}</span>}
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          No pending items
        </div>
      ) : (
        <div style={gridStyle}>
          {items.map((item) =>
            item.type === "app_idea" ? (
              <AppIdeaCard
                key={item.id}
                {...item.appIdea}
                id={item.id}
                onApprove={handleApprove}
                onDismiss={handleDismiss}
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
