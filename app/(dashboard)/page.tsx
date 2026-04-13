"use client";

import { useEffect, useState } from "react";
import QueueCard from "@/components/dashboard/today/queue-card";
import PromotionCard from "@/components/dashboard/today/promotion-card";
import ResearchFeed from "@/components/dashboard/today/research-feed";

const pageStyle: React.CSSProperties = {
  padding: "24px",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "32px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const dateStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
};

const engineBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  marginBottom: "32px",
};

const engineStatusStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const statusDotStyle: React.CSSProperties = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#22c55e",
};

const statusTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#888",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontSize: "13px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#6366f1",
  color: "white",
  transition: "all 0.2s ease",
};

const middleRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};

const rightColumnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

interface EngineRun {
  lastRun?: Date;
  status?: string;
}

export default function TodayPage() {
  const [engineRun, setEngineRun] = useState<EngineRun>({});
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [activePromotion, setActivePromotion] = useState<any>(null);
  const [researchTopics, setResearchTopics] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Load initial data
    loadQueue();
    loadActivePromotion();
    loadResearch();

    // Setup SSE connection
    const eventSource = new EventSource("/api/sse");

    eventSource.addEventListener("engine_update", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      setEngineRun({ lastRun: new Date(), status: data.status });
      setIsRunning(data.status === "running");
    });

    eventSource.addEventListener("post_published", (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      // Update queue item status
      setQueueItems(prev => prev.map(item =>
        item.platform === data.platform ? { ...item, status: "published", postedAt: new Date() } : item
      ));
    });

    eventSource.addEventListener("discover_new", (e: MessageEvent) => {
      // Could trigger a notification or update badge
      console.log("New discover items:", e.data);
    });

    eventSource.addEventListener("error", (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const loadQueue = async () => {
    try {
      const response = await fetch("/api/content?type=posts&status=all");
      if (response.ok) {
        const data = await response.json();
        // Get today's items
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysItems = data.items.filter((item: any) =>
          new Date(item.createdAt) >= today || new Date(item.scheduledAt) >= today
        );
        setQueueItems(todaysItems.slice(0, 6));
      }
    } catch (error) {
      console.error("Failed to load queue:", error);
    }
  };

  const loadActivePromotion = async () => {
    try {
      const response = await fetch("/api/promote?status=active");
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setActivePromotion(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to load promotion:", error);
    }
  };

  const loadResearch = async () => {
    try {
      const response = await fetch("/api/research?status=new");
      if (response.ok) {
        const data = await response.json();
        setResearchTopics(data.topics.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to load research:", error);
    }
  };

  const handleRunNow = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/engine/run", {
        method: "POST",
      });

      if (response.ok) {
        setEngineRun({ lastRun: new Date(), status: "running" });
      }
    } catch (error) {
      console.error("Failed to run engine:", error);
      setIsRunning(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Today</h1>
        <p style={dateStyle}>{formatDate(new Date())}</p>
      </div>

      <div style={engineBarStyle}>
        <div style={engineStatusStyle}>
          <div
            style={{
              ...statusDotStyle,
              backgroundColor: isRunning ? "#eab308" : "#22c55e",
            }}
          />
          <span style={statusTextStyle}>
            {isRunning
              ? "Engine running..."
              : engineRun.lastRun
              ? `Last run: ${new Date(engineRun.lastRun).toLocaleTimeString()}`
              : "Engine ready"}
          </span>
        </div>
        <button
          onClick={handleRunNow}
          disabled={isRunning}
          style={{
            ...buttonStyle,
            opacity: isRunning ? 0.6 : 1,
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "Running..." : "▶ Run Now"}
        </button>
      </div>

      <div style={middleRowStyle}>
        <QueueCard items={queueItems} />
        <div style={rightColumnStyle}>
          {activePromotion && <PromotionCard {...activePromotion} />}
          <ResearchFeed topics={researchTopics} />
        </div>
      </div>
    </div>
  );
}
