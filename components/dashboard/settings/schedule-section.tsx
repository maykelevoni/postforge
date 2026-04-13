"use client";

import { useState } from "react";

interface ScheduleSectionProps {
  settings: Record<string, string>;
  schedules: Array<{
    platform: string;
    time: string;
    daysOfWeek: string;
    active: boolean;
  }>;
  onSave: (key: string, value: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const sectionStyle: React.CSSProperties = {
  marginBottom: "48px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "24px",
  color: "#f5f5f5",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#111",
  borderRadius: "8px",
  overflow: "hidden",
};

const headerCellStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#1a1a1a",
  color: "#888",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
};

const cellStyle: React.CSSProperties = {
  padding: "12px",
  borderTop: "1px solid #222",
};

const labelStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#f5f5f5",
};

const timeInputStyle: React.CSSProperties = {
  padding: "6px 10px",
  backgroundColor: "#0a0a0a",
  border: "1px solid #222",
  borderRadius: "4px",
  color: "#f5f5f5",
  fontSize: "14px",
};

const checkboxStyle: React.CSSProperties = {
  width: "16px",
  height: "16px",
  cursor: "pointer",
};

export default function ScheduleSection({
  schedules,
  onSave,
}: ScheduleSectionProps) {
  const [localSchedules, setLocalSchedules] = useState(schedules);

  const handleUpdate = (index: number, field: string, value: any) => {
    const newSchedules = [...localSchedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setLocalSchedules(newSchedules);

    // Save to settings
    const platform = newSchedules[index].platform;
    if (field === "time") {
      onSave(`schedule_${platform}_time`, value);
    } else if (field === "active") {
      onSave(`schedule_${platform}_active`, value.toString());
    } else if (field === "daysOfWeek") {
      onSave(`schedule_${platform}_days`, JSON.stringify(value));
    }
  };

  const toggleDay = (index: number, dayIndex: number) => {
    const schedule = localSchedules[index];
    const currentDays = JSON.parse(schedule.daysOfWeek || "[1,2,3,4,5]");
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter((d: number) => d !== dayIndex)
      : [...currentDays, dayIndex];
    handleUpdate(index, "daysOfWeek", newDays);
  };

  return (
    <div style={sectionStyle}>
      <h2 style={headingStyle}>Schedule</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Platform</th>
            <th style={headerCellStyle}>Time</th>
            <th style={headerCellStyle}>Days</th>
            <th style={headerCellStyle}>Active</th>
          </tr>
        </thead>
        <tbody>
          {localSchedules.map((schedule, index) => (
            <tr key={schedule.platform}>
              <td style={cellStyle}>
                <span style={labelStyle}>{schedule.platform}</span>
              </td>
              <td style={cellStyle}>
                <input
                  type="time"
                  value={schedule.time}
                  onChange={(e) => handleUpdate(index, "time", e.target.value)}
                  style={timeInputStyle}
                />
              </td>
              <td style={cellStyle}>
                {DAYS.map((day, dayIndex) => (
                  <label key={day} style={{ marginRight: "8px", fontSize: "12px", color: "#888" }}>
                    <input
                      type="checkbox"
                      checked={JSON.parse(schedule.daysOfWeek || "[1,2,3,4,5]").includes(dayIndex)}
                      onChange={() => toggleDay(index, dayIndex)}
                      style={checkboxStyle}
                    />
                    {day}
                  </label>
                ))}
              </td>
              <td style={cellStyle}>
                <input
                  type="checkbox"
                  checked={schedule.active}
                  onChange={(e) => handleUpdate(index, "active", e.target.checked)}
                  style={checkboxStyle}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
