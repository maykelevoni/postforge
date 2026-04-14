import { useState, useEffect } from "react";
import { TemplateGallery } from "./template-gallery";

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

interface TemplateSelectionModalProps {
  platform: string;
  onSelectTemplate: (templateId: string) => void;
  onSkip: () => void;
  onClose: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "800px",
  maxHeight: "80vh",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  padding: "24px",
  borderBottom: "1px solid #222",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#f5f5f5",
};

const closeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#888",
  fontSize: "24px",
  cursor: "pointer",
  padding: "4px",
  lineHeight: 1,
};

const contentStyle: React.CSSProperties = {
  padding: "24px",
  overflowY: "auto",
  flex: 1,
};

const footerStyle: React.CSSProperties = {
  padding: "16px 24px",
  borderTop: "1px solid #222",
  display: "flex",
  gap: "12px",
  justifyContent: "flex-end",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 24px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#222",
  color: "#888",
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#6366f1",
  color: "#f5f5f5",
};

export function TemplateSelectionModal({
  platform,
  onSelectTemplate,
  onSkip,
  onClose,
}: TemplateSelectionModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch templates for the platform
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/templates?category=${platform}`);
        const data = await response.json();
        if (response.ok) {
          setTemplates(data.templates || []);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [platform]);

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template.id);
    onClose();
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Choose a Template</h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={contentStyle}>
          <p
            style={{
              fontSize: "14px",
              color: "#888",
              marginBottom: "20px",
            }}
          >
            Select a template for {platform.toUpperCase()} content generation,
            or skip to generate without a template.
          </p>

          <TemplateGallery
            templates={templates}
            loading={loading}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>

        <div style={footerStyle}>
          <button onClick={onSkip} style={secondaryButtonStyle}>
            Skip (Generate Without Template)
          </button>
        </div>
      </div>
    </div>
  );
}