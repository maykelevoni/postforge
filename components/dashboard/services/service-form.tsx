"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ServiceFormProps {
  service?: {
    id: string;
    name: string;
    description: string;
    type: string;
    deliverables: string;
    priceMin: number;
    priceMax: number;
    turnaroundDays: number;
    funnelUrl: string | null;
  } | null;
  onSave: (data: ServiceFormData) => void;
  onCancel: () => void;
}

export interface ServiceFormData {
  name: string;
  description: string;
  type: string;
  deliverables: string;
  priceMin: number;
  priceMax: number;
  turnaroundDays: number;
  funnelUrl: string;
}

const SERVICE_TYPES = [
  { value: "video_content", label: "Video Content" },
  { value: "social_package", label: "Social Package" },
  { value: "newsletter_package", label: "Newsletter Package" },
  { value: "landing_page", label: "Landing Page" },
  { value: "content_strategy", label: "Content Strategy" },
];

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
  padding: "20px",
};

const formCardStyle: React.CSSProperties = {
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "8px",
  maxWidth: "560px",
  width: "100%",
  maxHeight: "90vh",
  overflow: "auto",
  padding: "32px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#f5f5f5",
};

const closeButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#888",
  fontSize: "24px",
  cursor: "pointer",
  padding: "0",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#f5f5f5",
};

const requiredIndicatorStyle: React.CSSProperties = {
  color: "#ef4444",
  marginLeft: "2px",
};

const hintStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#888",
  marginTop: "4px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "14px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  fontFamily: "inherit",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  marginTop: "32px",
  paddingTop: "24px",
  borderTop: "1px solid #222",
};

const buttonStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const primaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#6366f1",
  color: "white",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "transparent",
  border: "1px solid #222",
  color: "#888",
};

const errorStyle: React.CSSProperties = {
  color: "#ef4444",
  fontSize: "12px",
  marginTop: "4px",
};

export default function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    type: "video_content",
    deliverables: "",
    priceMin: 0,
    priceMax: 0,
    turnaroundDays: 3,
    funnelUrl: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        type: service.type,
        deliverables: service.deliverables,
        priceMin: service.priceMin,
        priceMax: service.priceMax,
        turnaroundDays: service.turnaroundDays,
        funnelUrl: service.funnelUrl || "",
      });
    }
  }, [service]);

  const handleChange = (
    field: keyof ServiceFormData,
    value: string | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.deliverables.trim()) {
      newErrors.deliverables = "Deliverables template is required";
    }
    if (formData.priceMin <= 0) {
      newErrors.priceMin = "Minimum price must be greater than 0";
    }
    if (formData.priceMax <= 0) {
      newErrors.priceMax = "Maximum price must be greater than 0";
    }
    if (formData.priceMin >= formData.priceMax) {
      newErrors.priceMax = "Maximum price must be greater than minimum price";
    }
    if (formData.turnaroundDays <= 0) {
      newErrors.turnaroundDays = "Turnaround must be at least 1 day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={formCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{service ? "Edit Service" : "Create Service"}</h2>
          <button onClick={onCancel} style={closeButtonStyle}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Name
              <span style={requiredIndicatorStyle}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Video Content Package"
              style={inputStyle}
            />
            {errors.name && <div style={errorStyle}>{errors.name}</div>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Type
              <span style={requiredIndicatorStyle}>*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              style={selectStyle}
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Description
              <span style={requiredIndicatorStyle}>*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of your service..."
              rows={3}
              style={textareaStyle}
            />
            {errors.description && <div style={errorStyle}>{errors.description}</div>}
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Deliverables Template
              <span style={requiredIndicatorStyle}>*</span>
            </label>
            <textarea
              value={formData.deliverables}
              onChange={(e) => handleChange("deliverables", e.target.value)}
              placeholder="Generate 10 video scripts about [niche] with engaging hooks and clear calls-to-action. Each script should be 60-90 seconds long."
              rows={6}
              style={textareaStyle}
            />
            <div style={hintStyle}>
              Use {"[niche]"} as a placeholder — it will be replaced with the client's niche when generating deliverables.
            </div>
            {errors.deliverables && (
              <div style={errorStyle}>{errors.deliverables}</div>
            )}
          </div>

          <div style={gridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Price Min ($)
                <span style={requiredIndicatorStyle}>*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.priceMin || ""}
                onChange={(e) => handleChange("priceMin", parseFloat(e.target.value) || 0)}
                placeholder="99"
                style={inputStyle}
              />
              {errors.priceMin && <div style={errorStyle}>{errors.priceMin}</div>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Price Max ($)
                <span style={requiredIndicatorStyle}>*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.priceMax || ""}
                onChange={(e) => handleChange("priceMax", parseFloat(e.target.value) || 0)}
                placeholder="299"
                style={inputStyle}
              />
              {errors.priceMax && <div style={errorStyle}>{errors.priceMax}</div>}
            </div>
          </div>

          <div style={gridStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Turnaround (days)
                <span style={requiredIndicatorStyle}>*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.turnaroundDays || ""}
                onChange={(e) => handleChange("turnaroundDays", parseInt(e.target.value) || 0)}
                placeholder="3"
                style={inputStyle}
              />
              {errors.turnaroundDays && <div style={errorStyle}>{errors.turnaroundDays}</div>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Funnel URL (optional)</label>
              <input
                type="url"
                value={formData.funnelUrl}
                onChange={(e) => handleChange("funnelUrl", e.target.value)}
                placeholder="https://example.com/your-landing-page"
                style={inputStyle}
              />
              <div style={hintStyle}>Link to your landing page (optional)</div>
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <button type="button" onClick={onCancel} style={secondaryButtonStyle}>
              Cancel
            </button>
            <button type="submit" style={primaryButtonStyle}>
              {service ? "Save Changes" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
