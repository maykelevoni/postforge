"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItemProps[] = [
  { href: "/", icon: "home", label: "Today" },
  { href: "/research", icon: "trending", label: "Research" },
  { href: "/content", icon: "fileText", label: "Content" },
  { href: "/services", icon: "briefcase", label: "Services" },
  { href: "/subscribers", icon: "users", label: "Audience" },
];

export default function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    textDecoration: "none",
    color: isActive ? "#f5f5f5" : "#888888",
    backgroundColor: isActive ? "#6366f1" : "transparent",
    borderRadius: "6px",
    transition: "all 0.2s ease",
    fontSize: "13px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  };

  return (
    <Link href={href} style={itemStyle} title={label}>
      <Icon name={icon as any} size={18} />
      <span>{label}</span>
    </Link>
  );
}

export { navItems };
