import { Icon } from "@/components/ui/icon";

interface Template {
  id: string;
  name: string;
  category: string;
  type: "prebuilt" | "custom";
  example?: string;
  variables: Record<string, any>;
  isFavorite: boolean;
  usageCount: number;
}

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  padding: "20px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "12px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const exampleStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
  lineHeight: "1.5",
  marginBottom: "12px",
  fontStyle: "italic",
};

const metaStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  fontSize: "12px",
  color: "#666",
};

const badgeStyle: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase",
};

const prebuiltBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  backgroundColor: "#6366f120",
  color: "#6366f1",
};

const customBadgeStyle: React.CSSProperties = {
  ...badgeStyle,
  backgroundColor: "#22c55e20",
  color: "#22c55e",
};

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <div
      style={cardStyle}
      onClick={() => onSelect(template)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#222";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h3 style={titleStyle}>{template.name}</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <span
              style={
                template.type === "prebuilt"
                  ? prebuiltBadgeStyle
                  : customBadgeStyle
              }
            >
              {template.type === "prebuilt" ? "Pre-built" : "Custom"}
            </span>
            <span
              style={{
                ...badgeStyle,
                backgroundColor: "#88820",
                color: "#888",
              }}
            >
              {template.category}
            </span>
          </div>
        </div>
        {template.isFavorite && (
          <span style={{ fontSize: "16px" }}>⭐</span>
        )}
      </div>

      {template.example && (
        <p style={exampleStyle}> "{template.example}"</p>
      )}

      <div style={metaStyle}>
        <span>
          {Object.keys(template.variables || {}).length} variables
        </span>
        <span>Used {template.usageCount} times</span>
      </div>
    </div>
  );
}