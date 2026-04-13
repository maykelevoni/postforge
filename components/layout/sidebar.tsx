"use client";

import { signOut } from "next-auth/react";
import NavItem, { navItems } from "@/components/layout/nav-item";

const sidebarStyle: React.CSSProperties = {
  position: "fixed",
  left: 0,
  top: 0,
  width: "220px",
  height: "100vh",
  backgroundColor: "#111111",
  borderRight: "1px solid #222222",
  padding: "24px 16px",
  boxSizing: "border-box",
};

const logoStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#f5f5f5",
  marginBottom: "32px",
  padding: "0 16px",
};

const navStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "32px",
};

const footerStyle: React.CSSProperties = {
  marginTop: "auto",
  paddingTop: "16px",
  borderTop: "1px solid #222222",
};

const signOutButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 16px",
  color: "#888888",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  width: "100%",
  transition: "all 0.2s ease",
};

export default function Sidebar() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>PostForge</div>

      <nav style={navStyle}>
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div style={footerStyle}>
        <button
          onClick={handleSignOut}
          style={signOutButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#222222";
            e.currentTarget.style.color = "#f5f5f5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#888888";
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
