"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface LinkedInConnectProps {
  isConnected: boolean;
  personUrn?: string;
}

const LINKEDIN_KEYS = [
  "linkedin_access_token",
  "linkedin_refresh_token",
  "linkedin_token_expires_at",
  "linkedin_person_urn",
];

const sectionStyle: React.CSSProperties = {
  marginBottom: "48px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "24px",
  color: "#f5f5f5",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "16px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "4px",
};

const badgeStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#1a4d1a",
  color: "#90ee90",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "600",
};

const connectBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "600",
  color: "white",
  backgroundColor: "#0077b5",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const disconnectBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "600",
  color: "white",
  backgroundColor: "#444",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const helperStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#888",
  marginLeft: "auto",
};

const toastStyle = (type: "success" | "error"): React.CSSProperties => ({
  padding: "12px 16px",
  borderRadius: "4px",
  marginBottom: "16px",
  fontSize: "14px",
  fontWeight: "500",
  backgroundColor: type === "success" ? "#1a4d1a" : "#4d1a1a",
  color: type === "success" ? "#90ee90" : "#ee9090",
});

export default function LinkedInConnect({
  isConnected: initialConnected,
  personUrn,
}: LinkedInConnectProps) {
  const [connected, setConnected] = useState(initialConnected);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const linkedin = searchParams.get("linkedin");
    if (linkedin === "connected") {
      setConnected(true);
      setToast({ type: "success", text: "LinkedIn connected successfully!" });
    } else if (linkedin === "error") {
      setToast({ type: "error", text: "LinkedIn connection failed. Please try again." });
    }
  }, [searchParams]);

  const handleDisconnect = async () => {
    const res = await fetch("/api/settings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: LINKEDIN_KEYS }),
    });

    if (res.ok) {
      setConnected(false);
      setToast({ type: "success", text: "LinkedIn disconnected." });
    } else {
      setToast({ type: "error", text: "Failed to disconnect LinkedIn." });
    }
  };

  return (
    <div style={sectionStyle}>
      <h2 style={headingStyle}>LinkedIn</h2>

      {toast && (
        <div style={toastStyle(toast.type)}>{toast.text}</div>
      )}

      <div style={rowStyle}>
        {connected ? (
          <>
            <span style={badgeStyle}>LinkedIn Connected ✓</span>
            {personUrn && (
              <span style={{ ...helperStyle, marginLeft: 0 }}>ID: {personUrn}</span>
            )}
            <button onClick={handleDisconnect} style={{ ...disconnectBtnStyle, marginLeft: "auto" }}>
              Disconnect
            </button>
          </>
        ) : (
          <>
            <a href="/api/auth/linkedin" style={{ textDecoration: "none" }}>
              <button style={connectBtnStyle}>Connect LinkedIn</button>
            </a>
            <span style={helperStyle}>
              Connect your LinkedIn account to enable automatic posting
            </span>
          </>
        )}
      </div>
    </div>
  );
}
