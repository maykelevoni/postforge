"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import NavItem, { navItems } from "@/components/layout/nav-item";
import { Icon } from "@/components/ui/icon";

const topbarStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "56px",
  backgroundColor: "#111111",
  borderBottom: "1px solid #222222",
  display: "flex",
  alignItems: "center",
  padding: "0 24px",
  gap: "8px",
  zIndex: 100,
  boxSizing: "border-box",
};

const logoStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginRight: "16px",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const navStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  flex: 1,
  overflowX: "auto",
};

const signOutButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 14px",
  color: "#888888",
  backgroundColor: "transparent",
  border: "1px solid #222",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  whiteSpace: "nowrap",
  flexShrink: 0,
  transition: "all 0.2s ease",
};

const settingsLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  textDecoration: "none",
  color: "#888888",
  backgroundColor: "transparent",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  flexShrink: 0,
};

export default function Sidebar() {
  const pathname = usePathname();
  const settingsActive = pathname === "/settings";
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <header style={topbarStyle}>
      <div style={logoStyle}>PostForge</div>

      <nav style={navStyle}>
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <Link
        href="/settings"
        title="Settings"
        style={{
          ...settingsLinkStyle,
          color: settingsActive ? "#f5f5f5" : "#888888",
          backgroundColor: settingsActive ? "#6366f1" : "transparent",
        }}
      >
        <Icon name="settings" size={18} />
      </Link>

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
    </header>
  );
}
