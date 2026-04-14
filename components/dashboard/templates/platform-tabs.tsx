import { Icon } from "@/components/ui/icon";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface PlatformTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  variant?: "sidebar" | "topbar";
}

// --- Sidebar styles ---
const sidebarTabStyle: React.CSSProperties = {
  padding: "12px 16px",
  marginBottom: "4px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease",
  border: "none",
  backgroundColor: "transparent",
  color: "#888",
  width: "100%",
  textAlign: "left",
};

const sidebarActiveTabStyle: React.CSSProperties = {
  ...sidebarTabStyle,
  backgroundColor: "#6366f1",
  color: "#f5f5f5",
};

// --- Topbar styles ---
const topbarTabStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "transparent",
  color: "#888",
  cursor: "pointer",
  transition: "all 0.2s ease",
  flexShrink: 0,
};

const topbarActiveTabStyle: React.CSSProperties = {
  ...topbarTabStyle,
  backgroundColor: "#6366f1",
  color: "#f5f5f5",
};

export function PlatformTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  variant = "sidebar",
}: PlatformTabsProps) {
  if (variant === "topbar") {
    return (
      <>
        <style>{`
          .platform-topbar::-webkit-scrollbar { display: none; }
          .platform-topbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div
          className="platform-topbar"
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "2px",
            padding: "8px 12px",
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              style={
                selectedCategory === category.id
                  ? topbarActiveTabStyle
                  : topbarTabStyle
              }
              onClick={() => onSelectCategory(category.id)}
              onMouseEnter={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.backgroundColor = "#222";
                  e.currentTarget.style.color = "#f5f5f5";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#888";
                }
              }}
              title={category.label}
            >
              <Icon name={category.icon as any} size={18} />
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <div>
      <h3
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: "#666",
          marginBottom: "16px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Platforms
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {categories.map((category) => (
          <button
            key={category.id}
            style={
              selectedCategory === category.id
                ? sidebarActiveTabStyle
                : sidebarTabStyle
            }
            onClick={() => onSelectCategory(category.id)}
            onMouseEnter={(e) => {
              if (selectedCategory !== category.id) {
                e.currentTarget.style.backgroundColor = "#222";
                e.currentTarget.style.color = "#f5f5f5";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category.id) {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#888";
              }
            }}
          >
            <Icon name={category.icon as any} size={16} />
            <span style={{ textTransform: "capitalize" }}>{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}