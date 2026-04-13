"use client";

import { useState } from "react";

interface ApiKeysSectionProps {
  settings: Record<string, string>;
  onSave: (key: string, value: string) => void;
}

const sectionStyle: React.CSSProperties = {
  marginBottom: "48px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "24px",
  color: "#f5f5f5",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "24px",
};

const formGroupStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#888",
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

const fullGridStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
};

export default function ApiKeysSection({ settings, onSave }: ApiKeysSectionProps) {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState(settings);

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    onSave(key, value);
  };

  const renderInput = (key: string, label: string, isPassword = false) => {
    const value = values[key] || "";
    const isShowingKey = showKeys[key];

    return (
      <div key={key} style={formGroupStyle}>
        <label style={labelStyle}>{label}</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type={isPassword && !isShowingKey ? "password" : "text"}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            style={inputStyle}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => toggleShowKey(key)}
              style={{
                padding: "10px 16px",
                backgroundColor: "#222",
                border: "1px solid #333",
                borderRadius: "4px",
                color: "#888",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {isShowingKey ? "Hide" : "Show"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={sectionStyle}>
      <h2 style={headingStyle}>API Keys</h2>
      <div style={gridStyle}>
        {renderInput("openrouter_api_key", "OpenRouter API Key", true)}
        {renderInput("openrouter_model", "OpenRouter Model", false)}
        {renderInput("falai_api_key", "fal.ai API Key", true)}
        {renderInput("postbridge_api_key", "post-bridge API Key", true)}
        {renderInput("clickbank_api_key", "ClickBank API Key", true)}
        {renderInput("clickbank_account", "ClickBank Account", false)}
        {renderInput("systeme_domain", "Systeme.io Domain", false)}
        {renderInput("systeme_funnel_url", "Systeme.io Funnel URL", false)}
        {renderInput("systeme_api_key", "Systeme.io API Key", true)}
        {renderInput("youtube_api_key", "YouTube API Key", true)}
        {renderInput("newsapi_key", "NewsAPI Key", true)}
        <div style={fullGridStyle}>
          {renderInput("research_subreddits", "Research Subreddits (comma-separated)", false)}
        </div>
      </div>
    </div>
  );
}
