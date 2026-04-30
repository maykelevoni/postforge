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
    if (!confirming) {
      setConfirming(true);
    }
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

  if (confirming) {
    return (
      <span
        style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ fontSize: 11, color: "#888" }}>Delete?</span>
        <button
          onClick={handleCancel}
          style={{
            fontSize: 11,
            color: "#888",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={pending}
          style={{
            fontSize: 11,
            color: "#ef4444",
            background: "none",
            border: "none",
            cursor: pending ? "default" : "pointer",
            padding: 0,
          }}
        >
          {pending ? "..." : "Delete"}
        </button>
      </span>
    );
  }

  return (
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
  );
}
