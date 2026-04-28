"use client";

import { useEffect, useState, Suspense } from "react";
import ApiKeysSection from "@/components/dashboard/settings/api-keys-section";
import ScheduleSection from "@/components/dashboard/settings/schedule-section";
import LinkedInConnect from "@/components/dashboard/settings/linkedin-connect";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { seedDefaults } from "@/lib/seeds";

const TIMEZONES = [
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const pageStyle: React.CSSProperties = {
  padding: "24px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#f5f5f5",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: "600",
  color: "white",
  backgroundColor: "#6366f1",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

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

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const toggleStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  backgroundColor: "#111",
  border: "1px solid #222",
  borderRadius: "4px",
};

const messageStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "4px",
  marginBottom: "24px",
  fontSize: "14px",
  fontWeight: "500",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [schedules, setSchedules] = useState<any[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
    loadSchedules();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const loadSchedules = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        // Schedules would come from a separate API or be included in settings
        // For now, we'll create default ones
        const defaultSchedules = [
          { platform: "twitter", time: "09:00", daysOfWeek: "[1,2,3,4,5]", active: true },
          { platform: "linkedin", time: "10:00", daysOfWeek: "[1,2,3,4,5]", active: true },
          { platform: "reddit", time: "12:00", daysOfWeek: "[2,4]", active: true },
          { platform: "instagram", time: "14:00", daysOfWeek: "[1,2,3,4,5]", active: true },
          { platform: "tiktok", time: "17:00", daysOfWeek: "[1,2,3,4,5]", active: true },
          { platform: "email", time: "08:00", daysOfWeek: "[1,2,3,4,5]", active: true },
        ];
        setSchedules(defaultSchedules);
      }
    } catch (error) {
      console.error("Failed to load schedules:", error);
    }
  };

  const handleChange = (key: string, value: string) => {
    setPendingChanges(prev => ({ ...prev, [key]: value }));
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setMessage(null);

    const allChanges = {
      ...pendingChanges,
      ...settings,
    };

    const settingsArray = Object.entries(allChanges).map(([key, value]) => ({
      key,
      value,
    }));

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: settingsArray }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setPendingChanges({});
        await loadSettings();
      } else {
        setMessage({ type: "error", text: "Failed to save settings." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving." });
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Settings</h1>
        <button onClick={handleSave} style={buttonStyle}>
          Save Changes
        </button>
      </div>

      {message && (
        <div
          style={{
            ...messageStyle,
            backgroundColor: message.type === "success" ? "#1a4d1a" : "#4d1a1a",
            color: message.type === "success" ? "#90ee90" : "#ee9090",
          }}
        >
          {message.text}
        </div>
      )}

      <ApiKeysSection settings={settings} onSave={handleChange} />
      <Suspense fallback={null}>
        <LinkedInConnect
          isConnected={!!settings.linkedin_access_token}
          personUrn={settings.linkedin_person_urn}
        />
      </Suspense>
      <ScheduleSection settings={settings} schedules={schedules} onSave={handleChange} />

      <div style={sectionStyle}>
        <h2 style={headingStyle}>General</h2>
        <div style={gridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Timezone</label>
            <select
              value={settings.timezone || "America/New_York"}
              onChange={(e) => handleChange("timezone", e.target.value)}
              style={selectStyle}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Daily Run Hour (UTC)</label>
            <input
              type="number"
              min="0"
              max="23"
              value={settings.daily_run_hour || "7"}
              onChange={(e) => handleChange("daily_run_hour", e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={toggleStyle}>
          <input
            type="checkbox"
            id="gate_mode"
            checked={settings.gate_mode === "true"}
            onChange={(e) => handleChange("gate_mode", e.target.checked.toString())}
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label htmlFor="gate_mode" style={{ color: "#f5f5f5", fontSize: "14px", fontWeight: "500" }}>
            Gate Mode - When enabled, all content requires manual approval before posting
          </label>
        </div>
      </div>
    </div>
  );
}
