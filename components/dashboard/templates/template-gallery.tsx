import { TemplateCard } from "./template-card";

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

interface TemplateGalleryProps {
  templates: Template[];
  loading: boolean;
  onSelectTemplate: (template: Template) => void;
}

const galleryStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "16px",
};

const emptyStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "60px 20px",
  color: "#888",
};

const emptyIconStyle: React.CSSProperties = {
  fontSize: "48px",
  marginBottom: "16px",
};

const loadingStyle: React.CSSProperties = {
  ...emptyStyle,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
};

const spinnerStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  border: "3px solid #222",
  borderTopColor: "#6366f1",
  borderRadius: "50%",
};

export function TemplateGallery({
  templates,
  loading,
  onSelectTemplate,
}: TemplateGalleryProps) {
  if (loading) {
    return (
      <div style={loadingStyle}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ ...spinnerStyle, animation: "spin 1s linear infinite" }} />
        <p>Loading templates...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div style={emptyStyle}>
        <div style={emptyIconStyle}>📋</div>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#f5f5f5",
          }}
        >
          No templates found
        </h3>
        <p style={{ fontSize: "14px", color: "#888" }}>
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div style={galleryStyle}>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onSelectTemplate}
        />
      ))}
    </div>
  );
}