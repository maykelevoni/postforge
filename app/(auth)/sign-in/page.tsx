"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const hasGoogle = !!(
  process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true"
);

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError("Failed to sign in with Google");
      setLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center",
    color: "#333",
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: "16px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "white",
    backgroundColor: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.6 : 1,
    marginTop: "8px",
  };

  const googleButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#4285f4",
    marginTop: "12px",
  };

  const errorStyle: React.CSSProperties = {
    padding: "12px",
    backgroundColor: "#fee",
    color: "#c33",
    borderRadius: "4px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "center",
  };

  const linkStyle: React.CSSProperties = {
    display: "block",
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
    color: "#666",
  };

  const anchorStyle: React.CSSProperties = {
    color: "#000",
    textDecoration: "none",
    fontWeight: "600",
  };

  return (
    <div style={cardStyle}>
      <h1 style={titleStyle}>Sign In</h1>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            disabled={loading}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            disabled={loading}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {hasGoogle && (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={googleButtonStyle}
          disabled={loading}
        >
          Sign in with Google
        </button>
      )}

      <p style={linkStyle}>
        Don't have an account? <a href="/register" style={anchorStyle}>Register</a>
      </p>
    </div>
  );
}
