"use client";

import { useEffect, useState } from "react";

export default function SetupPage() {
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [nextauthUrl, setNextauthUrl] = useState("");
  const [dbUrlError, setDbUrlError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setNextauthUrl(window.location.origin);
  }, []);

  const validate = () => {
    if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
      setDbUrlError("URL must start with postgresql:// or postgres://");
      return false;
    }
    setDbUrlError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setApiError("");
    setLoading(true);

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseUrl, nextauthUrl }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setApiError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setDone(true);
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={styles.logo}>PostForge</p>
          <p style={{ ...styles.success }}>
            Restarting in a moment… refresh in ~30 seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.logo}>PostForge</p>
        <h1 style={styles.heading}>Connect your database</h1>
        <p style={styles.sub}>Paste your Neon URL below to finish setup.</p>
        <a
          href="https://neon.tech"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.neonLink}
        >
          Don't have a database? Get a free Neon DB →
        </a>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.field}>
            <label htmlFor="db-url" style={styles.label}>Database URL</label>
            <input
              id="db-url"
              type="text"
              value={databaseUrl}
              onChange={(e) => { setDatabaseUrl(e.target.value); setDbUrlError(""); }}
              placeholder="postgresql://user:pass@host/db?sslmode=require"
              required
              disabled={loading}
              style={{
                ...styles.input,
                borderColor: dbUrlError ? "#c33" : "#222",
              }}
            />
            {dbUrlError && <p style={styles.fieldError}>{dbUrlError}</p>}
          </div>

          <div style={styles.field}>
            <label htmlFor="app-url" style={styles.label}>App URL</label>
            <input
              id="app-url"
              type="text"
              value={nextauthUrl}
              onChange={(e) => setNextauthUrl(e.target.value)}
              placeholder="https://yourdomain.com"
              disabled={loading}
              style={styles.input}
            />
          </div>

          {apiError && <p style={styles.apiError}>{apiError}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={styles.spinner} />
                Saving…
              </span>
            ) : (
              "Save & Restart"
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff",
    margin: "0 0 20px 0",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 8px 0",
  },
  sub: {
    fontSize: "14px",
    color: "#888",
    margin: "0 0 8px 0",
  },
  neonLink: {
    display: "inline-block",
    fontSize: "13px",
    color: "#888",
    textDecoration: "none",
    marginBottom: "28px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#ccc",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    background: "#111",
    color: "#fff",
    border: "1px solid #222",
    borderRadius: "6px",
    boxSizing: "border-box",
    outline: "none",
  },
  fieldError: {
    fontSize: "12px",
    color: "#c33",
    margin: "4px 0 0 0",
  },
  apiError: {
    fontSize: "13px",
    color: "#c33",
    background: "#1a0808",
    border: "1px solid #400",
    borderRadius: "6px",
    padding: "10px 12px",
    margin: "0 0 12px 0",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#000",
    background: "#fff",
    border: "none",
    borderRadius: "12px",
    marginTop: "8px",
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid #555",
    borderTopColor: "#000",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  success: {
    fontSize: "16px",
    color: "#888",
    textAlign: "center",
    paddingTop: "24px",
  },
};
