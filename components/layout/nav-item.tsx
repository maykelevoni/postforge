import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  Sparkles,
  FileText,
  Megaphone,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItemProps[] = [
  { href: "/", icon: Home, label: "Today" },
  { href: "/research", icon: TrendingUp, label: "Research" },
  { href: "/discover", icon: Sparkles, label: "Discover" },
  { href: "/content", icon: FileText, label: "Content" },
  { href: "/promote", icon: Megaphone, label: "Promote" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function NavItem({
  href,
  icon: Icon,
  label,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    textDecoration: "none",
    color: isActive ? "#f5f5f5" : "#888888",
    backgroundColor: isActive ? "#6366f1" : "transparent",
    borderRadius: "6px",
    marginBottom: "4px",
    transition: "all 0.2s ease",
    fontSize: "14px",
    fontWeight: "500",
  };

  return (
    <Link href={href} style={itemStyle}>
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export { navItems };
