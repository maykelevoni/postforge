"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

interface ContentPieceCardProps {
  id: string;
  platform: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  status: string;
  approved: boolean;
  scheduledAt?: Date;
  postedAt?: Date;
  error?: string;
  promotion?: { name: string };
  onApprove: (id: string) => void;
  onPublish: (id: string) => void;
  onEdit: (id: string, content: string) => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "20px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
};

const platformStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "12px",
};

const contentStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#f5f5f5",
  lineHeight: "1.5",
  marginBottom: "12px",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const metaStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  fontSize: "12px",
  color: "#888",
  marginBottom: "12px",
};

const getStatusBadge = (status: string) => {
  const styles: Record<string, React.CSSProperties> = {
    draft: { backgroundColor: "#88820", color: "#888" },
    scheduled: { backgroundColor: "#6366f120", color: "#6366f1" },
    published: { backgroundColor: "#22c55e20", color: "#22c55e" },
    failed: { backgroundColor: "#ef444420", color: "#ef4444" },
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
      {status}
    </span>
  );
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "12px",
  paddingTop: "12px",
  borderTop: "1px solid #222",
};

const buttonStyle: React.CSSProperties = {
  padding: "7px 14px",
  fontSize: "12px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "1px solid transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  transition: "opacity 0.15s ease",
  whiteSpace: "nowrap",
};

export default function ContentPieceCard({
  id,
  platform,
  content,
  imageUrl,
  videoUrl,
  status,
  approved,
  scheduledAt,
  error,
  promotion,
  onApprove,
  onPublish,
  onEdit,
}: ContentPieceCardProps) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onEdit(id, editContent);
    setEditing(false);
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={platformStyle}>
          <Icon name="fileText" size={14} />
          {platform}
        </div>
        {getStatusBadge(status)}
      </div>

      {editing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px",
            fontSize: "14px",
            backgroundColor: "#0a0a0a",
            border: "1px solid #222",
            borderRadius: "4px",
            color: "#f5f5f5",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      ) : (
        <p style={contentStyle}>{content}</p>
      )}

      {error && (
        <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>
          <Icon name="warning" size={12} style={{ display: "inline", marginRight: "4px" }} />
          {error}
        </div>
      )}

      <div style={metaStyle}>
        {promotion && <span>Promotion: {promotion.name}</span>}
        {(imageUrl || videoUrl) && <span>{(imageUrl ? "Image" : "") + (videoUrl ? " Video" : "")}</span>}
        {scheduledAt && (
          <span>
            <Icon name="clock" size={12} style={{ display: "inline", marginRight: "4px" }} />
            {new Date(scheduledAt).toLocaleString()}
          </span>
        )}
      </div>

      <div style={buttonGroupStyle}>
        {editing ? (
          <>
            <button
              onClick={handleSave}
              style={{ ...buttonStyle, backgroundColor: "#0f2a1a", color: "#4ade80", borderColor: "#166534" }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditContent(content);
                setEditing(false);
              }}
              style={{ ...buttonStyle, backgroundColor: "transparent", color: "#666", borderColor: "#2a2a2a" }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              style={{ ...buttonStyle, backgroundColor: "transparent", color: "#888", borderColor: "#333" }}
            >
              <Icon name="edit2" size={13} />
              Edit
            </button>
            {!approved && status === "draft" && (
              <button
                onClick={() => onApprove(id)}
                style={{ ...buttonStyle, backgroundColor: "#0f2a1a", color: "#4ade80", borderColor: "#166534" }}
              >
                <Icon name="check" size={13} />
                Approve
              </button>
            )}
            <button
              onClick={() => onPublish(id)}
              style={{ ...buttonStyle, backgroundColor: "#312e81", color: "#c7d2fe", borderColor: "#4338ca" }}
            >
              <Icon name="send" size={13} />
              Publish Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
