interface TemplateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: "200px",
  padding: "12px 16px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "6px",
  color: "#f5f5f5",
  fontSize: "14px",
  outline: "none",
};

const searchInputFocusStyle: React.CSSProperties = {
  ...searchInputStyle,
  borderColor: "#6366f1",
};

const filterGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 16px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "6px",
  color: "#888",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#6366f1",
  color: "#f5f5f5",
  borderColor: "#6366f1",
};

export function TemplateFilters({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
}: TemplateFiltersProps) {
  return (
    <div style={containerStyle}>
      <input
        type="text"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        style={searchQuery ? searchInputFocusStyle : searchInputStyle}
        onFocus={(e) => {
          Object.assign(e.currentTarget.style, searchInputFocusStyle);
        }}
        onBlur={(e) => {
          if (!searchQuery) {
            Object.assign(e.currentTarget.style, searchInputStyle);
          }
        }}
      />

      <div style={filterGroupStyle}>
        <button
          style={filterType === "all" ? activeButtonStyle : buttonStyle}
          onClick={() => onFilterChange("all")}
          onMouseEnter={(e) => {
            if (filterType !== "all") {
              e.currentTarget.style.backgroundColor = "#222";
              e.currentTarget.style.color = "#f5f5f5";
            }
          }}
          onMouseLeave={(e) => {
            if (filterType !== "all") {
              Object.assign(e.currentTarget.style, buttonStyle);
            }
          }}
        >
          All
        </button>
        <button
          style={filterType === "prebuilt" ? activeButtonStyle : buttonStyle}
          onClick={() => onFilterChange("prebuilt")}
          onMouseEnter={(e) => {
            if (filterType !== "prebuilt") {
              e.currentTarget.style.backgroundColor = "#222";
              e.currentTarget.style.color = "#f5f5f5";
            }
          }}
          onMouseLeave={(e) => {
            if (filterType !== "prebuilt") {
              Object.assign(e.currentTarget.style, buttonStyle);
            }
          }}
        >
          Pre-built
        </button>
        <button
          style={filterType === "custom" ? activeButtonStyle : buttonStyle}
          onClick={() => onFilterChange("custom")}
          onMouseEnter={(e) => {
            if (filterType !== "custom") {
              e.currentTarget.style.backgroundColor = "#222";
              e.currentTarget.style.color = "#f5f5f5";
            }
          }}
          onMouseLeave={(e) => {
            if (filterType !== "custom") {
              Object.assign(e.currentTarget.style, buttonStyle);
            }
          }}
        >
          Custom
        </button>
        <button
          style={filterType === "favorites" ? activeButtonStyle : buttonStyle}
          onClick={() => onFilterChange("favorites")}
          onMouseEnter={(e) => {
            if (filterType !== "favorites") {
              e.currentTarget.style.backgroundColor = "#222";
              e.currentTarget.style.color = "#f5f5f5";
            }
          }}
          onMouseLeave={(e) => {
            if (filterType !== "favorites") {
              Object.assign(e.currentTarget.style, buttonStyle);
            }
          }}
        >
          ⭐ Favorites
        </button>
      </div>
    </div>
  );
}