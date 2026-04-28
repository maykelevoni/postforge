"use client";

import { useState } from "react";
import { Mail, Clock, Check, Send, Edit2, AlertCircle } from "lucide-react";

interface NewsletterCardProps {
  id: string;
  subject: string;
  body: string;
  status: string;
  approved: boolean;
  scheduledAt?: Date;
  sentAt?: Date;
  error?: string;
  promotion?: { name: string };
  onApprove: (id: string) => void;
  onPublish: (id: string) => void;
  onEdit: (id: string, body: string, subject: string) => void;
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

const subjectStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const bodyStyle: React.CSSProperties = {
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
    sent: { backgroundColor: "#22c55e20", color: "#22c55e" },
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  fontSize: "14px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "120px",
  padding: "10px",
  fontSize: "14px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
  resize: "vertical",
  fontFamily: "inherit",
};

export default function NewsletterCard({
  id,
  subject,
  body,
  status,
  approved,
  scheduledAt,
  sentAt,
  error,
  promotion,
  onApprove,
  onPublish,
  onEdit,
}: NewsletterCardProps) {
  const [editing, setEditing] = useState(false);
  const [editSubject, setEditSubject] = useState(subject);
  const [editBody, setEditBody] = useState(body);

  const handleSave = () => {
    onEdit(id, editBody, editSubject);
    setEditing(false);
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Mail size={14} style={{ color: "#6366f1" }} />
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#f5f5f5" }}>Newsletter</span>
        </div>
        {getStatusBadge(status)}
      </div>

      {editing ? (
        <>
          <input
            type="text"
            value={editSubject}
            onChange={(e) => setEditSubject(e.target.value)}
            style={inputStyle}
            placeholder="Subject"
          />
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            style={textareaStyle}
            placeholder="Email body"
          />
        </>
      ) : (
        <>
          <h3 style={subjectStyle}>{subject}</h3>
          <p style={bodyStyle}>{body}</p>
        </>
      )}

      {error && (
        <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>
          <AlertCircle size={12} style={{ display: "inline", marginRight: "4px" }} />
          {error}
        </div>
      )}

      <div style={metaStyle}>
        {promotion && <span>Promotion: {promotion.name}</span>}
        {scheduledAt && (
          <span>
            <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
            {new Date(scheduledAt).toLocaleString()}
          </span>
        )}
        {sentAt && (
          <span>
            <Check size={12} style={{ display: "inline", marginRight: "4px" }} />
            Sent {new Date(sentAt).toLocaleString()}
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
                setEditSubject(subject);
                setEditBody(body);
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
              <Edit2 size={13} />
              Edit
            </button>
            {!approved && status === "draft" && (
              <button
                onClick={() => onApprove(id)}
                style={{ ...buttonStyle, backgroundColor: "#0f2a1a", color: "#4ade80", borderColor: "#166534" }}
              >
                <Check size={13} />
                Approve
              </button>
            )}
            <button
              onClick={() => onPublish(id)}
              style={{ ...buttonStyle, backgroundColor: "#312e81", color: "#c7d2fe", borderColor: "#4338ca" }}
            >
              <Send size={13} />
              Send Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
