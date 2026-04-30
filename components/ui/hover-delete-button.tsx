"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface HoverDeleteButtonProps {
  onDelete: () => Promise<void>;
  onDeleted: () => void;
  style?: React.CSSProperties;
}

export function HoverDeleteButton({ onDelete, onDeleted, style }: HoverDeleteButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  function handleWrapperClick(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirming(true);
  }

  function handleCancel(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirming(false);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setPending(true);
    try {
      await onDelete();
      onDeleted();
    } finally {
      setPending(false);
      setConfirming(false);
    }
  }

  return (
    <>
      <span
        onClick={handleWrapperClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          cursor: "pointer",
          transition: "opacity 0.2s",
          opacity: hovered ? 0.7 : 0.3,
          ...style,
        }}
      >
        <Trash2 size={14} />
      </span>

      {confirming && (
        <div
          onClick={handleCancel}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "28px 24px",
              width: "320px",
              maxWidth: "90vw",
            }}
          >
            <p style={{ fontSize: 15, color: "#f5f5f5", margin: "0 0 6px", fontWeight: 600 }}>
              Delete this item?
            </p>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: "9px 18px",
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 6,
                  border: "1px solid #333",
                  background: "none",
                  color: "#aaa",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={pending}
                style={{
                  padding: "9px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: pending ? "#7f1d1d" : "#ef4444",
                  color: "white",
                  cursor: pending ? "default" : "pointer",
                  minWidth: 80,
                }}
              >
                {pending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
