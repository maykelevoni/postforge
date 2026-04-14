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
  { href: "/discover", icon: "sparkles", label: "Discover" },
  { href: "/content", icon: "fileText", label: "Content" },
  { href: "/services", icon: "briefcase", label: "Services" },
  { href: "/templates", icon: "layout", label: "Templates" },
  { href: "/documents", icon: "fileDown", label: "Documents" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export default function NavItem({
  href,
  icon,
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
      <Icon name={icon as any} size={18} />
      <span>{label}</span>
    </Link>
  );
}

export { navItems };
