import { useState } from "react";
import { Icon } from "@/components/ui/icon";

interface Template {
  id?: string;
  name: string;
  category: string;
  type: "prebuilt" | "custom";
  template: string;
  variables: Record<string, any>;
  constraints: Record<string, any>;
  example?: string;
}

interface TemplateEditorProps {
  template?: Template;
  onSave: (template: Omit<Template, "id">) => void;
  onCancel: () => void;
}

const containerStyle: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: "600",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: "6px",
  color: "#f5f5f5",
  fontSize: "14px",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "100px",
  resize: "vertical",
  fontFamily: "monospace",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  marginTop: "24px",
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

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#6366f1",
  color: "#f5f5f5",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#222",
  color: "#888",
};

export function TemplateEditor({
  template,
  onSave,
  onCancel,
}: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || "");
  const [category, setCategory] = useState(template?.category || "twitter");
  const [templateText, setTemplateText] = useState(template?.template || "");
  const [example, setExample] = useState(template?.example || "");

  const categories = [
    "twitter",
    "linkedin",
    "reddit",
    "instagram",
    "tiktok",
    "email_subject",
    "email_body",
    "image_prompt",
    "video_prompt",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !templateText) {
      alert("Name and template are required");
      return;
    }

    onSave({
      name,
      category,
      template: templateText,
      variables: {},
      constraints: {},
      type: "custom",
      example: example || undefined,
    });
  };

  return (
    <div style={containerStyle}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "700",
          color: "#f5f5f5",
          marginBottom: "24px",
        }}
      >
        {template?.id ? "Edit Template" : "Create Template"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Viral Twitter Hook"
            style={inputStyle}
            required
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Template</label>
          <textarea
            value={templateText}
            onChange={(e) => setTemplateText(e.target.value)}
            placeholder="e.g., {number} ways to {benefit} without {pain} in {time}"
            style={textareaStyle}
            required
          />
          <p
            style={{
              fontSize: "12px",
              color: "#888",
              marginTop: "8px",
            }}
          >
            Use {"{variable}"} syntax for placeholders
          </p>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Example (optional)</label>
          <textarea
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder="Example of filled template..."
            style={textareaStyle}
          />
        </div>

        <div style={buttonGroupStyle}>
          <button type="submit" style={primaryButtonStyle}>
            Save Template
          </button>
          <button type="button" onClick={onCancel} style={secondaryButtonStyle}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}