"use client";

import { useEffect, useState } from "react";
import PromotionCard from "@/components/dashboard/promote/promotion-card";

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

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: "20px",
};

export default function PromotePage() {
  const [status, setStatus] = useState<"active" | "paused" | "archived">("active");
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, [status]);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/promote?status=${status}`);
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      }
    } catch (error) {
      console.error("Failed to load promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/promote/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setPromotions(promotions.map(p =>
          p.id === id ? { ...p, ...data } : p
        ));
      }
    } catch (error) {
      console.error("Failed to update promotion:", error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const response = await fetch(`/api/promote/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPromotions(promotions.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to archive promotion:", error);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Promote</h1>
        <p style={subtitleStyle}>Active promotions in rotation</p>
      </div>

      <div style={tabsStyle}>
        <button
          onClick={() => setStatus("active")}
          style={status === "active" ? activeTabStyle : tabStyle}
        >
          Active
        </button>
        <button
          onClick={() => setStatus("paused")}
          style={status === "paused" ? activeTabStyle : tabStyle}
        >
          Paused
        </button>
        <button
          onClick={() => setStatus("archived")}
          style={status === "archived" ? activeTabStyle : tabStyle}
        >
          Archived
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          Loading...
        </div>
      ) : promotions.length === 0 ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>
          No promotions found
        </div>
      ) : (
        <div style={gridStyle}>
          {promotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              {...promotion}
              onUpdate={handleUpdate}
              onArchive={handleArchive}
            />
          ))}
        </div>
      )}
    </div>
  );
}
