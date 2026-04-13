"use client";

import {
  FileText,
  Mail,
  Youtube,
  Linkedin,
  Instagram,
  Clock,
  AlertCircle,
} from "lucide-react";

interface QueueCardProps {
  items: Array<{
    id: string;
    platform: string;
    status: string;
    scheduledAt?: Date;
    postedAt?: Date;
    error?: string;
  }>;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "20px"
};

const headerStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "16px",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 0",
  borderBottom: "1px solid #222",
};

const lastRowStyle: React.CSSProperties = {
  ...rowStyle,
  borderBottom: "none",
};

const iconStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0a0a0a",
  borderRadius: "6px",
};

const nameStyle: React.CSSProperties = {
  flex: 1,
  fontSize: "14px",
  fontWeight: "600",
  color: "#f5f5f5",
};

const timeStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#888",
};

const getStatusBadge = (status: string) => {
  const styles: Record<string, React.CSSProperties> = {
    draft: { backgroundColor: "#88820", color: "#888" },
    scheduled: { backgroundColor: "#eab30820", color: "#eab308" },
    published: { backgroundColor: "#22c55e20", color: "#22c55e" },
    failed: { backgroundColor: "#ef444420", color: "#ef4444" },
    pending: { backgroundColor: "#f9731620", color: "#f97316" },
  };

  const labels: Record<string, string> = {
    draft: "Draft",
    scheduled: "Scheduled",
    published: "Published",
    failed: "Failed",
    pending: "Pending Approval",
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "600",
        ...styles[status],
      }}
    >
      {labels[status] || status}
    </span>
  );
};

const getPlatformIcon = (platform: string) => {
  const icons: Record<string, any> = {
    twitter: <Youtube size={18} style={{ color: "#1DA1F2" }} />,
    linkedin: <Linkedin size={18} style={{ color: "#0A66C2" }} />,
    reddit: <FileText size={18} style={{ color: "#FF4500" }} />,
    instagram: <Instagram size={18} style={{ color: "#E4405F" }} />,
    tiktok: <FileText size={18} style={{ color: "#000" }} />,
    email: <Mail size={18} style={{ color: "#6366f1" }} />,
  };

  return icons[platform] || <FileText size={18} style={{ color: "#888" }} />;
};

export default function QueueCard({ items }: QueueCardProps) {
  const platforms = [
    "twitter",
    "linkedin",
    "reddit",
    "instagram",
    "tiktok",
    "email",
  ];

  return (
    <div style={cardStyle}>
      <h2 style={headerStyle}>Today's Queue</h2>

      {platforms.map((platform, index) => {
        const item = items.find((i) => i.platform === platform);

        return (
          <div key={platform} style={index === platforms.length - 1 ? lastRowStyle : rowStyle}>
            <div style={iconStyle}>{getPlatformIcon(platform)}</div>
            <span style={nameStyle}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
            {item ? (
              <>
                {item.scheduledAt && (
                  <span style={timeStyle}>
                    <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
                    {new Date(item.scheduledAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                {getStatusBadge(item.status)}
                {item.error && (
                  <span
                    style={{ color: "#ef4444", fontSize: "11px", marginLeft: "auto", cursor: "help" }}
                    title={item.error}
                  >
                    <AlertCircle size={14} />
                  </span>
                )}
              </>
            ) : (
              <span style={{ ...timeStyle, fontStyle: "italic" }}>Not scheduled</span>
            )}
          </div>
        );
      })}

      {items.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", color: "#888", fontSize: "14px" }}>
          No content scheduled for today
        </div>
      )}
    </div>
  );
}
