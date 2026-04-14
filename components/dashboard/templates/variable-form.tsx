import { useState } from "react";
import { Icon } from "@/components/ui/icon";

interface Variable {
  type: "text" | "number" | "ai_generated";
  required: boolean;
  default?: string | number;
  description?: string;
  placeholder?: string;
}

interface VariableFormProps {
  template: {
    id: string;
    name: string;
    variables: Record<string, Variable>;
  };
  aiVariables: Record<string, string>;
  productInfo: {
    name: string;
    description: string;
    url: string;
  };
  onConfirm: (variables: Record<string, string>) => void;
  onCancel: () => void;
}

const containerStyle: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#f5f5f5",
  marginBottom: "8px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888",
};

const variableGroupStyle: React.CSSProperties = {
  marginBottom: "16px",
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
  padding: "10px 12px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: "6px",
  color: "#f5f5f5",
  fontSize: "14px",
  outline: "none",
};

const aiBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 8px",
  backgroundColor: "#6366f120",
  color: "#6366f1",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
  marginLeft: "8px",
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

export function VariableForm({
  template,
  aiVariables,
  productInfo,
  onConfirm,
  onCancel,
}: VariableFormProps) {
  const [variables, setVariables] = useState<Record<string, string>>(aiVariables);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(variables);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          {template.name}
          <span style={aiBadgeStyle}>
            <Icon name="sparkles" size={12} />
            AI Generated Variables
          </span>
        </h2>
        <p style={subtitleStyle}>
          Review and customize the variables before generating content
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {Object.entries(template.variables).map(([key, variable]) => (
          <div key={key} style={variableGroupStyle}>
            <label style={labelStyle}>
              {key}
              {variable.required && <span style={{ color: "#ef4444" }}>*</span>}
              {variable.description && (
                <span style={{ color: "#888", fontWeight: "400", marginLeft: "8px" }}>
                  - {variable.description}
                </span>
              )}
            </label>
            <input
              type="text"
              value={variables[key] || ""}
              onChange={(e) =>
                setVariables({ ...variables, [key]: e.target.value })
              }
              placeholder={variable.placeholder || `Enter ${key}`}
              style={inputStyle}
              required={variable.required}
            />
          </div>
        ))}

        <div
          style={{
            padding: "16px",
            backgroundColor: "#0a0a0a",
            border: "1px solid #222",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          <p style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
            <strong>Product:</strong> {productInfo.name}
          </p>
          <p style={{ fontSize: "12px", color: "#888" }}>
            {productInfo.description}
          </p>
        </div>

        <div style={buttonGroupStyle}>
          <button type="submit" style={primaryButtonStyle}>
            Generate Content
          </button>
          <button type="button" onClick={onCancel} style={secondaryButtonStyle}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}